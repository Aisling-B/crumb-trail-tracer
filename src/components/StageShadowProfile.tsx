import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StageShadowProfileProps {
  activities: string[];
  onComplete: () => void;
}

interface EvidenceCard {
  id: string;
  activityId: string;
  label: string;
  icon: string;
}

interface Bucket {
  id: string;
  label: string;
  icon: string;
  color: string; // tailwind neon class
  glowVar: string;
}

interface PlatformTag {
  label: string;
  risk: string;
  colorClass: string;
  value: number;
}

const BUCKETS: Bucket[] = [
  { id: "vulnerability", label: "Commercial Vulnerability", icon: "🎯", color: "neon-text-orange", glowVar: "var(--glow-orange)" },
  { id: "income", label: "Estimated Income", icon: "💰", color: "neon-text-blue", glowVar: "var(--glow-blue)" },
  { id: "mental", label: "Mental Health Flag", icon: "🧠", color: "neon-text-purple", glowVar: "var(--glow-purple)" },
];

function buildCards(activities: string[]): EvidenceCard[] {
  const cards: EvidenceCard[] = [];
  if (activities.includes("anxiety")) {
    cards.push({ id: "anxiety-1", activityId: "anxiety", label: "Searched 'anxiety symptoms'", icon: "🔍" });
    cards.push({ id: "anxiety-2", activityId: "anxiety", label: "Clicked depression quiz", icon: "📋" });
  }
  if (activities.includes("fitspiration")) {
    cards.push({ id: "fit-1", activityId: "fitspiration", label: "Liked fitspiration reel", icon: "💪" });
    cards.push({ id: "fit-2", activityId: "fitspiration", label: "Saved a diet plan", icon: "📌" });
  }
  if (activities.includes("ai-chat")) {
    cards.push({ id: "ai-1", activityId: "ai-chat", label: "Chatted secrets with AI", icon: "🤖" });
    cards.push({ id: "ai-2", activityId: "ai-chat", label: "Asked AI relationship advice", icon: "💬" });
  }
  if (activities.includes("gaming")) {
    cards.push({ id: "game-1", activityId: "gaming", label: "4-hour gaming session", icon: "🎮" });
    cards.push({ id: "game-2", activityId: "gaming", label: "Bought in-game currency", icon: "💳" });
  }
  if (activities.includes("shorts")) {
    cards.push({ id: "short-1", activityId: "shorts", label: "Watched 47 Shorts in a row", icon: "📱" });
    cards.push({ id: "short-2", activityId: "shorts", label: "2am doomscroll session", icon: "🌙" });
  }
  if (cards.length === 0) {
    cards.push({ id: "default-1", activityId: "default", label: "Opened the app", icon: "📲" });
    cards.push({ id: "default-2", activityId: "default", label: "Scrolled the feed", icon: "👆" });
  }
  return cards;
}

function getPlatformProfile(activities: string[]): { tags: PlatformTag[]; totalValue: number } {
  const tags: PlatformTag[] = [];
  let total = 1250;
  if (activities.includes("anxiety")) {
    tags.push({ label: "VULNERABLE / HIGH ENGAGEMENT", risk: "Mental health keywords detected. Tagged for 'relatable' content loops designed to maximize distress-driven engagement. Ad CPM: +340%.", colorClass: "neon-text-orange", value: 2840 });
    total += 2840;
  }
  if (activities.includes("fitspiration")) {
    tags.push({ label: "BODY IMAGE / SUPPLEMENTS TARGET", risk: "Body dissatisfaction markers flagged. Queued for diet pill, cosmetic surgery, and 'transformation' program ads. Vulnerability index: CRITICAL.", colorClass: "neon-text-orange", value: 3120 });
    total += 3120;
  }
  if (activities.includes("ai-chat")) {
    tags.push({ label: "AI DATA HARVESTER — DEEP PROFILE", risk: "Conversational data mined for: emotional state, relationship status, insecurities, purchase intent. Data sold to 14 broker networks.", colorClass: "neon-text-purple", value: 1890 });
    total += 1890;
  }
  if (activities.includes("gaming")) {
    tags.push({ label: "COMPULSIVE SPENDER / LOOT BOX TARGET", risk: "Extended play + micro-transactions = gambling propensity flag. Loot box frequency increased 5x. Time-limited 'exclusive' offers activated.", colorClass: "neon-text-blue", value: 4200 });
    total += 4200;
  }
  if (activities.includes("shorts")) {
    tags.push({ label: "INFINITE SCROLL SUSCEPTIBLE — TIER 1", risk: "Dopamine loop confirmed. Algorithm will reduce content quality to test engagement floor. Watch time optimization: AGGRESSIVE.", colorClass: "neon-text-blue", value: 2100 });
    total += 2100;
  }
  if (tags.length === 0) {
    tags.push({ label: "BASELINE PROFILE — STILL TRACKED", risk: "Even without activity, your device fingerprint, location, and browsing metadata are collected and sold.", colorClass: "neon-text-purple", value: 0 });
  }
  return { tags, totalValue: total };
}

