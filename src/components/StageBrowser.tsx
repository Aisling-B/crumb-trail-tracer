import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StageBrowserProps {
  onComplete: (activities: string[]) => void;
}

interface DataCrumb {
  id: string;
  activityId: string;
  label: string;
  icon: string;
  detail: string;
  risk: "low" | "medium" | "high";
}

const CRUMB_POOL: DataCrumb[] = [
  { id: "1", activityId: "anxiety", label: "Search: 'anxiety symptoms'", icon: "🔍", detail: "Query logged & sold to ad networks", risk: "high" },
  { id: "2", activityId: "anxiety", label: "Browsing: mental health forums", icon: "🧠", detail: "Interest profile: vulnerable user", risk: "high" },
  { id: "3", activityId: "fitspiration", label: "Like: fitspiration reel", icon: "💪", detail: "Body image tag added to profile", risk: "high" },
  { id: "4", activityId: "fitspiration", label: "Save: diet plan post", icon: "📌", detail: "Supplement ads now queued", risk: "medium" },
  { id: "5", activityId: "ai-chat", label: "AI Chat: personal secrets", icon: "🤖", detail: "Conversation mined for ad data", risk: "high" },
  { id: "6", activityId: "ai-chat", label: "AI Chat: homework help", icon: "📝", detail: "Age & education level inferred", risk: "low" },
  { id: "7", activityId: "gaming", label: "Session: 4h gaming streak", icon: "🎮", detail: "Flagged for loot box targeting", risk: "high" },
  { id: "8", activityId: "gaming", label: "Purchase: in-game currency", icon: "💳", detail: "Spending habits shared with brokers", risk: "high" },
  { id: "9", activityId: "shorts", label: "Watch: 47 Shorts in a row", icon: "📱", detail: "Scroll addiction score: EXTREME", risk: "high" },
  { id: "10", activityId: "shorts", label: "Share: viral challenge clip", icon: "🔥", detail: "Social graph mapped", risk: "medium" },
  { id: "11", activityId: "anxiety", label: "Click: 'Are you depressed?' quiz", icon: "📋", detail: "Health data harvested", risk: "high" },
  { id: "12", activityId: "fitspiration", label: "Follow: fitness influencer", icon: "⭐", detail: "Body image content amplified", risk: "medium" },
  { id: "13", activityId: "gaming", label: "Watch: loot box unboxing", icon: "📦", detail: "Gambling propensity flagged", risk: "high" },
  { id: "14", activityId: "shorts", label: "Autoplay: 2am doomscroll", icon: "🌙", detail: "Sleep pattern tracked", risk: "medium" },
  { id: "15", activityId: "ai-chat", label: "AI Chat: relationship advice", icon: "💬", detail: "Emotional state profiled", risk: "high" },
];

const SPEED_INTERVAL_MS = 2200;

