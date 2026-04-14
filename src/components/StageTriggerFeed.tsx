import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StageTriggerFeedProps {
  activities: string[];
  onComplete: () => void;
}

interface FeedItem {
  id: string;
  type: "ad" | "video" | "comment";
  content: string;
  warning: string;
  source: string;
  darkPatterns: DarkPattern[];
}

interface DarkPattern {
  id: string;
  label: string;
  description: string;
  found: boolean;
}

function generateFeed(activities: string[]): FeedItem[] {
  const items: FeedItem[] = [];
  let id = 0;

  if (activities.includes("anxiety")) {
    items.push(
      {
        id: String(id++), type: "video",
        content: "😢 'Signs you might have anxiety — and why it's worse than you think'",
        warning: "Algorithm amplifies mental health content to increase watch time",
        source: "ForYouPage",
        darkPatterns: [
          { id: `dp-${id}-0`, label: "Emotional Manipulation", description: "Uses fear to keep you watching", found: false },
        ],
      },
      {
        id: String(id++), type: "ad",
        content: "🧠 'Feeling anxious? Try this ONE supplement doctors don't want you to know' ⏰ OFFER ENDS IN 00:02:47",
        warning: "Unregulated supplement ad targeting vulnerable users",
        source: "Sponsored",
        darkPatterns: [
          { id: `dp-${id}-0`, label: "Fake Urgency Timer", description: "Countdown creates false pressure to buy now", found: false },
          { id: `dp-${id}-1`, label: "Authority Exploitation", description: "'Doctors don't want you to know' — manipulative framing", found: false },
        ],
      },
    );
  }
  if (activities.includes("fitspiration")) {
    items.push(
      {
        id: String(id++), type: "video",
        content: "💊 'I lost 20kg in 2 weeks — here's my secret' (NOT what you think)\n👍 142K  💬 3.2K  ↗️ Share  ⭐ Save",
        warning: "Promotes dangerous weight loss methods",
        source: "Trending",
        darkPatterns: [
          { id: `dp-${id}-0`, label: "Social Proof Inflation", description: "High like/comment counts pressure you to trust the content", found: false },
          { id: `dp-${id}-1`, label: "Clickbait Title", description: "'NOT what you think' is designed to exploit curiosity", found: false },
        ],
      },
      {
        id: String(id++), type: "ad",
        content: "🏋️ FLASH SALE: Weight loss pills — 70% OFF\n⚡ 847 people viewing this right now\n🔴 Only 3 left in stock!",
        warning: "High-pressure dark pattern with fake scarcity",
        source: "Sponsored",
        darkPatterns: [
          { id: `dp-${id}-0`, label: "Fake Scarcity", description: "'Only 3 left' is fabricated to rush your decision", found: false },
          { id: `dp-${id}-1`, label: "Activity Fabrication", description: "'847 people viewing' is inflated or fake", found: false },
        ],
      },
    );
  }
  if (activities.includes("ai-chat")) {
    items.push({
      id: String(id++), type: "ad",
      content: "🤖 'Your AI friend misses you! 💔 Come back for a deeper conversation'\n🔓 Upgrade to Premium — your AI remembers EVERYTHING",
      warning: "Emotional dependency monetization",
      source: "Notification",
      darkPatterns: [
        { id: `dp-${id}-0`, label: "Guilt Tripping", description: "'Misses you' creates false emotional obligation", found: false },
        { id: `dp-${id}-1`, label: "Artificial Relationship", description: "Treats a product as a relationship to drive spending", found: false },
      ],
    });
  }
  if (activities.includes("gaming")) {
    items.push(
      {
        id: String(id++), type: "ad",
        content: "🎮 ⚡ LEGENDARY LOOT BOX — Only 50 left!\n🏆 Your friend Jake just got a RARE skin!\n💰 Open now for just €4.99",
        warning: "Gambling mechanics targeting minors with social pressure",
        source: "In-Game",
        darkPatterns: [
          { id: `dp-${id}-0`, label: "Social Pressure", description: "'Your friend Jake' creates FOMO through peers", found: false },
          { id: `dp-${id}-1`, label: "Hidden Gambling", description: "Loot boxes are randomized purchases — gambling by design", found: false },
        ],
      },
    );
  }
  if (activities.includes("shorts")) {
    items.push(
      {
        id: String(id++), type: "video",
        content: "😱 'You won't BELIEVE what happened next...' (Part 47 of 200)\n▶ Auto-playing next in 3... 2... 1...",
        warning: "Infinite series designed to prevent you from stopping",
        source: "AutoPlay",
        darkPatterns: [
          { id: `dp-${id}-0`, label: "Autoplay Trap", description: "Auto-playing removes your choice to stop", found: false },
          { id: `dp-${id}-1`, label: "Serialized Hook", description: "'Part 47 of 200' makes you feel you've invested too much to quit", found: false },
        ],
      },
    );
  }

  // Always include the fake notification
  items.push({
    id: String(id++), type: "ad",
    content: "🔔 You have 99+ unread notifications!\n👥 5 friends posted new stories\n📸 Someone tagged you in a photo",
    warning: "Fake notification count — classic dark pattern to drive engagement",
    source: "System",
    darkPatterns: [
      { id: `dp-${id}-0`, label: "Fake Notification Count", description: "'99+' is inflated to make you feel urgency", found: false },
      { id: `dp-${id}-1`, label: "Vague Social Bait", description: "'Someone tagged you' withholds info to force a click", found: false },
    ],
  });

  return items;
}

