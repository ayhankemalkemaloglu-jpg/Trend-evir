"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

/** Subtle on-scroll reveal: fade + small rise, under 400ms, ease-out, no bounce. */
export function Reveal({ children, delay = 0, ...props }: RevealProps) {
  const reduce = useReducedMotion();

  const animation: HTMLMotionProps<"div"> = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "0px 0px -10% 0px" },
        transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1], delay },
      };

  return (
    <motion.div {...animation} {...props}>
      {children}
    </motion.div>
  );
}
