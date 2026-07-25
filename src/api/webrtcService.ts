import { supabase } from '@/lib/supabase';

// Helper class to manage WebRTC connections via Supabase Realtime Signaling
export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private channel: any = null;
  
  private userId: string;
  private targetId: string;
  
  public onRemoteStream?: (stream: MediaStream) => void;
  public onCallEnded?: () => void;
  public onCallStateChange?: (state: 'ringing' | 'connected' | 'ended' | 'failed') => void;

  private pendingIceCandidates: RTCIceCandidateInit[] = [];
  private localIceCandidates: RTCIceCandidateInit[] = [];
  private isCaller: boolean = false;
  private hasReceivedAnswer: boolean = false;
  private isSubscribed: boolean = false;
  private pendingBroadcasts: any[] = [];

  constructor(userId: string, targetId: string) {
    this.userId = userId;
    this.targetId = targetId;
    
    // Create a unique channel for this pair (alphabetical order prevents duplication)
    const channelName = `call_${[userId, targetId].sort().join('_')}`;
    console.log(`[WebRTC] Initializing for ${userId} to ${targetId}. Channel: ${channelName}`);
    this.channel = supabase.channel(channelName);
    
    this.setupSignaling();
  }

  private setupSignaling() {
    this.channel
      .on('broadcast', { event: 'webrtc-offer' }, async (payload: any) => {
        console.log('[WebRTC] Received offer', payload);
        if (payload.payload.targetId !== this.userId) return;
        await this.handleOffer(payload.payload.offer);
      })
      .on('broadcast', { event: 'webrtc-answer' }, async (payload: any) => {
        console.log('[WebRTC] Received answer', payload);
        if (payload.payload.targetId !== this.userId) return;
        await this.handleAnswer(payload.payload.answer);
      })
      .on('broadcast', { event: 'webrtc-ice' }, async (payload: any) => {
        console.log('[WebRTC] Received ICE candidate', payload);
        if (payload.payload.targetId !== this.userId) return;
        await this.handleIceCandidate(payload.payload.candidate);
      })
      .on('broadcast', { event: 'webrtc-end' }, (payload: any) => {
        console.log('[WebRTC] Received end call');
        if (payload.payload.targetId !== this.userId) return;
        this.endCall(false); // don't broadcast end again
      })
      .subscribe((status: string) => {
        console.log(`[WebRTC] Channel status: ${status}`);
        if (status === 'SUBSCRIBED') {
          this.isSubscribed = true;
          console.log(`[WebRTC] Flushing ${this.pendingBroadcasts.length} pending broadcasts`);
          for (const msg of this.pendingBroadcasts) {
            this.channel.send(msg);
          }
          this.pendingBroadcasts = [];
        }
      });
  }

  private safeSend(msg: any) {
    if (this.isSubscribed) {
      console.log('[WebRTC] Sending broadcast:', msg.event);
      this.channel.send(msg);
    } else {
      console.log('[WebRTC] Buffering broadcast (not subscribed):', msg.event);
      this.pendingBroadcasts.push(msg);
    }
  }

  private initPeerConnection() {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    };
    
    this.peerConnection = new RTCPeerConnection(configuration);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        if (this.hasReceivedAnswer || !this.isCaller) {
          this.safeSend({
            type: 'broadcast',
            event: 'webrtc-ice',
            payload: { targetId: this.targetId, candidate: event.candidate }
          });
        } else {
          // Caller buffers ICE candidates until answer is received
          this.localIceCandidates.push(event.candidate);
        }
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      if (this.onRemoteStream) {
        this.onRemoteStream(this.remoteStream);
      }
    };
    
    this.peerConnection.onconnectionstatechange = () => {
      console.log('[WebRTC] Connection state changed:', this.peerConnection?.connectionState);
      if (this.peerConnection?.connectionState === 'connected') {
        if (this.onCallStateChange) this.onCallStateChange('connected');
      } else if (this.peerConnection?.connectionState === 'failed' || this.peerConnection?.connectionState === 'disconnected') {
        if (this.onCallStateChange) this.onCallStateChange('failed');
        this.endCall(false);
      }
    };
  }

  private async getMediaStream(isVideoCall: boolean): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: isVideoCall,
        audio: true
      });
    } catch (err) {
      console.warn("Failed to get video+audio, trying audio only", err);
      try {
        return await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      } catch (err2) {
        console.warn("Failed to get audio, proceeding without media", err2);
        return new MediaStream(); // Return empty stream so call doesn't fail
      }
    }
  }

  public async startCall(isVideoCall: boolean, callerInfo?: {name: string, avatar: string}): Promise<MediaStream> {
    this.isCaller = true;
    this.initPeerConnection();
    
    try {
      this.localStream = await this.getMediaStream(isVideoCall);
      
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection) {
          this.peerConnection.addTrack(track, this.localStream!);
        }
      });
      
      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);
      
      console.log('[WebRTC] Created offer, sending...');
      this.safeSend({
        type: 'broadcast',
        event: 'webrtc-offer',
        payload: { targetId: this.targetId, offer }
      });
      
      if (callerInfo) {
        console.log(`[WebRTC] Ringing target on user_signals_${this.targetId}...`);
        const ringChannel = supabase.channel(`user_signals_${this.targetId}`);
        ringChannel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await ringChannel.send({
              type: 'broadcast',
              event: 'incoming_call',
              payload: {
                callerId: this.userId,
                callerName: callerInfo.name,
                callerAvatar: callerInfo.avatar,
                isVideoCall,
                offer
              }
            }).then((res) => {
              console.log("[WebRTC] Ring signal sent:", res);
            }).catch((err) => {
              console.error("[WebRTC] Failed to send ring signal:", err);
            });
            setTimeout(() => supabase.removeChannel(ringChannel), 3000); // Wait longer before removing
          }
        });
      }
      
      return this.localStream;
    } catch (err) {
      console.error("Error accessing media devices.", err);
      throw err;
    }
  }

  public async answerCall(offer: RTCSessionDescriptionInit, isVideoCall: boolean): Promise<MediaStream> {
    this.isCaller = false;
    this.initPeerConnection();
    
    try {
      this.localStream = await this.getMediaStream(isVideoCall);
      
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection) {
          this.peerConnection.addTrack(track, this.localStream!);
        }
      });
      
      await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Process any pending ICE candidates
      for (const candidate of this.pendingIceCandidates) {
        try {
          await this.peerConnection!.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Failed to add pending ice candidate", e);
        }
      }
      this.pendingIceCandidates = [];

      const answer = await this.peerConnection!.createAnswer();
      await this.peerConnection!.setLocalDescription(answer);
      
      console.log('[WebRTC] Created answer, sending...');
      this.safeSend({
        type: 'broadcast',
        event: 'webrtc-answer',
        payload: { targetId: this.targetId, answer }
      });
      
      return this.localStream;
    } catch (err) {
      console.error("Error answering call.", err);
      throw err;
    }
  }

  private async handleOffer(offer: RTCSessionDescriptionInit) {
    // This is handled by UI calling answerCall() when user accepts
    // We can emit an event here to notify UI of incoming call
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (this.peerConnection) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      this.hasReceivedAnswer = true;
      
      // Flush buffered local candidates
      for (const candidate of this.localIceCandidates) {
        this.safeSend({
          type: 'broadcast',
          event: 'webrtc-ice',
          payload: { targetId: this.targetId, candidate }
        });
      }
      this.localIceCandidates = [];
      
      // Process any pending remote ICE candidates
      for (const candidate of this.pendingIceCandidates) {
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Failed to add pending ice candidate", e);
        }
      }
      this.pendingIceCandidates = [];
    }
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (this.peerConnection && this.peerConnection.remoteDescription) {
      try {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error('Error adding received ice candidate', e);
      }
    } else {
      // Store candidate until remote description is set
      this.pendingIceCandidates.push(candidate);
    }
  }

  public endCall(broadcast: boolean = true) {
    if (broadcast && this.channel) {
      this.safeSend({
        type: 'broadcast',
        event: 'webrtc-end',
        payload: { targetId: this.targetId }
      });
    }
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    if (this.onCallEnded) {
      this.onCallEnded();
    }
    
    if (this.channel) {
      supabase.removeChannel(this.channel);
    }
  }
  
  public toggleMute(isMuted: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }

  public toggleVideo(isVideoOff: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOff;
      });
    }
  }
}