const StageTriggerFeed = ({ activities, onComplete }: StageTriggerFeedProps) => {
  const [visibleCount, setVisibleCount] = useState(1);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(() => generateFeed(activities));
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [foundPatterns, setFoundPatterns] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalPatterns = feedItems.reduce((sum, item) => sum + item.darkPatterns.length, 0);
  const score = foundPatterns.size;

  useEffect(() => {
    if (visibleCount < feedItems.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), 1500);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, feedItems.length]);

  // Show hint after 8 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const handlePatternClick = (patternId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFoundPatterns((prev) => new Set([...prev, patternId]));
  };

  const getPatternStatus = (patternId: string) => foundPatterns.has(patternId);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 pb-24 cyber-grid">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-sm mx-auto"
      >
        <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-2">
          <span className="neon-text-orange">Stage 3:</span> Spot the Dark Patterns
        </h2>
        <p className="data-readout text-center mb-2">
          // TAP THE SNEAKY TACTICS HIDDEN IN EACH POST
        </p>

        {/* Score bar */}
        <div className="flex items-center gap-3 mb-4 border border-border rounded-lg p-2 bg-card/50">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">Dark Patterns Found</span>
              <span className="font-mono text-sm font-bold neon-text-orange">{score}/{totalPatterns}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-secondary"
                style={{ boxShadow: "var(--glow-orange)" }}
                animate={{ width: `${totalPatterns > 0 ? (score / totalPatterns) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="text-2xl">🕵️</div>
        </div>

        {showHint && score === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-mono text-center mb-3 neon-text-purple"
          >
            💡 Hint: Look for highlighted tactics below each post — tap them to identify the dark pattern!
          </motion.p>
        )}

        {/* Phone mockup */}
        <div className="border-2 border-border rounded-3xl bg-card/50 backdrop-blur overflow-hidden" style={{ boxShadow: "var(--glow-orange)" }}>
          <div className="w-20 h-1 bg-border rounded-full mx-auto mt-3" />

          <div ref={scrollRef} className="p-3 space-y-3 max-h-[50vh] overflow-y-auto">
            <AnimatePresence>
              {feedItems.slice(0, visibleCount).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="border border-border rounded-lg p-3 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      item.type === "ad" ? "bg-secondary/20 neon-text-orange" :
                      item.type === "comment" ? "bg-accent/20 neon-text-purple" :
                      "bg-primary/20 neon-text-blue"
                    }`}>
                      {item.source}
                    </span>
                    {item.darkPatterns.length > 0 && (
                      <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                        {item.darkPatterns.filter(dp => getPatternStatus(dp.id)).length}/{item.darkPatterns.length} 🎯
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground mt-2 font-mono leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>

                  {/* Dark pattern buttons */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.darkPatterns.map((dp) => {
                      const found = getPatternStatus(dp.id);
                      return (
                        <motion.button
                          key={dp.id}
                          onClick={(e) => handlePatternClick(dp.id, e)}
                          whileTap={{ scale: 0.9 }}
                          className={`text-[10px] font-mono px-2 py-1 rounded-full border transition-all ${
                            found
                              ? "border-secondary bg-secondary/20 neon-text-orange"
                              : "border-border bg-muted/30 text-muted-foreground hover:border-secondary/50 hover:bg-secondary/10"
                          }`}
                        >
                          {found ? "✓ " : "⚠ "}{dp.label}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {expandedId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-1.5">
                          {item.darkPatterns.filter(dp => getPatternStatus(dp.id)).map((dp) => (
                            <div key={dp.id} className="p-2 rounded border border-secondary/20 bg-secondary/5">
                              <p className="text-[11px] font-mono neon-text-orange font-semibold">{dp.label}</p>
                              <p className="text-[10px] font-mono text-muted-foreground">{dp.description}</p>
                            </div>
                          ))}
                          <div className="p-2 rounded border border-destructive/30 bg-destructive/5">
                            <p className="text-[11px] font-mono" style={{ color: "hsl(var(--neon-red))" }}>
                              ⚠ {item.warning}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {visibleCount < feedItems.length && (
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-center py-2"
              >
                <p className="data-readout text-[10px]">Loading more content...</p>
              </motion.div>
            )}
          </div>

          <div className="w-24 h-1 bg-border rounded-full mx-auto my-3" />
        </div>

        {/* Social pressure notification */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3 }}
          className="mt-4 border border-secondary rounded-lg p-3 bg-secondary/10 neon-border-orange"
        >
          <p className="text-xs font-mono text-foreground">
            🔔 <span className="neon-text-orange">5 friends</span> are online now! Don't miss out!
          </p>
          <p className="text-[10px] text-muted-foreground font-mono mt-1">
            ↑ Social pressure notification — a "risky affordance"
          </p>
        </motion.div>

        {/* Results / Continue */}
        <div className="mt-4 border border-border rounded-lg p-3 bg-card/50 text-center">
          <p className="font-mono text-xs text-muted-foreground mb-1">
            {score >= totalPatterns
              ? "🎉 Perfect score! You spotted every dark pattern!"
              : score > totalPatterns / 2
              ? `👏 Nice work! You found ${score} of ${totalPatterns} dark patterns.`
              : `🔍 Keep looking — you've found ${score} of ${totalPatterns} dark patterns so far.`}
          </p>
        </div>

        <motion.button
          onClick={onComplete}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full py-3 rounded-lg font-display font-semibold bg-accent text-accent-foreground"
          style={{ boxShadow: "var(--glow-purple)" }}
        >
          Take Back Control →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default StageTriggerFeed;
