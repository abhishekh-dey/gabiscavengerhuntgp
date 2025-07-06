import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, User, Building, Calendar, RefreshCw, Trash2, AlertTriangle, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase, Winner } from '../lib/supabase';
import { PURGE_PASSWORD } from '../config/gameConfig';

const WinnersList: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeletePasswordPrompt, setShowDeletePasswordPrompt] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);

  const fetchWinners = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('winners')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setWinners(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch winners');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurgeClick = () => {
    setShowPasswordPrompt(true);
    setPassword('');
    setPasswordError('');
  };

  const handleDeleteClick = (winner: Winner) => {
    setSelectedWinner(winner);
    setShowDeletePasswordPrompt(true);
    setDeletePassword('');
    setDeletePasswordError('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.trim() === PURGE_PASSWORD) {
      setShowPasswordPrompt(false);
      setShowPurgeConfirm(true);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Access denied.');
      setPassword('');
    }
  };

  const handleDeletePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (deletePassword.trim() === PURGE_PASSWORD) {
      setShowDeletePasswordPrompt(false);
      setShowDeleteConfirm(true);
      setDeletePassword('');
      setDeletePasswordError('');
    } else {
      setDeletePasswordError('Incorrect password. Access denied.');
      setDeletePassword('');
    }
  };

  const handleDeleteSingle = async () => {
    if (!selectedWinner) return;

    setIsDeleting(true);
    setError(null);

    try {
      console.log('Deleting single winner:', selectedWinner.id);

      // Delete the specific winner
      const { error: winnerError } = await supabase
        .from('winners')
        .delete()
        .eq('id', selectedWinner.id);

      if (winnerError) throw winnerError;

      // Reset the used key for this winner so it can be used again
      const { error: keyError } = await supabase
        .from('used_keys')
        .delete()
        .eq('unique_key', selectedWinner.unique_key);

      if (keyError) {
        console.warn('Failed to reset used key:', keyError);
        // Don't throw here as the winner deletion was successful
      }

      // Clear any wrong attempts for this key
      const { error: wrongAttemptsError } = await supabase
        .from('wrong_attempts')
        .delete()
        .eq('unique_key', selectedWinner.unique_key);

      if (wrongAttemptsError) {
        console.warn('Failed to clear wrong attempts:', wrongAttemptsError);
        // Don't throw here as the winner deletion was successful
      }

      console.log('Single winner deletion completed successfully');
      
      // Refresh the winners list
      await fetchWinners();
      setShowDeleteConfirm(false);
      setSelectedWinner(null);
    } catch (err) {
      console.error('Single deletion failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete winner');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePurgeAll = async () => {
    setIsPurging(true);
    setError(null);

    try {
      console.log('Starting purge process...');

      // Delete all winners
      const { error: winnersError } = await supabase
        .from('winners')
        .delete()
        .gte('completed_at', '1900-01-01');

      if (winnersError) {
        console.log('Winners deletion failed, trying alternative method:', winnersError);
        
        const { data: allWinners } = await supabase
          .from('winners')
          .select('id');

        if (allWinners && allWinners.length > 0) {
          for (const winner of allWinners) {
            const { error: deleteError } = await supabase
              .from('winners')
              .delete()
              .eq('id', winner.id);
            
            if (deleteError) {
              console.error('Failed to delete winner:', winner.id, deleteError);
            }
          }
        }
      }

      // Delete all used keys
      const { error: keysError } = await supabase
        .from('used_keys')
        .delete()
        .gte('used_at', '1900-01-01');

      if (keysError) {
        console.log('Used keys deletion failed, trying alternative method:', keysError);
        
        const { data: allKeys } = await supabase
          .from('used_keys')
          .select('id');

        if (allKeys && allKeys.length > 0) {
          for (const key of allKeys) {
            const { error: deleteError } = await supabase
              .from('used_keys')
              .delete()
              .eq('id', key.id);
            
            if (deleteError) {
              console.error('Failed to delete key:', key.id, deleteError);
            }
          }
        }
      }

      // Delete all wrong attempts
      const { error: wrongAttemptsError } = await supabase
        .from('wrong_attempts')
        .delete()
        .gte('attempted_at', '1900-01-01');

      if (wrongAttemptsError) {
        console.log('Wrong attempts deletion failed, trying alternative method:', wrongAttemptsError);
        
        const { data: allAttempts } = await supabase
          .from('wrong_attempts')
          .select('id');

        if (allAttempts && allAttempts.length > 0) {
          for (const attempt of allAttempts) {
            const { error: deleteError } = await supabase
              .from('wrong_attempts')
              .delete()
              .eq('id', attempt.id);
            
            if (deleteError) {
              console.error('Failed to delete wrong attempt:', attempt.id, deleteError);
            }
          }
        }
      }

      console.log('Purge completed successfully');
      
      // Refresh the winners list
      await fetchWinners();
      setShowPurgeConfirm(false);
    } catch (err) {
      console.error('Purge failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to purge data');
    } finally {
      setIsPurging(false);
    }
  };

  const closeAllModals = () => {
    setShowPasswordPrompt(false);
    setShowPurgeConfirm(false);
    setShowDeletePasswordPrompt(false);
    setShowDeleteConfirm(false);
    setPassword('');
    setDeletePassword('');
    setPasswordError('');
    setDeletePasswordError('');
    setSelectedWinner(null);
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Winners Hall of Fame</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchWinners}
              className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            {winners.length > 0 && (
              <button
                onClick={handlePurgeClick}
                className="bg-red-600/80 text-white px-4 py-2 rounded-lg hover:bg-red-700/80 transition-colors flex items-center space-x-2"
                title="Delete all winners and reset keys"
              >
                <Trash2 className="w-4 h-4" />
                <span>Purge All</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-red-300 mb-6 bg-red-500/20 p-4 rounded-lg border border-red-500/30"
          >
            {error}
          </motion.div>
        )}

        {winners.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/70 text-lg">No winners yet. Be the first to solve a riddle!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {winners.map((winner, index) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                      <span className="text-white font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="w-4 h-4 text-white/70" />
                        <span className="text-white font-semibold text-lg">{winner.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-white/70" />
                        <span className="text-white/80">{winner.department}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-white/70" />
                        <span className="text-white/80 text-sm">
                          {new Date(winner.completed_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-white/60 text-sm">
                        {new Date(winner.completed_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handleDeleteClick(winner)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-red-600/80 text-white p-2 rounded-lg hover:bg-red-700/80 transition-colors"
                      title="Delete this winner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Purge Password Prompt Modal */}
      {showPasswordPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-500 p-3 rounded-full">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Admin Authentication</h3>
            </div>
            
            <p className="text-white/80 mb-6">
              Enter the admin password to access the purge all functionality.
            </p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-12 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {passwordError && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-300 text-sm bg-red-500/20 p-3 rounded-lg border border-red-500/30"
                >
                  {passwordError}
                </motion.div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!password.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authenticate</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Single Password Prompt Modal */}
      {showDeletePasswordPrompt && selectedWinner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-500 p-3 rounded-full">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Admin Authentication</h3>
            </div>
            
            <p className="text-white/80 mb-4">
              Enter the admin password to delete this winner:
            </p>
            
            <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-white/70" />
                <span className="text-white font-semibold">{selectedWinner.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-white/70" />
                <span className="text-white/80">{selectedWinner.department}</span>
              </div>
            </div>
            
            <form onSubmit={handleDeletePasswordSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showDeletePassword ? "text" : "password"}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-12 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showDeletePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {deletePasswordError && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-300 text-sm bg-red-500/20 p-3 rounded-lg border border-red-500/30"
                >
                  {deletePasswordError}
                </motion.div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!deletePassword.trim()}
                  className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authenticate</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Purge All Confirmation Modal */}
      {showPurgeConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-500 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Confirm Purge All</h3>
            </div>
            
            <p className="text-white/80 mb-6">
              This will permanently delete all winners, reset all unique keys for reuse, and clear all wrong attempts. 
              This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={closeAllModals}
                disabled={isPurging}
                className="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePurgeAll}
                disabled={isPurging}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isPurging ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Purge All</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Single Confirmation Modal */}
      {showDeleteConfirm && selectedWinner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-500 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Confirm Delete</h3>
            </div>
            
            <p className="text-white/80 mb-4">
              This will permanently delete this winner and reset their unique key for reuse. This action cannot be undone.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-white/70" />
                <span className="text-white font-semibold">{selectedWinner.name}</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Building className="w-4 h-4 text-white/70" />
                <span className="text-white/80">{selectedWinner.department}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-white/70" />
                <span className="text-white/80 text-sm">
                  {new Date(selectedWinner.completed_at).toLocaleDateString()} at {new Date(selectedWinner.completed_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={closeAllModals}
                disabled={isDeleting}
                className="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSingle}
                disabled={isDeleting}
                className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default WinnersList;