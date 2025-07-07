import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';

interface RiddleTimerProps {
  timeLimit: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
}

const RiddleTimer: React.FC<RiddleTimerProps> = ({ timeLimit, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (!isActive) return;

    setTimeLeft(timeLimit);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLimit, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((timeLimit - timeLeft) / timeLimit) * 100;
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'from-red-500 to-red-600';
    if (timeLeft <= 30) return 'from-orange-500 to-orange-600';
    return 'from-green-500 to-emerald-600';
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: timeLeft <= 10 ? [0, 10, -10, 0] : 0 }}
              transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
            >
              <Timer className="w-5 h-5 text-white/80" />
            </motion.div>
            <span className="text-white/80 text-sm font-medium">Time Remaining</span>
          </div>
          <motion.div 
            className={`text-2xl font-bold text-white bg-gradient-to-r ${getTimerColor()} bg-clip-text text-transparent`}
            animate={{ 
              scale: timeLeft <= 10 ? [1, 1.1, 1] : 1,
              textShadow: timeLeft <= 10 ? [
                "0 0 0px rgba(239, 68, 68, 0)",
                "0 0 10px rgba(239, 68, 68, 0.8)",
                "0 0 0px rgba(239, 68, 68, 0)"
              ] : "0 0 0px rgba(239, 68, 68, 0)"
            }}
            transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getTimerColor()} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default RiddleTimer;