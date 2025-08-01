"use client"

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
    message?: string;
}

export function LoadingScreen({ message = 'Đang tải...' }: LoadingScreenProps) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
            >
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                        scale: { duration: 1, repeat: Infinity },
                    }}
                >
                    <Loader2 className="h-12 w-12 text-primary mx-auto" />
                </motion.div>
                <p className="text-muted-foreground">{message}</p>
            </motion.div>
        </div>
    );
}