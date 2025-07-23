// SpiralLoader.jsx
import { motion } from "framer-motion";

const Loader = ({ size = 48, color = "#dc2626" }) => {
  const numDots = 12;
  const dots = Array.from({ length: numDots });

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {dots.map((_, i) => {
        const angle = (i / numDots) * 360;
        const delay = i * 0.1;

        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: size * 0.15,
              height: size * 0.15,
              backgroundColor: color,
              top: `${50 - 45 * Math.cos((angle * Math.PI) / 180)}%`,
              left: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.4, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

export default Loader;
