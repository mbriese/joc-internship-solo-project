import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
    children: React.ReactNode;
    isVisible: boolean;
};

const bubblePopVariant = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: [0.8, 1.05, 1],
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.42, 0, 0.58, 1.0], // easeInOut
        },
    },
};

const BubblePopTaskCard = ({ children, isVisible }: Props) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default BubblePopTaskCard;
