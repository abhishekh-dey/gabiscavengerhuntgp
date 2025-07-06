import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Home } from 'lucide-react';
import AnimatedBackground from './components/AnimatedBackground';
import KeyEntry from './components/KeyEntry';
import RiddleForm from './components/RiddleForm';
import WinnersList from './components/WinnersList';
import ConfettiEffect from './components/ConfettiEffect';
import { UNIQUE_KEYS, RIDDLES, validateConfig } from './config/gameConfig';
import { supabase } from './lib/supabase';

type GameState = 'landing' | 'riddle' | 'winners';

function App() {
  const [gameState, setGameState] = useState<GameState>('landing');
  const [currentKey, setCurrentKey] = useState<string>('');
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showWinnerForm, setShowWinnerForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasWrongAttempt, setHasWrongAttempt] = useState(false);

  useEffect(() => {
    // Validate configuration on app start
    if (!validateConfig()) {
      setError('Configuration error. Please check the console for details.');
    }
  }, []);

  const handleKeySubmit = async (key: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if key is valid
      const keyIndex = UNIQUE_KEYS.indexOf(key);
      if (keyIndex === -1) {
        setError('Invalid unique key. Please check your key and try again.');
        setIsLoading(false);
        return;
      }

      // Check if key has already been used (someone completed the full process)
      const { data: usedKeys, error: checkError } = await supabase
        .from('used_keys')
        .select('unique_key')
        .eq('unique_key', key);

      if (checkError) throw checkError;

      if (usedKeys && usedKeys.length > 0) {
        setError('This key has already been used. Each key can only be used once after successful completion.');
        setIsLoading(false);
        return;
      }

      // Check if this key has already had a wrong attempt
      const { data: wrongAttempts, error: wrongAttemptsError } = await supabase
        .from('wrong_attempts')
        .select('unique_key')
        .eq('unique_key', key);

      if (wrongAttemptsError) throw wrongAttemptsError;

      const hasWrongAttemptForKey = wrongAttempts && wrongAttempts.length > 0;
      setHasWrongAttempt(hasWrongAttemptForKey);

      // Set current key and riddle
      setCurrentKey(key);
      setCurrentRiddleIndex(keyIndex);
      setGameState('riddle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (answerIndex: number) => {
    setIsLoading(true);
    
    // Simulate processing time for better UX
    setTimeout(async () => {
      const correct = answerIndex === RIDDLES[currentRiddleIndex].correctAnswer;
      setIsCorrect(correct);
      
      if (correct) {
        setShowWinnerForm(true);
        setShowConfetti(true);
      } else {
        // Record wrong attempt for this key
        try {
          const { error } = await supabase
            .from('wrong_attempts')
            .insert([{ unique_key: currentKey }]);
          
          if (error) {
            console.error('Failed to record wrong attempt:', error);
          }
        } catch (err) {
          console.error('Error recording wrong attempt:', err);
        }
        
        setHasWrongAttempt(true);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleWinnerSubmit = async (name: string, department: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // First, mark the key as used
      const { error: keyError } = await supabase
        .from('used_keys')
        .insert([{ unique_key: currentKey }]);

      if (keyError) throw keyError;

      // Then, save the winner data
      const { error: winnerError } = await supabase
        .from('winners')
        .insert([{
          name,
          department,
          unique_key: currentKey,
          riddle_index: currentRiddleIndex,
        }]);

      if (winnerError) throw winnerError;

      // Reset game state and show winners
      setGameState('winners');
      setShowWinnerForm(false);
      setIsCorrect(null);
      setHasWrongAttempt(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save winner data');
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setGameState('landing');
    setCurrentKey('');
    setCurrentRiddleIndex(0);
    setIsCorrect(null);
    setShowWinnerForm(false);
    setError(null);
    setShowConfetti(false);
    setHasWrongAttempt(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <AnimatedBackground />
      <ConfettiEffect trigger={showConfetti} />
      
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <motion.button
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </motion.button>
          
          <motion.button
            onClick={() => setGameState('winners')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <Trophy className="w-5 h-5" />
            <span>Winners</span>
          </motion.button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {gameState === 'landing' && (
          <div className="text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <img
                src="/GABI Scavenger Hunt (1) (1).png"
                alt="GABI Scavenger Hunt"
                className="mx-auto max-w-md w-full h-auto"
              />
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome to GABI Scavenger Hunt
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Test your knowledge and solve challenging riddles to claim your victory! 
                Each unique key unlocks a special challenge just for you.
              </p>
            </motion.div>

            {/* Key Entry Form */}
            <KeyEntry
              onKeySubmit={handleKeySubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>
        )}

        {gameState === 'riddle' && (
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-white mb-12"
            >
              Challenge #{currentRiddleIndex + 1}
            </motion.h1>
            
            <RiddleForm
              riddle={RIDDLES[currentRiddleIndex]}
              onAnswerSubmit={handleAnswerSubmit}
              onWinnerSubmit={handleWinnerSubmit}
              isCorrect={isCorrect}
              isLoading={isLoading}
              showWinnerForm={showWinnerForm}
              hasWrongAttempt={hasWrongAttempt}
            />
            
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-red-300 bg-red-500/20 p-4 rounded-lg border border-red-500/30 max-w-md mx-auto"
              >
                {error}
              </motion.div>
            )}
          </div>
        )}

        {gameState === 'winners' && (
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-white mb-12"
            >
              Hall of Fame
            </motion.h1>
            
            <WinnersList />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;