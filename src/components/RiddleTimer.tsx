import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, AlertTriangle, RotateCcw } from 'lucide-react';

interface RiddleTimerProps {
  timeLimit: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
  onReset?: () => void;
}

const RiddleTimer: React.FC<RiddleTimerProps> = ({ timeLimit, onTimeUp, isActive, onReset }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    setTimeLeft(timeLimit);
    setIsTimeUp(false);
    setShowAnimation(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimeUp(true);
          setShowAnimation(true);
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
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="text-center py-8 relative overflow-hidden"
        >
          {/* Animated Background Effects */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 3, opacity: 0.1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
          />
          
          {/* Pulsing Ring Effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 2], opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 border-4 border-red-500 rounded-full"
          />

          {/* Main Icon with Bounce Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 10,
              delay: 0.2 
            }}
            className="flex justify-center mb-6 relative z-10"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 0.6, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
              className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-full shadow-2xl"
            >
              <AlertTriangle className="w-16 h-16 text-white" />
            </motion.div>
          </motion.div>

          {/* Animated Title */}
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="text-5xl font-bold text-white mb-4 relative z-10"
          >
            <motion.span
              animate={{ 
                textShadow: [
                  "0 0 0px rgba(239, 68, 68, 0)",
                  "0 0 20px rgba(239, 68, 68, 0.8)",
                  "0 0 0px rgba(239, 68, 68, 0)"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"
            >
              Time's Up!
            </motion.span>
            {' '}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="inline-block"
            >
              ⏰
            </motion.span>
          </motion.h2>

          {/* Animated Subtitle */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/80 text-xl mb-8 relative z-10"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Don't worry! Your unique key is still valid.
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-lg text-white/60"
            >
              You can try again with the same key.
            </motion.span>
          </motion.p>

          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: 0,
                y: 0
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200]
              }}
              transition={{ 
                duration: 2,
                delay: 0.5 + i * 0.1,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="absolute w-3 h-3 bg-gradient-to-r from-red-400 to-orange-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
            />
          ))}

          {/* Retry Button with Enhanced Animation */}
          {onReset && (
            <motion.button
              initial={{ y: 50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                delay: 1.2, 
                type: "spring", 
                stiffness: 200,
                damping: 10
              }}
              onClick={onReset}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg relative z-10 flex items-center space-x-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RotateCcw className="w-5 h-5" />
              </motion.div>
              <span>Try Again</span>
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
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