const StageBrowser = ({ onComplete }: StageBrowserProps) => {
  const [queue, setQueue] = useState<DataCrumb[]>([]);
  const [currentCrumb, setCurrentCrumb] = useState<DataCrumb | null>(null);
  const [allowed, setAllowed] = useState<string[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [missed, setMissed] = useState(0);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [flash, setFlash] = useState<"allow" | "block" | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalRounds = 10;

  // Shuffle and pick crumbs
  useEffect(() => {
    const shuffled = [...CRUMB_POOL].sort(() => Math.random() - 0.5).slice(0, totalRounds);
    setQueue(shuffled);
    setCurrentCrumb(shuffled[0]);
  }, []);

  // Auto-advance timer (time pressure)
  useEffect(() => {
    if (gameOver || !currentCrumb) return;
    timerRef.current = setTimeout(() => {
      // Missed — counts as allowed
      setAllowed((prev) => [...prev, currentCrumb.activityId]);
      setMissed((m) => m + 1);
      advanceRound();
    }, SPEED_INTERVAL_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentCrumb, gameOver]);

  const advanceRound = useCallback(() => {
    const next = round + 1;
    if (next >= totalRounds) {
      setGameOver(true);
      setCurrentCrumb(null);
    } else {
      setRound(next);
      setCurrentCrumb(queue[next] || null);
    }
  }, [round, queue]);

  const handleDecision = useCallback((decision: "allow" | "block") => {
    if (!currentCrumb || gameOver) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    setFlash(decision);
    setTimeout(() => setFlash(null), 300);

    if (decision === "allow") {
      setAllowed((prev) => [...prev, currentCrumb.activityId]);
    } else {
      setBlocked((prev) => [...prev, currentCrumb.activityId]);
    }
    advanceRound();
  }, [currentCrumb, gameOver, advanceRound]);

  const handleContinue = () => {
    // Deduplicate allowed activities
    const unique = [...new Set(allowed)];
    onComplete(unique.length > 0 ? unique : ["shorts"]); // fallback so there's always something
  };

  const progress = ((round) / totalRounds) * 100;
  const riskColor = (r: string) =>
    r === "high" ? "neon-text-orange" : r === "medium" ? "neon-text-blue" : "text-muted-foreground";

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 pb-24 cyber-grid">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto"
      >
        <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-2">
          <span className="neon-text-blue">Stage 1:</span> Data Crumb Rush
        </h2>
        <p className="data-readout text-center mb-1">
          // ALLOW OR BLOCK BEFORE TIME RUNS OUT
        </p>
        <p className="text-xs text-muted-foreground text-center mb-4 font-mono">
          Missed crumbs are automatically <span className="neon-text-orange">allowed</span>
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              style={{ boxShadow: "var(--glow-blue)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground">{round}/{totalRounds}</span>
        </div>

        {/* Phone mockup */}
        <div
          className={`border-2 rounded-3xl p-4 bg-card/50 backdrop-blur relative overflow-hidden transition-colors ${
            flash === "allow" ? "border-secondary" : flash === "block" ? "border-primary" : "border-border"
          }`}
          style={{ boxShadow: flash === "allow" ? "var(--glow-orange)" : flash === "block" ? "var(--glow-blue)" : "var(--glow-blue)" }}
        >
          <div className="w-20 h-1 bg-border rounded-full mx-auto mb-4" />

          {/* Timer bar */}
          {currentCrumb && !gameOver && (
            <motion.div
              key={round}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: SPEED_INTERVAL_MS / 1000, ease: "linear" }}
              className="h-1 bg-secondary rounded-full mb-4"
              style={{ boxShadow: "var(--glow-orange)" }}
            />
          )}

          <AnimatePresence mode="wait">
            {currentCrumb && !gameOver ? (
              <motion.div
                key={currentCrumb.id}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {/* Crumb card */}
                <div className="border border-border rounded-xl p-4 bg-muted/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{currentCrumb.icon}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      currentCrumb.risk === "high" ? "border-secondary/50 bg-secondary/10" :
                      currentCrumb.risk === "medium" ? "border-primary/50 bg-primary/10" :
                      "border-border bg-muted/30"
                    }`}>
                      <span className={riskColor(currentCrumb.risk)}>
                        {currentCrumb.risk.toUpperCase()} RISK
                      </span>
                    </span>
                  </div>
                  <p className="font-mono text-sm text-foreground font-semibold">{currentCrumb.label}</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">{currentCrumb.detail}</p>
                </div>

                {/* Decision buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => handleDecision("block")}
                    whileTap={{ scale: 0.93 }}
                    className="py-3 rounded-lg font-display font-semibold text-sm bg-primary text-primary-foreground"
                    style={{ boxShadow: "var(--glow-blue)" }}
                  >
                    🛡️ Block
                  </motion.button>
                  <motion.button
                    onClick={() => handleDecision("allow")}
                    whileTap={{ scale: 0.93 }}
                    className="py-3 rounded-lg font-display font-semibold text-sm bg-secondary text-secondary-foreground"
                    style={{ boxShadow: "var(--glow-orange)" }}
                  >
                    🍪 Allow
                  </motion.button>
                </div>
              </motion.div>
            ) : gameOver ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 py-2"
              >
                <div className="text-center">
                  <p className="text-3xl mb-2">📊</p>
                  <h3 className="font-display font-bold text-lg text-foreground">Data Rush Results</h3>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="border border-primary/30 rounded-lg p-2 bg-primary/5">
                    <p className="text-lg font-mono font-bold neon-text-blue">{blocked.length}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">Blocked</p>
                  </div>
                  <div className="border border-secondary/30 rounded-lg p-2 bg-secondary/5">
                    <p className="text-lg font-mono font-bold neon-text-orange">{allowed.length - missed}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">Allowed</p>
                  </div>
                  <div className="border border-border rounded-lg p-2 bg-muted/10">
                    <p className="text-lg font-mono font-bold text-muted-foreground">{missed}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">Missed</p>
                  </div>
                </div>
                <div className="border border-border rounded-lg p-3 bg-muted/10">
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                    {missed > 3
                      ? "⚠ Most of your data slipped through. In real life, platforms don't even ask — they just take."
                      : blocked.length > 6
                      ? "🛡️ Strong blocking! But remember: platforms often make 'Block' buttons hard to find on purpose."
                      : "🍪 You allowed a lot of crumbs. Each one builds a more detailed commercial profile of you."}
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="w-24 h-1 bg-border rounded-full mx-auto mt-4" />
        </div>

        {/* Data containers */}
        {!gameOver && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: "Ad Networks", icon: "📡" },
              { label: "Data Brokers", icon: "🏪" },
              { label: "Platform DBs", icon: "🗄️" },
            ].map((c) => (
              <div key={c.label} className="border border-border rounded-lg p-2 text-center bg-card/50">
                <div className="text-xl mb-0.5">{c.icon}</div>
                <p className="text-[9px] font-mono text-muted-foreground leading-tight">{c.label}</p>
                <p className="text-base font-mono neon-text-orange">{allowed.length}</p>
              </div>
            ))}
          </div>
        )}

        {/* Continue button */}
        {gameOver && (
          <motion.button
            onClick={handleContinue}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 w-full py-3 rounded-lg font-display font-semibold bg-primary text-primary-foreground"
            style={{ boxShadow: "var(--glow-blue)" }}
          >
            Scan My Data Trail →
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default StageBrowser;
