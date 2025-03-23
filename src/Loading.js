import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Static Thick "+" */}
        <div className="relative font-extrabold text-[150px] text-gray-300 leading-none select-none">
          +

          {/* Animated Blue Fill (Bottom to Top) */}
          <motion.div
            className="absolute inset-0 font-extrabold text-[150px] leading-none text-blue-500 overflow-hidden"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }} // Start fully hidden
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }} // Fully visible (filled)
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
          >
            +
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
