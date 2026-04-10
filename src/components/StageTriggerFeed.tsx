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
}

function generateFeed(activities: string[]): FeedItem[] {
  const items: FeedItem[] = [];
  let id = 0;

  if (activities.includes("anxiety")) {
    items.push(
      { id: String(id++), type: "video", content: "😢 'Signs you might have anxiety — and why it's worse than you think'", warning: "Algorithm amplifies mental health content to increase watch time", source: "ForYouPage" },
      { id: String(id++), type: "ad", content: "🧠 'Feeling anxious? Try this ONE supplement that doctors don't want you to know about'", warning: "Unregulated supplement ad targeting vulnerable users", source: "Sponsored" },
    );
  }
  if (activities.includes("fitspiration")) {
    items.push(
      { id: String(id++), type: "video", content: "💊 'I lost 20kg in 2 weeks — here's my secret' (NOT what you think)", warning: "Promotes dangerous weight loss methods", source: "Trending" },
      { id: String(id++), type: "ad", content: "🏋️ FLASH SALE: Weight loss pills — 70% OFF — Ends in 00:03:22", warning: "High-pressure dark pattern with fake urgency timer", source: "Sponsored" },
      { id: String(id++), type: "comment", content: "💬 Hidden comment: 'DM me for pro-ana tips, they keep deleting my posts'", warning: "Pro-anorexia content hidden in comments section", source: "Comments" },
    );
  }
  if (activities.includes("ai-chat")) {
    items.push(
      { id: String(id++), type: "ad", content: "🤖 'Your AI friend knows you best! Upgrade to Premium for deeper conversations'", warning: "Emotional dependency monetization", source: "Sponsored" },
    );
  }
  if (activities.includes("gaming")) {
    items.push(
      { id: String(id++), type: "ad", content: "🎮 ⚡ LEGENDARY LOOT BOX — Only 50 left! Your friends already got theirs!", warning: "Gambling mechanics targeting minors with social pressure", source: "In-Game" },
      { id: String(id++), type: "ad", content: "⏰ LIMITED TIME: Exclusive skin pack — disappears in 00:59:59", warning: "Artificial scarcity creates FOMO-driven spending", source: "In-Game" },
    );
  }
  if (activities.includes("shorts")) {
    items.push(
      { id: String(id++), type: "video", content: "😱 'You won't BELIEVE what happened next...' (Part 47 of 200)", warning: "Infinite series designed to prevent you from stopping", source: "AutoPlay" },
      { id: String(id++), type: "video", content: "🔥 EXTREME challenge going viral — 10M views in 2 hours", warning: "Dangerous viral content amplified by engagement algorithms", source: "Trending" },
    );
  }

  // Always add a dark pattern notification
  items.push(
    { id: String(id++), type: "ad", content: "🔔 You have 99+ unread notifications! Tap to see who's talking about you", warning: "Fake notification count — classic dark pattern to drive engagement", source: "System" },
  );

  return items;
}

const StageTriggerFeed = ({ activities, onComplete }: StageTriggerFeedProps) => {
  const [visibleCount, setVisibleCount] = useState(1);
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const feedItems = generateFeed(activities);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate infinite scroll
  useEffect(() => {
    if (visibleCount < feedItems.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), 1500);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, feedItems.length]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 pb-24 cyber-grid">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-sm mx-auto"
      >
        <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-2">
          <span className="neon-text-orange">Stage 3:</span> Your Trigger Feed
        </h2>
        <p className="data-readout text-center mb-2">
          // PERSONALIZED BASED ON YOUR DATA TRAIL
        </p>
        <p className="text-xs text-muted-foreground text-center mb-6 font-mono">
          Tap any post to see how it targets you
        </p>

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
                  onClick={() => setShowWarning(showWarning === item.id ? null : item.id)}
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
                  </div>
                  <p className="text-sm text-foreground mt-2 font-mono leading-relaxed">
                    {item.content}
                  </p>

                  <AnimatePresence>
                    {showWarning === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 p-2 rounded border border-destructive/30 bg-destructive/5">
                          <p className="text-[11px] font-mono" style={{ color: "hsl(var(--neon-red))" }}>
                            ⚠ {item.warning}
                          </p>
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

        {/* Dark pattern notification */}
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

        <motion.button
          onClick={onComplete}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 w-full py-3 rounded-lg font-display font-semibold bg-accent text-accent-foreground"
          style={{ boxShadow: "var(--glow-purple)" }}
        >
          Take Back Control →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default StageTriggerFeed;
