import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StageMasteryProps {
  onRestart: () => void;
}

const POSITIVE_POSTS = [
  { id: "1", content: "🌱 'How to set healthy screen time boundaries'", category: "Wellbeing" },
  { id: "2", content: "📚 'Free coding tutorials for teens — learn to build, not just scroll'", category: "Education" },
  { id: "3", content: "🎨 'Art challenge: Draw something that made you smile today'", category: "Creative" },
  { id: "4", content: "🏃 'Local park run this Saturday — all skill levels welcome!'", category: "Community" },
  { id: "5", content: "🧠 'Understanding your emotions — a teen's guide to mental health'", category: "Health" },
  { id: "6", content: "🎵 'Music production basics — make your first beat in 10 minutes'", category: "Skills" },
  { id: "7", content: "🌍 'Teen climate action group — join our next beach cleanup'", category: "Activism" },
];

const StageMastery = ({ onRestart }: StageMasteryProps) => {
  const [shieldOn, setShieldOn] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [feedReset, setFeedReset] = useState(false);

  const togglePost = (id: string) => {
    setSelectedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      if (next.size >= 5) setFeedReset(true);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 pb-24 cyber-grid">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-sm mx-auto"
      >
        <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-2">
          <span className="neon-text-blue">Stage 4:</span>{" "}
          <span className="neon-text-purple">Platform Literacy Toolbox</span>
        </h2>
        <p className="data-readout text-center mb-6">
          // TAKE BACK CONTROL OF YOUR DIGITAL LIFE
        </p>

        {/* Privacy Shield */}
        <motion.div
          layout
          className={`border-2 rounded-xl p-4 mb-4 transition-all ${
            shieldOn ? "neon-border bg-primary/5" : "border-border bg-card/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-sm text-foreground">🛡️ Privacy Shield</p>
              <p className="text-[11px] font-mono text-muted-foreground mt-1">
                {shieldOn ? "Blocking data crumbs from leaving your device" : "Your data is being harvested freely"}
              </p>
            </div>
            <button
              onClick={() => setShieldOn(!shieldOn)}
              className={`w-14 h-7 rounded-full transition-all relative ${
                shieldOn ? "bg-primary" : "bg-muted"
              }`}
              style={shieldOn ? { boxShadow: "var(--glow-blue)" } : {}}
            >
              <motion.div
                layout
                className="w-5 h-5 rounded-full bg-foreground absolute top-1"
                style={{ left: shieldOn ? "calc(100% - 24px)" : "4px" }}
              />
            </button>
          </div>

          <AnimatePresence>
            {shieldOn && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-1 font-mono text-[11px]">
                  <p className="neon-text-blue">✓ Third-party cookies blocked</p>
                  <p className="neon-text-blue">✓ Ad tracker requests denied</p>
                  <p className="neon-text-blue">✓ Location data hidden</p>
                  <p className="neon-text-blue">✓ Cross-app tracking disabled</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Feed Reset */}
        <div className="border-2 border-border rounded-xl p-4 mb-4 bg-card/50">
          <p className="font-display font-semibold text-sm text-foreground mb-1">
            🔄 Feed Reset — Retrain the Algorithm
          </p>
          <p className="text-[11px] font-mono text-muted-foreground mb-3">
            Select <span className="neon-text-orange">5 positive posts</span> to teach the algorithm what you actually want to see.
          </p>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ boxShadow: "var(--glow-blue)" }}
                animate={{ width: `${(selectedPosts.size / 5) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {selectedPosts.size}/5
            </span>
          </div>

          <div className="space-y-2">
            {POSITIVE_POSTS.map((post) => {
              const selected = selectedPosts.has(post.id);
              return (
                <motion.button
                  key={post.id}
                  onClick={() => !feedReset && togglePost(post.id)}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full text-left p-2.5 rounded-lg border font-mono text-xs transition-all ${
                    selected
                      ? "border-primary bg-primary/10 neon-border"
                      : feedReset
                      ? "border-border bg-muted/10 opacity-50"
                      : "border-border bg-muted/20 hover:bg-muted/40"
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground">{post.category}</span>
                  <p className={selected ? "text-foreground" : "text-muted-foreground"}>
                    {post.content}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Success / Final Message */}
        <AnimatePresence>
          {feedReset && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border-2 rounded-xl p-5 mb-4 bg-card/80 backdrop-blur space-y-4"
              style={{ borderColor: "hsl(var(--neon-green))", boxShadow: "0 0 20px hsl(150 80% 50% / 0.3)" }}
            >
              <div className="text-center">
                <p className="text-3xl mb-2">🎉</p>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  Algorithm Retrained!
                </h3>
              </div>

              <div className="space-y-3 text-xs font-mono text-muted-foreground leading-relaxed">
                <div className="border-l-2 border-primary pl-3">
                  <p className="neon-text-blue font-semibold mb-1">🧠 Platform Literacy</p>
                  <p>True digital literacy isn't just about safety — it's about understanding how the <span className="neon-text-orange">"double logic of platformization"</span> works.</p>
                </div>
                <div className="border-l-2 border-secondary pl-3">
                  <p className="neon-text-orange font-semibold mb-1">🎯 Anticipatory Action</p>
                  <p>You can take control by being <span className="neon-text-purple">reflexive</span> — critically examining platform features and intentionally "gaming the algorithm."</p>
                </div>
                <div className="border-l-2 border-accent pl-3">
                  <p className="neon-text-purple font-semibold mb-1">🛡️ The Skill of Distrust</p>
                  <p>Learning to distrust the platform's commercial motivations is a <span className="neon-text-blue">vital coping strategy</span> in a digital age.</p>
                </div>
              </div>

              <motion.button
                onClick={onRestart}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-lg font-display font-semibold bg-primary text-primary-foreground"
                style={{ boxShadow: "var(--glow-blue)" }}
              >
                ↺ Start Over
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StageMastery;
