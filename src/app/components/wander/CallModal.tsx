import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, Maximize, Minimize } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { WebRTCService, WebRTCState } from '@/api/webrtcService';
import { messageService } from '@/api/messageService';
import { useAuthStore } from '@/stores';

// Free ringing sound from Mixkit
const RINGTONE_URL = "https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3";
const BUSY_TONE_URL = "https://assets.mixkit.co/active_storage/sfx/2871/2871-preview.mp3";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callerName: string;
  callerAvatar: string;
  isVideoCall: boolean;
  targetId: string;
  isIncoming?: boolean;
  incomingOffer?: any;
}

export function CallModal({ isOpen, onClose, callerName, callerAvatar, isVideoCall, targetId, isIncoming, incomingOffer }: CallModalProps) {
  const { user } = useAuthStore();
  const [callState, setCallState] = useState<WebRTCState>(isIncoming ? 'ringing' : 'idle');
  const [hasAccepted, setHasAccepted] = useState(!isIncoming);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcRef = useRef<WebRTCService | null>(null);
  const ringtoneAudioRef = useRef<HTMLAudioElement | null>(null);

  // Manage Ringtone
  useEffect(() => {
    if (callState === 'ringing' || callState === 'idle') {
      if (!ringtoneAudioRef.current) {
        const audio = new Audio(RINGTONE_URL);
        audio.loop = true;
        ringtoneAudioRef.current = audio;
      }
      ringtoneAudioRef.current.play().catch(e => console.log('Audio autoplay blocked', e));
    } else if (callState === 'failed') {
      if (ringtoneAudioRef.current) {
        ringtoneAudioRef.current.pause();
      }
      const busyAudio = new Audio(BUSY_TONE_URL);
      busyAudio.play().catch(e => console.log('Audio autoplay blocked', e));
    } else {
      if (ringtoneAudioRef.current) {
        ringtoneAudioRef.current.pause();
        ringtoneAudioRef.current.currentTime = 0;
      }
    }
    
    return () => {
      if (ringtoneAudioRef.current) {
        ringtoneAudioRef.current.pause();
      }
    };
  }, [callState]);

  useEffect(() => {
    if (isOpen && user?.id) {
      setCallState(isIncoming ? 'ringing' : 'idle');
      setCallDuration(0);
      setIsMuted(false);
      setIsVideoOff(false);

      const rtc = new WebRTCService(user.id, targetId);
      webrtcRef.current = rtc;

      rtc.onCallStateChange = (state) => {
        setCallState(state);
        if (state === 'ended' || state === 'failed') {
          setTimeout(() => onClose(), 1500);
        }
      };

      rtc.onRemoteStream = (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      };

      if (!isIncoming) {
        const callerInfo = {
          name: user.full_name || 'Người dùng',
          avatar: user.avatar_url || ''
        };
        rtc.startCall(isVideoCall, callerInfo).then(stream => {
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        }).catch(err => {
          console.error("Failed to start call", err);
          setCallState('failed');
        });
      }

      return () => {
        rtc.endCall(false);
        webrtcRef.current = null;
      };
    }
  }, [isOpen, user?.id, targetId, isVideoCall, isIncoming]);

  useEffect(() => {
    if (webrtcRef.current) {
      webrtcRef.current.toggleMute(isMuted);
    }
  }, [isMuted]);

  useEffect(() => {
    if (webrtcRef.current) {
      webrtcRef.current.toggleVideo(isVideoOff);
    }
  }, [isVideoOff]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (user?.id) {
      let msg = "";
      if (callState === 'ringing' || callState === 'idle') {
        msg = isVideoCall ? 'Đã lỡ cuộc gọi video' : 'Đã lỡ cuộc gọi thoại';
      } else if (callState === 'connected') {
        msg = `Cuộc gọi ${isVideoCall ? 'video' : 'thoại'} kết thúc (${formatDuration(callDuration)})`;
      }
      if (msg) messageService.sendMessage(user.id, targetId, msg, undefined, 'system_call');
    }

    if (webrtcRef.current) {
      webrtcRef.current.endCall();
    } else {
      setCallState('ended');
      setTimeout(() => onClose(), 1500);
    }
  };

  const handleAccept = () => {
    setHasAccepted(true);
    if (webrtcRef.current && incomingOffer) {
      webrtcRef.current.answerCall(incomingOffer, isVideoCall).then(stream => {
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      }).catch(err => {
        console.error("Failed to answer call", err);
        setCallState('failed');
      });
    }
  };

  const handleReject = () => {
    if (webrtcRef.current) {
      webrtcRef.current.rejectCall();
    }
    setCallState('ended');
    setTimeout(() => onClose(), 1000);
  };

  const getStatusText = () => {
    switch (callState) {
      case 'idle':
      case 'ringing': return 'Đang đổ chuông...';
      case 'connecting': return 'Đang kết nối...';
      case 'connected': return formatDuration(callDuration);
      case 'failed': return 'Kết nối thất bại hoặc bị từ chối';
      case 'ended': return 'Cuộc gọi kết thúc';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className={`relative w-full ${isFullscreen ? 'h-full' : 'max-w-4xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl'} bg-gray-900 flex flex-col transition-all duration-300`}>
        
        {/* Top actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${callState === 'connected' ? 'bg-green-500 animate-pulse' : callState === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`} />
            <span className="text-white text-sm font-medium">
              {getStatusText()}
            </span>
          </div>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-3 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-colors"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>

        {/* Main Video/Avatar Area */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className={isVideoCall && callState === 'connected' && !isVideoOff ? "w-full h-full object-cover absolute inset-0 z-0 bg-black" : "hidden"} 
          />

          {isVideoCall && (callState === 'connected' || callState === 'connecting') && !isVideoOff ? (
            <>
              {/* Local video */}
              <div className="absolute bottom-6 right-6 w-32 h-48 bg-gray-800 rounded-xl border-2 border-white/20 overflow-hidden shadow-xl z-20">
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform scale-x-[-1]" 
                />
              </div>
              
              {callState === 'connecting' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <div className="text-center">
                    <ImageWithFallback src={callerAvatar} alt={callerName} className="w-24 h-24 rounded-full mx-auto mb-4 animate-pulse border-4 border-white/20" />
                    <p className="text-white text-xl">Đang kết nối...</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center z-10">
              <div className="relative mb-6">
                <ImageWithFallback 
                  src={callerAvatar} 
                  alt={callerName} 
                  className="w-40 h-40 rounded-full object-cover border-4 border-white/10 shadow-2xl"
                />
                {(callState === 'idle' || callState === 'ringing') && (
                  <div className="absolute inset-0 rounded-full border-4 border-[#ff3131] animate-ping opacity-75" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{callerName}</h2>
              <p className="text-gray-400 text-lg">
                {isVideoCall ? 'Cuộc gọi Video' : 'Cuộc gọi Thoại'} WanderLab
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="h-32 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-6 pb-6 z-20 relative">
          {!hasAccepted && isIncoming ? (
            <>
              <button 
                onClick={handleAccept}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition-all shadow-lg shadow-green-500/30 transform hover:scale-105 flex items-center gap-2"
              >
                <Phone size={24} /> Trả lời
              </button>
              <button 
                onClick={handleReject}
                className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold transition-all shadow-lg shadow-red-500/30 transform hover:scale-105 flex items-center gap-2"
              >
                <PhoneOff size={24} /> Từ chối
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-all ${isMuted ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
              </button>
              
              {isVideoCall && (
                <button 
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {isVideoOff ? <VideoOff size={28} /> : <Video size={28} />}
                </button>
              )}

              <button 
                onClick={handleEndCall}
                className="p-5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg shadow-red-500/30 transform hover:scale-105"
              >
                <PhoneOff size={32} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
