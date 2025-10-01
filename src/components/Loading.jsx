import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingOverlay = ({ show }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    let timer;
    if (!show) {
      // kasih delay dikit sebelum hilang, biar smooth
      timer = setTimeout(() => setIsVisible(false), 800); // > duration exit animasi
    } else {
      setIsVisible(true); // kalau loading muncul lagi, tampilkan lagi
    }

    return () => clearTimeout(timer);
  }, [show]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src="/Archer_Load.gif"
            alt="Loading"
            className="w-80 h-80"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
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
