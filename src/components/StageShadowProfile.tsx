import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StageShadowProfileProps {
  activities: string[];
  onComplete: () => void;
}

interface ProfileTag {
  label: string;
  color: string;
  risk: string;
  value: number; // cents per year
}

function generateTags(activities: string[]): ProfileTag[] {
  const tags: ProfileTag[] = [];
  if (activities.includes("anxiety")) {
    tags.push({ label: "VULNERABLE / HIGH ENGAGEMENT", color: "neon-red", risk: "Mental health keywords detected. You'll be served 'relatable' content designed to keep you scrolling.", value: 2840 });
  }
  if (activities.includes("fitspiration")) {
    tags.push({ label: "BODY IMAGE / SUPPLEMENTS", color: "neon-orange", risk: "Fitness engagement flagged. Expect ads for diet pills, 'transformation' programs, and unrealistic body standards.", value: 3120 });
  }
  if (activities.includes("ai-chat")) {
    tags.push({ label: "AI DATA HARVESTER", color: "neon-purple", risk: "Your AI chats are mined for preferences, emotional state, and personal data to refine targeting.", value: 1890 });
  }
  if (activities.includes("gaming")) {
    tags.push({ label: "IN-GAME SPENDING TARGET", color: "neon-green", risk: "Extended play sessions flagged. You'll see loot boxes, time-limited offers, and social pressure to spend.", value: 4200 });
  }
  if (activities.includes("shorts")) {
    tags.push({ label: "INFINITE SCROLL SUSCEPTIBLE", color: "neon-blue", risk: "Short-form video engagement tracked. Algorithm will optimize for maximum watch time.", value: 2100 });
  }
  return tags;
}

const BASE_VALUE = 1250; // base profile value in cents

const StageShadowProfile = ({ activities, onComplete }: StageShadowProfileProps) => {
  const [phase, setPhase] = useState<"scanning" | "reveal">("scanning");
  const tags = generateTags(activities);
  const totalValueCents = BASE_VALUE + tags.reduce((sum, t) => sum + t.value, 0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setPhase("reveal"), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Animated counter
  useEffect(() => {
    if (phase !== "reveal") return;
    const target = totalValueCents;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayValue(target);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [phase, totalValueCents]);

  const formatDollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 pb-24 cyber-grid">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-sm mx-auto"
      >
        <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-2">
          <span className="neon-text-purple">Stage 2:</span> Shadow Profile
        </h2>
        <p className="data-readout text-center mb-8">
          // SCANNING YOUR DATA CRUMBS...
        </p>

        <AnimatePresence mode="wait">
          {phase === "scanning" ? (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative w-32 h-32">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-primary rounded-full border-t-transparent"
                  style={{ boxShadow: "var(--glow-blue)" }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-3 border-2 border-accent rounded-full border-b-transparent"
                  style={{ boxShadow: "var(--glow-purple)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  👤
                </div>
              </div>

              <div className="font-mono text-xs text-muted-foreground text-center space-y-1">
                <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  Aggregating browsing patterns...
                </motion.p>
                <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>
                  Cross-referencing ad profiles...
                </motion.p>
                <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}>
                  Estimating commercial value...
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Data Value Counter */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-secondary rounded-xl p-4 bg-secondary/5 text-center"
                style={{ boxShadow: "var(--glow-orange)" }}
              >
                <p className="data-readout text-[10px] mb-1">// ESTIMATED PROFILE VALUE TO DATA BROKERS</p>
                <p className="font-display font-bold text-3xl neon-text-orange">
                  {formatDollars(displayValue)}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground mt-1">per year</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {tags.map((tag) => (
                    <div key={tag.label} className="text-[9px] font-mono text-muted-foreground flex justify-between border border-border/50 rounded px-2 py-1">
                      <span className="truncate mr-1">{tag.label.split("/")[0].trim()}</span>
                      <span className="neon-text-orange whitespace-nowrap">+{formatDollars(tag.value)}</span>
                    </div>
                  ))}
                  <div className="text-[9px] font-mono text-muted-foreground flex justify-between border border-border/50 rounded px-2 py-1">
                    <span>Base profile</span>
                    <span className="text-muted-foreground">{formatDollars(BASE_VALUE)}</span>
                  </div>
                </div>
              </motion.div>

              {/* Identity Card */}
              <div className="border-2 border-border rounded-xl overflow-hidden bg-card/80 backdrop-blur" style={{ boxShadow: "var(--glow-purple)" }}>
                <div className="bg-accent/20 px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl border border-border">
                      👤
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">COMMERCIAL IDENTITY CARD</p>
                      <p className="data-readout text-[10px]">ID: #USR-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="data-readout uppercase tracking-widest text-[10px] text-muted-foreground">
                    // ASSIGNED TAGS
                  </p>
                  {tags.map((tag, i) => (
                    <motion.div
                      key={tag.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.3 }}
                      className="border border-border rounded-lg p-3 bg-muted/20"
                    >
                      <div className={`font-mono text-xs font-bold mb-1 ${
                        tag.color === "neon-red" ? "neon-text-orange" :
                        tag.color === "neon-orange" ? "neon-text-orange" :
                        tag.color === "neon-purple" ? "neon-text-purple" :
                        tag.color === "neon-green" ? "neon-text-blue" :
                        "neon-text-blue"
                      }`}>
                        ⚠ {tag.label}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                        {tag.risk}
                      </p>
                    </motion.div>
                  ))}

                  {tags.length === 0 && (
                    <p className="text-sm text-muted-foreground font-mono text-center py-4">
                      No activities selected — but platforms still track you.
                    </p>
                  )}
                </div>
              </div>

              <div className="border border-border rounded-lg p-3 bg-card/50">
                <p className="data-readout text-[10px] mb-1">// THE DOUBLE LOGIC</p>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                  Platforms are <span className="neon-text-orange">business frameworks</span> designed to ready your data for commercial databases. Your "free" experience is the product — worth <span className="neon-text-orange">{formatDollars(totalValueCents)}/year</span> to brokers.
                </p>
              </div>

              <motion.button
                onClick={onComplete}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-lg font-display font-semibold bg-secondary text-secondary-foreground"
                style={{ boxShadow: "var(--glow-orange)" }}
              >
                See Your Targeted Feed →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StageShadowProfile;
