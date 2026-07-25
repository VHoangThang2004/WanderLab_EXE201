import { supabase } from '@/lib/supabase';

export type WebRTCState = 'idle' | 'ringing' | 'connecting' | 'connected' | 'ended' | 'failed';

export interface CallerInfo {
  name: string;
  avatar: string;
}

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private channel: any = null;
  
  private userId: string;
  private targetId: string;
  
  public onRemoteStream?: (stream: MediaStream) => void;
  public onCallStateChange?: (state: WebRTCState) => void;

  private isSubscribed: boolean = false;
  private msgQueue: any[] = [];
  private pendingRemoteCandidates: RTCIceCandidateInit[] = [];
  
  private isCaller: boolean = false;
  private state: WebRTCState = 'idle';

  constructor(userId: string, targetId: string) {
    this.userId = userId;
    this.targetId = targetId;
  }

  private setState(newState: WebRTCState) {
    if (this.state === newState) return;
    this.state = newState;
    console.log(`[WebRTC] State changed to: ${newState}`);
    if (this.onCallStateChange) {
      this.onCallStateChange(newState);
    }
  }

  public async initializeSignaling(): Promise<void> {
    if (this.channel) return;

    const channelName = `call_${[this.userId, this.targetId].sort().join('_')}`;
    console.log(`[WebRTC] Connecting to signaling channel: ${channelName}`);
    
    this.channel = supabase.channel(channelName);
    
    this.channel
      .on('broadcast', { event: 'webrtc-signal' }, async ({ payload }: any) => {
        if (payload.targetId !== this.userId) return;
        await this.handleSignal(payload.data);
      })
      .subscribe((status: string) => {
        console.log(`[WebRTC] Signaling status: ${status}`);
        if (status === 'SUBSCRIBED') {
          this.isSubscribed = true;
          this.flushMessageQueue();
        }
      });
  }

  private sendSignal(data: any) {
    const msg = {
      type: 'broadcast',
      event: 'webrtc-signal',
      payload: { targetId: this.targetId, data }
    };

    if (this.isSubscribed) {
      this.channel.send(msg);
    } else {
      this.msgQueue.push(msg);
    }
  }

  private flushMessageQueue() {
    while (this.msgQueue.length > 0) {
      const msg = this.msgQueue.shift();
      this.channel.send(msg);
    }
  }

  private async handleSignal(data: any) {
    console.log(`[WebRTC] Received signal:`, data.type);
    
    try {
      if (data.type === 'offer') {
        // UI handles incoming call via global signal, so we ignore offer here
        // as answerCall will be explicitly called by the user.
      } else if (data.type === 'answer') {
        if (this.peerConnection) {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
          this.processPendingCandidates();
        }
      } else if (data.type === 'ice-candidate') {
        if (this.peerConnection && this.peerConnection.remoteDescription) {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else {
          this.pendingRemoteCandidates.push(data.candidate);
        }
      } else if (data.type === 'end') {
        this.setState('ended');
        this.cleanup(false);
      } else if (data.type === 'reject') {
        this.setState('failed');
        this.cleanup(false);
      }
    } catch (err) {
      console.error('[WebRTC] Error handling signal:', err);
    }
  }

  private processPendingCandidates() {
    for (const candidate of this.pendingRemoteCandidates) {
      this.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
    }
    this.pendingRemoteCandidates = [];
  }

  private createPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        {
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        },
        {
          urls: 'turn:openrelay.metered.ca:443',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        },
        {
          urls: 'turn:openrelay.metered.ca:443?transport=tcp',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        }
      ]
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal({ type: 'ice-candidate', candidate: event.candidate });
      }
    };

    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        if (this.onRemoteStream) this.onRemoteStream(event.streams[0]);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState;
      console.log(`[WebRTC] PC State: ${state}`);
      if (state === 'connected') {
        this.setState('connected');
      } else if (state === 'failed' || state === 'disconnected') {
        this.setState('failed');
        this.cleanup(false);
      }
    };
  }

  private async getMedia(isVideoCall: boolean): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia({ video: isVideoCall, audio: true });
    } catch (e) {
      console.warn("[WebRTC] Media access denied or missing, falling back to audio only");
      try {
        return await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      } catch (e2) {
        console.warn("[WebRTC] Audio access denied, returning empty stream");
        return new MediaStream();
      }
    }
  }

  public async startCall(isVideoCall: boolean, callerInfo: CallerInfo): Promise<MediaStream> {
    this.isCaller = true;
    this.setState('ringing');
    
    await this.initializeSignaling();
    this.createPeerConnection();

    this.localStream = await this.getMedia(isVideoCall);
    this.localStream.getTracks().forEach(track => this.peerConnection?.addTrack(track, this.localStream!));

    const offer = await this.peerConnection!.createOffer();
    await this.peerConnection!.setLocalDescription(offer);

    // Broadcast globally to wake up the receiver's UI
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
        });
        setTimeout(() => supabase.removeChannel(ringChannel), 2000);
      }
    });

    return this.localStream;
  }

  public async answerCall(offer: RTCSessionDescriptionInit, isVideoCall: boolean): Promise<MediaStream> {
    this.isCaller = false;
    this.setState('connecting');
    
    await this.initializeSignaling();
    this.createPeerConnection();

    this.localStream = await this.getMedia(isVideoCall);
    this.localStream.getTracks().forEach(track => this.peerConnection?.addTrack(track, this.localStream!));

    await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offer));
    this.processPendingCandidates();

    const answer = await this.peerConnection!.createAnswer();
    await this.peerConnection!.setLocalDescription(answer);

    this.sendSignal({ type: 'answer', answer });

    return this.localStream;
  }

  public rejectCall() {
    this.setState('failed');
    this.initializeSignaling().then(() => {
      this.sendSignal({ type: 'reject' });
      setTimeout(() => this.cleanup(false), 1000);
    });
  }

  public endCall(broadcast: boolean = true) {
    this.setState('ended');
    if (broadcast) {
      this.sendSignal({ type: 'end' });
    }
    setTimeout(() => this.cleanup(false), 500);
  }

  private cleanup(broadcastEnd: boolean = true) {
    if (broadcastEnd && this.channel) {
      this.sendSignal({ type: 'end' });
    }
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }
    
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    if (this.channel) {
      setTimeout(() => {
        supabase.removeChannel(this.channel);
        this.channel = null;
      }, 1000);
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
