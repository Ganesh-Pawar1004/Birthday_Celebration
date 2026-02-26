import { useState, useEffect } from 'react';
import { Database, DatabaseZap } from 'lucide-react';
import { db } from '../lib/db';
import { motion } from 'framer-motion';

export function ConnectionStatus() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        setIsConnected(db.isConnected());
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-gray-100"
            title={isConnected ? "Connected to Live Database" : "Using Local Storage (Database disconnected)"}
        >
            <div className={`relative flex items-center justify-center p-1 rounded-full ${isConnected ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                {isConnected ? <DatabaseZap size={16} /> : <Database size={16} />}
                <span className={`absolute top-0 right-0 w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </div>
            <span className="text-xs font-semibold text-gray-600 hidden sm:inline-block">
                {isConnected ? "Live DB" : "Local Storage"}
            </span>
        </motion.div>
    );
}
