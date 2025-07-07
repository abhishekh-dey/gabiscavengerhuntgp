import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, AlertTriangle } from 'lucide-react';

interface RiddleTimerProps {
  timeLimit: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
  onReset?: () => void;
}

const RiddleTimer: React.FC<RiddleTimerProps> = ({ timeLimit, onTimeUp, isActive, onReset }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    setTimeLeft(timeLimit);
    setIsTimeUp(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimeUp(true);
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

  if (isTimeUp) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Time's Up! ⏰
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/80 text-lg mb-8"
        >
          Don't worry! Your unique key is still valid. You can try again.
        </motion.p>

        {onReset && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={onReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Try Again
          </motion.button>
        )}
      </motion.div>
    );
  }

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
            <Timer className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-sm font-medium">Time Remaining</span>
          </div>
          <div className={`text-2xl font-bold text-white bg-gradient-to-r ${getTimerColor()} bg-clip-text text-transparent`}>
            {formatTime(timeLeft)}
          </div>
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