const StageShadowProfile = ({ activities, onComplete }: StageShadowProfileProps) => {
  const cards = buildCards(activities);
  const [unplaced, setUnplaced] = useState<EvidenceCard[]>(cards);
  const [bucketContents, setBucketContents] = useState<Record<string, EvidenceCard[]>>({
    vulnerability: [],
    income: [],
    mental: [],
  });
  const [draggingCard, setDraggingCard] = useState<string | null>(null);
  const [phase, setPhase] = useState<"puzzle" | "comparison">("puzzle");
  const [revealIndex, setRevealIndex] = useState(0);
  const bucketRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allPlaced = unplaced.length === 0;
  const platform = getPlatformProfile(activities);

  const handleDragStart = (cardId: string) => {
    setDraggingCard(cardId);
  };

  const handleDrop = useCallback((bucketId: string) => {
    if (!draggingCard) return;
    const card = unplaced.find(c => c.id === draggingCard);
    if (!card) return;
    setUnplaced(prev => prev.filter(c => c.id !== draggingCard));
    setBucketContents(prev => ({ ...prev, [bucketId]: [...prev[bucketId], card] }));
    setDraggingCard(null);
  }, [draggingCard, unplaced]);

  const handleReveal = () => {
    setPhase("comparison");
    // Staggered reveal
    platform.tags.forEach((_, i) => {
      setTimeout(() => setRevealIndex(i + 1), (i + 1) * 600);
    });
  };

  const formatDollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen flex flex-col items-center px-3 py-6 pb-28 cyber-grid">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md mx-auto">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-1">
          <span className="neon-text-purple">Stage 2:</span> Identity Puzzle
        </h2>
        <p className="data-readout text-center mb-6 text-[10px]">
          // PROFILE THE SUSPECT — DRAG EVIDENCE INTO BUCKETS
        </p>

        <AnimatePresence mode="wait">
          {phase === "puzzle" ? (
            <motion.div key="puzzle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Evidence Cards */}
              <div className="space-y-1">
                <p className="data-readout text-[9px] mb-2">// EVIDENCE CARDS — DRAG TO CLASSIFY</p>
                <div className="flex flex-wrap gap-2">
                  {unplaced.map(card => (
                    <motion.div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card.id)}
                      onDragEnd={() => setDraggingCard(null)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-grab active:cursor-grabbing border border-border rounded-lg px-3 py-2 bg-card/80 backdrop-blur text-xs font-mono flex items-center gap-2 select-none"
                      style={{ boxShadow: "0 0 8px hsl(var(--primary) / 0.3)" }}
                      layout
                    >
                      <span className="text-base">{card.icon}</span>
                      <span className="text-foreground">{card.label}</span>
                    </motion.div>
                  ))}
                  {allPlaced && (
                    <p className="text-xs font-mono text-muted-foreground italic px-2">All evidence classified.</p>
                  )}
                </div>
              </div>

              {/* Buckets */}
              <div className="space-y-3">
                {BUCKETS.map(bucket => (
                  <div
                    key={bucket.id}
                    ref={el => { bucketRefs.current[bucket.id] = el; }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDrop(bucket.id)}
                    className={`border-2 border-dashed rounded-xl p-3 min-h-[60px] transition-colors ${
                      draggingCard ? "border-primary/60 bg-primary/5" : "border-border/50 bg-card/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{bucket.icon}</span>
                      <span className={`font-display font-semibold text-xs ${bucket.color}`}>{bucket.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {bucketContents[bucket.id].map(card => (
                        <motion.div
                          key={card.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="border border-border/60 rounded px-2 py-1 bg-muted/30 text-[10px] font-mono flex items-center gap-1"
                        >
                          <span>{card.icon}</span>
                          <span className="text-muted-foreground">{card.label}</span>
                        </motion.div>
                      ))}
                      {bucketContents[bucket.id].length === 0 && (
                        <span className="text-[10px] font-mono text-muted-foreground/50 italic">Drop evidence here...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reveal Button */}
              <motion.button
                onClick={handleReveal}
                disabled={!allPlaced}
                whileHover={allPlaced ? { scale: 1.03 } : {}}
                whileTap={allPlaced ? { scale: 0.97 } : {}}
                className={`w-full py-3 rounded-lg font-display font-semibold transition-all ${
                  allPlaced
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                }`}
                style={allPlaced ? { boxShadow: "var(--glow-orange)" } : {}}
              >
                {allPlaced ? "Reveal the Platform's Real Profile →" : `Place all evidence first (${unplaced.length} remaining)`}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="comparison" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Your Classification */}
              <div className="border border-border rounded-xl p-4 bg-card/40 backdrop-blur">
                <p className="data-readout text-[10px] mb-3">// YOUR CLASSIFICATION</p>
                <div className="space-y-2">
                  {BUCKETS.map(bucket => (
                    <div key={bucket.id} className="flex items-start gap-2">
                      <span className={`text-xs font-mono font-semibold ${bucket.color} whitespace-nowrap`}>{bucket.icon} {bucket.label.split(" ").slice(0, 2).join(" ")}:</span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {bucketContents[bucket.id].length > 0
                          ? bucketContents[bucket.id].map(c => c.label).join(", ")
                          : "—"}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-mono text-muted-foreground/70 mt-3 italic">
                  You classified {cards.length} data points across {BUCKETS.length} categories.
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="data-readout text-[9px]">// VS THE PLATFORM</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Platform's Real Profile */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border-2 border-destructive/40 rounded-xl overflow-hidden"
                style={{ boxShadow: "0 0 20px hsl(var(--destructive) / 0.2)" }}
              >
                <div className="bg-destructive/10 px-4 py-3 border-b border-destructive/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center text-xl border border-destructive/40">
                      👤
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground text-sm">COMMERCIAL IDENTITY CARD</p>
                      <p className="data-readout text-[9px]">PROFILE VALUE: <span className="neon-text-orange">{formatDollars(platform.totalValue)}/yr</span></p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="data-readout text-[9px] text-destructive/70">// PLATFORM'S ACTUAL CLASSIFICATION — AUTOMATED, CLINICAL, AGGRESSIVE</p>
                  {platform.tags.map((tag, i) => (
                    <motion.div
                      key={tag.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={i < revealIndex ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      className="border border-destructive/30 rounded-lg p-3 bg-destructive/5"
                    >
                      <div className={`font-mono text-xs font-bold mb-1 ${tag.colorClass}`}>
                        ⚠ {tag.label}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
                        {tag.risk}
                      </p>
                      <p className="text-[9px] font-mono neon-text-orange mt-1">
                        Profile value: +{formatDollars(tag.value)}/yr
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Lesson */}
              <div className="border border-border rounded-lg p-3 bg-card/50">
                <p className="data-readout text-[10px] mb-1">// THE LESSON</p>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                  You sorted {cards.length} clues into {BUCKETS.length} buckets. The platform did it in <span className="neon-text-orange">milliseconds</span> — using hundreds of data points you never saw. Their labels are more <span className="neon-text-purple">clinical</span>, more <span className="neon-text-orange">commercial</span>, and far more <span className="text-destructive">aggressive</span> than anything you imagined.
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
