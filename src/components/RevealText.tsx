import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const line: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Line-mask reveal — pass one <span> per visual line.
 * Wrapper renders overflow-hidden per line and staggers them upward.
 */
export function RevealLines({
  children,
  as: As = "h1",
  className = "",
  once = true,
}: {
  children: ReactNode[];
  as?: any;
  className?: string;
  once?: boolean;
}) {
  return (
    <As className={className}>
      <motion.span
        initial="hidden"
        whileInView="show"
        viewport={{ once, margin: "-15%" }}
        variants={container}
        className="block"
      >
        {children.map((c, i) => (
          <span key={i} className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={line} className="block will-change-transform">
              {c}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </As>
  );
}

/** Simple fade-up on view. */
export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
