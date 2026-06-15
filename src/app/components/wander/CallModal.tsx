import React, { useState, useEffect } from 'react';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, Maximize, Minimize } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callerName: string;
  callerAvatar: string;
  isVideoCall: boolean;
}

export function CallModal({ isOpen, onClose, callerName, callerAvatar, isVideoCall }: CallModalProps) {
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCallState('ringing');
      setCallDuration(0);
      setIsMuted(false);
      setIsVideoOff(false);

      // Simulate answering after 3 seconds
      const timer = setTimeout(() => {
        setCallState('connected');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className={`relative w-full ${isFullscreen ? 'h-full' : 'max-w-4xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl'} bg-gray-900 flex flex-col transition-all duration-300`}>
        
        {/* Top actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${callState === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            <span className="text-white text-sm font-medium">
              {callState === 'ringing' ? 'Đang đổ chuông...' : callState === 'connected' ? formatDuration(callDuration) : 'Cuộc gọi kết thúc'}
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
        <div className="flex-1 relative flex items-center justify-center">
          {isVideoCall && callState === 'connected' && !isVideoOff ? (
            <div className="w-full h-full relative">
              {/* Simulate remote video */}
              <img src="https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Remote" className="w-full h-full object-cover" />
              {/* Simulate local video */}
              <div className="absolute bottom-6 right-6 w-32 h-48 bg-gray-800 rounded-xl border-2 border-white/20 overflow-hidden shadow-xl">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" alt="Local" className="w-full h-full object-cover" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <ImageWithFallback 
                  src={callerAvatar} 
                  alt={callerName} 
                  className="w-40 h-40 rounded-full object-cover border-4 border-white/10 shadow-2xl"
                />
                {callState === 'ringing' && (
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
        <div className="h-32 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-6 pb-6">
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
        </div>
      </div>
    </div>
  );
}
