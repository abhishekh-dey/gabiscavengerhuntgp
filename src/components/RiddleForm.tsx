import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, User, Building, AlertTriangle, RotateCcw } from 'lucide-react';
import { RiddleData, RIDDLE_TIME_LIMIT } from '../config/gameConfig';
import RiddleTimer from './RiddleTimer';

interface RiddleFormProps {
  riddle: RiddleData;
  onAnswerSubmit: (answerIndex: number) => void;
  onWinnerSubmit: (name: string, department: string) => void;
  isCorrect: boolean | null;
  isLoading: boolean;
  showWinnerForm: boolean;
  hasWrongAttempt: boolean;
  onTimeUp: () => void;
  onRetry: () => void;
}

const RiddleForm: React.FC<RiddleFormProps> = ({
  riddle,
  onAnswerSubmit,
  onWinnerSubmit,
  isCorrect,
  isLoading,
  showWinnerForm,
  hasWrongAttempt,
  onTimeUp,
  onRetry,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [showTimeUpMessage, setShowTimeUpMessage] = useState(false);

  useEffect(() => {
    // Reset timer when riddle changes or component mounts
    setIsTimerActive(true);
    setShowTimeUpMessage(false);
    setSelectedAnswer(null);
  }, [riddle]);

  const handleTimeUp = () => {
    setIsTimerActive(false);
    setShowTimeUpMessage(true);
    onTimeUp();
  };

  const handleRetry = () => {
    setShowTimeUpMessage(false);
    setIsTimerActive(true);
    setSelectedAnswer(null);
    onRetry();
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer !== null && isTimerActive) {
      setIsTimerActive(false);
      onAnswerSubmit(selectedAnswer);
    }
  };

  const handleWinnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && department.trim()) {
      onWinnerSubmit(name.trim(), department.trim());
    }
  };

  if (showWinnerForm) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Congratulations! 🎉
          </h2>

          <p className="text-white/80 text-center mb-6">
            You solved the riddle correctly! Please enter your details to claim your victory.
          </p>

          <form onSubmit={handleWinnerSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Enter your department"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || !name.trim() || !department.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                'Submit & Claim Victory!'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    );
  }

  // Show blocked message if user already had a wrong attempt
  if (hasWrongAttempt && isCorrect === null && !showTimeUpMessage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Access Denied
          </h2>

          <div className="bg-red-500/20 rounded-xl p-6 mb-8 border border-red-500/30">
            <p className="text-white text-lg leading-relaxed text-center">
              This key has already been used for an incorrect attempt. Each key allows only one wrong answer before being blocked.
            </p>
          </div>

          <p className="text-white/80 text-center mb-6">
            Please try with a different unique key to continue the challenge.
          </p>

          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Try Another Key
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Show time up message - COMPLETELY REPLACE THE RIDDLE
  if (showTimeUpMessage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
          {/* Animated Background Effects */}
          <div className="relative overflow-hidden rounded-2xl mb-8">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 0.1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500"
            />
            
            {/* Main Icon */}
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
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl text-white/90 mb-4 relative z-10 font-semibold"
            >
              Better luck next time!
            </motion.p>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/70 text-lg mb-8 relative z-10"
            >
              Don't worry - your unique key is still valid and you can try again.
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
          </div>

          {/* Retry Button */}
          <motion.button
            initial={{ y: 50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ 
              delay: 1.0, 
              type: "spring", 
              stiffness: 200,
              damping: 10
            }}
            onClick={handleRetry}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg flex items-center space-x-3 mx-auto"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RotateCcw className="w-5 h-5" />
            </motion.div>
            <span>Try Again</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Show the riddle form (only when timer is active and no time up)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Solve the Riddle
        </h2>

        <RiddleTimer
          timeLimit={RIDDLE_TIME_LIMIT}
          onTimeUp={handleTimeUp}
          isActive={isTimerActive}
        />

        <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
          <p className="text-white text-lg leading-relaxed text-center">
            {riddle.riddle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {riddle.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => isTimerActive && setSelectedAnswer(index)}
              whileHover={isTimerActive ? { scale: 1.02 } : {}}
              whileTap={isTimerActive ? { scale: 0.98 } : {}}
              disabled={!isTimerActive}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                selectedAnswer === index
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : isTimerActive
                  ? 'border-white/30 bg-white/10 text-white/80 hover:border-white/50 hover:bg-white/20'
                  : 'border-white/20 bg-white/5 text-white/50 cursor-not-allowed'
              }`}
            >
              <span className="font-semibold mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </motion.button>
          ))}
        </div>

        {isCorrect === false && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-red-300 text-center mb-6 bg-red-500/20 p-4 rounded-lg border border-red-500/30"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Incorrect Answer</span>
            </div>
            <p className="text-sm">
              This key is now blocked. You can try with a different unique key.
            </p>
          </motion.div>
        )}

        <motion.button
          onClick={handleAnswerSubmit}
          disabled={selectedAnswer === null || isLoading || !isTimerActive}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          ) : (
            'Submit Answer'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RiddleForm;