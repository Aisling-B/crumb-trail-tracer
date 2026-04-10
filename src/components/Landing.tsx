import { motion } from "framer-motion";

interface LandingProps {
  onStart: () => void;
}

const Landing = ({ onStart }: LandingProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 cyber-grid relative overflow-hidden">
      {/* Scan line effect */}
      <div className="scan-line absolute inset-0 pointer-events-none h-32 w-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-lg mx-auto relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-5xl sm:text-6xl mb-6"
        >
          🍪
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4 leading-tight">
          <span className="neon-text-blue">The Data</span>{" "}
          <span className="neon-text-orange">Cookie</span>{" "}
          <span className="neon-text-purple">Crumbs</span>
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base mb-8 font-mono leading-relaxed">
          Every tap, like, and scroll leaves a trail. <br />
          See what platforms <em>really</em> know about you.
        </p>

        {/* Stat card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="border border-border rounded-lg p-4 sm:p-6 mb-8 bg-card/50 backdrop-blur neon-border"
        >
          <p className="data-readout uppercase tracking-widest mb-2 text-xs">
            // ALERT: RESEARCH DATA
          </p>
          <p className="text-foreground text-lg sm:text-xl font-display font-semibold mb-1">
            Problematic social media use grew from{" "}
            <span className="neon-text-orange">7%</span> to{" "}
            <span className="neon-text-red" style={{ color: "hsl(var(--neon-red))" }}>11%</span>
          </p>
          <p className="text-muted-foreground text-sm font-mono">
            between 2018 and 2022, especially among girls.
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-mono opacity-60">
            Source: HBSC Study
          </p>
        </motion.div>

        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 rounded-lg font-display font-semibold text-base sm:text-lg bg-primary text-primary-foreground shadow-lg relative overflow-hidden group"
          style={{ boxShadow: "var(--glow-blue)" }}
        >
          <span className="relative z-10">▶ Start Your Digital Day</span>
          <motion.div
            className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-20"
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Landing;
