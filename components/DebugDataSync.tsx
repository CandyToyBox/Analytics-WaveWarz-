
import React, { useState, useEffect } from 'react';
import { Database, UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getBattleLibrary } from '../data';
import { uploadBattlesToSupabase, fetchBattlesFromSupabase } from '../services/supabaseClient';

export const DebugDataSync: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'uploading' | 'success' | 'error' | 'synced'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    // Check if we already have data
    const existingData = await fetchBattlesFromSupabase();
    if (existingData && existingData.length > 0) {
        setStatus('synced');
    } else {
        setStatus('idle');
    }
  };

  const handleSync = async () => {
    setStatus('uploading');
    setMessage('');
    
    try {
      const localData = getBattleLibrary();
      console.log("Starting sync with", localData.length, "records...");

      const result = await uploadBattlesToSupabase(localData);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        // Reload page after 2s to fetch from DB
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setStatus('error');
        setMessage(result.message || "Unknown upload error");
        console.error("Sync Error:", result);
      }
    } catch (e: any) {
      setStatus('error');
      setMessage(e.message || "Critical failure during sync");
      console.error("Critical Sync Error:", e);
    }
  };

  // If fully synced, show a minimal badge or nothing
  if (status === 'synced') {
      return null; // Hide completely if working perfectly
      // Or return a small badge:
      /*
      return (
        <div className="fixed bottom-4 right-4 z-50 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
            <CheckCircle size={12} /> Database Connected
        </div>
      );
      */
  }

  return (
    <div className="fixed bottom-8 right-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 w-80">
        <div className="flex items-center gap-2 mb-3 text-slate-300 font-bold text-sm">
          <Database size={16} />
          <span>Database Sync Tool</span>
        </div>
        
        {status === 'checking' && (
             <div className="flex items-center gap-2 text-slate-500 text-xs">
                 <Loader2 size={12} className="animate-spin" /> Checking connection...
             </div>
        )}

        {status === 'idle' && (
          <>
            <p className="text-xs text-slate-500 mb-4">
            Upload local battle data to your new Supabase table. Only run this once.
            </p>
            <button 
                onClick={handleSync}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-bold transition-colors"
            >
                <UploadCloud size={14} /> Sync Local Data to DB
            </button>
          </>
        )}

        {status === 'uploading' && (
          <button disabled className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-400 py-2 rounded-lg text-xs font-bold cursor-not-allowed">
            <Loader2 size={14} className="animate-spin" /> Uploading...
          </button>
        )}

        {status === 'success' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 animate-in fade-in slide-in-from-bottom-2">
             <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-1">
               <CheckCircle size={14} /> Success
             </div>
             <div className="text-[10px] text-green-300">{message}</div>
             <div className="text-[10px] text-slate-500 mt-1">Refresing page...</div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-in fade-in slide-in-from-bottom-2">
             <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-1">
               <AlertCircle size={14} /> Error
             </div>
             <div className="text-[10px] text-red-300 break-words font-mono max-h-24 overflow-y-auto">
               {message}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
