import { motion, AnimatePresence } from "framer-motion";

const STATS_BY_STAGE: Record<number, { label: string; stat: string; source: string }[]> = {
  0: [
    { label: "Problematic Use", stat: "7% → 11% (2018-2022)", source: "HBSC" },
  ],
  1: [
    { label: "Gaming Intensity", stat: "22% play 4+ hours on a typical gaming day", source: "HBSC" },
    { label: "AI Chatbot Use", stat: "36% of 12-15 year olds engage with AI chatbots", source: "CyberSafeKids" },
  ],
  2: [
    { label: "Hidden Dangers", stat: "60% of bothered 8-12 year olds see harmful content on YouTube", source: "CyberSafeKids" },
    { label: "Double Logic", stat: "Platforms are business frameworks designed to ready user data for commercial databases", source: "Research" },
  ],
  3: [
    { label: "Risky Affordances", stat: "Algorithms 'request, demand, or encourage' commercially profitable actions", source: "Research" },
    { label: "Triggering Content", stat: "Platforms amplify viral content that can trigger vulnerabilities for engagement", source: "Research" },
  ],
  4: [
    { label: "Platform Literacy", stat: "Understanding the 'double logic of platformization' is true digital literacy", source: "Research" },
    { label: "Anticipatory Action", stat: "Young people can 'game the algorithm' to clean their feeds", source: "Research" },
  ],
};

interface ResearchSidebarProps {
  stage: number;
}

const ResearchSidebar = ({ stage }: ResearchSidebarProps) => {
  const stats = STATS_BY_STAGE[stage] || STATS_BY_STAGE[0];

  return (
    <motion.div
      layout
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur border-t border-border px-4 py-3"
    >
      <div className="max-w-lg mx-auto">
        <p className="data-readout uppercase tracking-widest text-[10px] mb-2">
          📊 Research Data — Stage {stage}/4
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-1"
          >
            {stats.map((s, i) => (
              <p key={i} className="text-xs font-mono text-muted-foreground">
                <span className="neon-text-blue">{s.label}:</span>{" "}
                <span className="text-foreground/80">{s.stat}</span>{" "}
                <span className="opacity-40">({s.source})</span>
              </p>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ResearchSidebar;
