import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StageBrowserProps {
  onComplete: (activities: string[]) => void;
}

const ACTIVITIES = [
  { id: "anxiety", label: 'Searching "anxiety symptoms"', icon: "🔍", color: "neon-blue" },
  { id: "fitspiration", label: 'Liking a "fitspiration" video', icon: "💪", color: "neon-orange" },
  { id: "ai-chat", label: "Chatting with My AI", icon: "🤖", color: "neon-purple" },
  { id: "gaming", label: "Gaming for 4+ hours", icon: "🎮", color: "neon-green" },
  { id: "shorts", label: 'Browsing "Shorts"', icon: "📱", color: "neon-red" },
];

const CONTAINERS = [
  { label: "Ad Networks", icon: "📡" },
  { label: "Data Brokers", icon: "🏪" },
  { label: "Platform DBs", icon: "🗄️" },
];

interface Crumb {
  id: string;
  targetIndex: number;
  activityId: string;
}

const StageBrowser = ({ onComplete }: StageBrowserProps) => {
  const [toggled, setToggled] = useState<Set<string>>(new Set());
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);

  const toggleActivity = useCallback((id: string) => {
    setToggled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Spawn crumbs to all 3 containers
        for (let i = 0; i < 3; i++) {
          const crumbId = `${id}-${i}-${Date.now()}`;
          setCrumbs((c) => [...c, { id: crumbId, targetIndex: i, activityId: id }]);
          setTimeout(() => {
            setCrumbs((c) => c.filter((cr) => cr.id !== crumbId));
          }, 1200);
        }
      }
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 pb-24 cyber-grid">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto"
      >
        <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-2">
          <span className="neon-text-blue">Stage 1:</span> Your Digital Day
        </h2>
        <p className="data-readout text-center mb-6">
          // TAP ACTIVITIES TO SIMULATE YOUR BROWSING
        </p>

        {/* Phone mockup */}
        <div className="border-2 border-border rounded-3xl p-4 bg-card/50 backdrop-blur relative" style={{ boxShadow: "var(--glow-blue)" }}>
          {/* Notch */}
          <div className="w-20 h-1 bg-border rounded-full mx-auto mb-4" />

          <div className="space-y-3">
            {ACTIVITIES.map((act) => {
              const isOn = toggled.has(act.id);
              return (
                <motion.button
                  key={act.id}
                  onClick={() => toggleActivity(act.id)}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all font-mono text-sm text-left ${
                    isOn
                      ? "border-primary bg-primary/10 neon-border"
                      : "border-border bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <span className="text-xl">{act.icon}</span>
                  <span className={isOn ? "text-foreground" : "text-muted-foreground"}>
                    {act.label}
                  </span>
                  <span className="ml-auto text-xs font-mono">
                    {isOn ? (
                      <span className="neon-text-orange">● ON</span>
                    ) : (
                      <span className="text-muted-foreground">○ OFF</span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Home bar */}
          <div className="w-24 h-1 bg-border rounded-full mx-auto mt-4" />
        </div>

        {/* Crumb particles */}
        <AnimatePresence>
          {crumbs.map((crumb) => {
            const xOffsets = [-80, 0, 80];
            return (
              <motion.div
                key={crumb.id}
                initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                animate={{
                  opacity: 0,
                  y: 80,
                  x: xOffsets[crumb.targetIndex],
                  scale: 0.3,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute left-1/2 -translate-x-1/2 text-lg pointer-events-none z-20"
                style={{ top: "60%" }}
              >
                🍪
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Data containers */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          {CONTAINERS.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="border border-border rounded-lg p-3 text-center bg-card/50"
            >
              <div className="text-2xl mb-1">{c.icon}</div>
              <p className="text-[10px] font-mono text-muted-foreground leading-tight">{c.label}</p>
              <p className="text-lg font-mono neon-text-orange mt-1">{toggled.size}</p>
            </motion.div>
          ))}
        </div>

        {/* Continue button */}
        <motion.button
          onClick={() => onComplete(Array.from(toggled))}
          disabled={toggled.size === 0}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 w-full py-3 rounded-lg font-display font-semibold bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ boxShadow: toggled.size > 0 ? "var(--glow-blue)" : "none" }}
        >
          Scan My Data Trail →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default StageBrowser;
