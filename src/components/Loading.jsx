import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingOverlay = ({ show }) => {
  const [isVisible, setIsVisible] = useState(show);
  const [audio] = useState(() => new Audio("/Arrow_Audio.mp3")); // ganti path sesuai file lo

  useEffect(() => {
    let timer;
    if (!show) {
      timer = setTimeout(() => setIsVisible(false), 800);
      audio.pause();
      audio.currentTime = 0;
    } else {
      setIsVisible(true);
      audio.loop = true;

      // Trik paksa autoplay
      audio.muted = true;
      audio.play().then(() => {
        audio.muted = false;
      }).catch((err) => {
        console.warn("Masih ke-block autoplay:", err);
      });
    }
    return () => clearTimeout(timer);
  }, [show, audio]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src="/Archer_Load.gif"
            alt="Loading"
            className="w-80 h-80"
            animate={{
              opacity: [0.6, 1],
            }}
            transition={{
              duration: 1.2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
