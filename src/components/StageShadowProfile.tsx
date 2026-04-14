import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StageShadowProfileProps {
  activities: string[];
  onComplete: () => void;
}

const SUSPECTS = [
  {
    id: "target-alpha",
    alias: "The High-Roller",
    clue: "Spends hours in virtual worlds. Known for impulsive in-game purchases.",
    match: "gaming",
  },
  {
    id: "target-beta",
    alias: "The Trend-Chaser",
    clue: "Obsessed with fitness aesthetics. High engagement with influencer content.",
    match: "fitspiration",
  },
  {
    id: "target-gamma",
    alias: "The Vulnerable scroller",
    clue: "Frequently searches for health reassurance. Stuck in engagement loops.",
    match: "anxiety",
  }
];

const StageShadowProfile = ({ activities, onComplete }: StageShadowProfileProps) => {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [isSolved, setIsSolved] = useState(false);

  // Convert raw activity IDs into "Evidence Cards"
  const evidenceCards = activities.map(act => ({
    id: act,
    label: act.charAt(0).toUpperCase() + act.slice(1).replace("-", " "),
  }));

  const handleAssign = (evidenceId: string, suspectId: string) => {
    setAssignments(prev => ({ ...prev, [evidenceId]: suspectId }));
  };

  const checkInvestigation = () => {
    // Logic to see if the user matched correctly or to just reveal the "Algorithmic Truth"
    setIsSolved(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 pb-24 cyber-grid bg-slate-950 text-slate-100">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 border-b border-primary/30 pb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-primary tracking-tighter uppercase">
              Case File: #79D-CRUMB
            </h2>
            <p className="font-mono text-xs text-muted-foreground">// TASK: MATCH DIGITAL EXPOSURE TO TARGET PROFILES</p>
          </div>
          <Badge variant="outline" className="animate-pulse border-red-500 text-red-500">INVESTIGATION ACTIVE</Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column: Evidence Locker */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-400 uppercase tracking-widest italic">Evidence Locker</h3>
            <div className="flex flex-wrap gap-2 md:flex-col">
              {evidenceCards.map((card) => (
                <motion.div
                  key={card.id}
                  layoutId={card.id}
                  className={`p-3 rounded border cursor-pointer font-mono text-xs transition-colors ${
                    assignments[card.id] ? "bg-slate-800 border-slate-700 opacity-50" : "bg-primary/10 border-primary/40 hover:bg-primary/20"
                  }`}
                >
                  📄 {card.label}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Target Profiles */}
          <div className="md:col-span-2 grid sm:grid-cols-1 gap-4">
            {SUSPECTS.map((suspect) => (
              <Card key={suspect.id} className="bg-slate-900/50 border-slate-800 p-4 relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-display font-bold text-orange-400">{suspect.alias}</h4>
                    <span className="text-[10px] font-mono text-slate-500">MATCH_ID: {suspect.id}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed italic">"{suspect.clue}"</p>
                  
                  <div className="flex gap-2">
                    {/* Simplified selection for mobile responsiveness */}
                    <select 
                      className="bg-slate-800 border-slate-700 text-[10px] font-mono rounded px-2 py-1 w-full"
                      onChange={(e) => handleAssign(e.target.value, suspect.id)}
                      value={Object.keys(assignments).find(key => assignments[key] === suspect.id) || ""}
                    >
                      <option value="">Assign Evidence...</option>
                      {evidenceCards.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Visual "String" effect background */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-primary/10 transition-colors" />
              </Card>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isSolved && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }}
              className="mt-8 p-6 bg-red-950/20 border border-red-900/50 rounded-lg"
            >
              <h3 className="text-red-500 font-display font-bold mb-2 uppercase">Investigative Reveal: The Algorithmic Eye</h3>
              <p className="font-mono text-sm text-slate-300 leading-relaxed">
                You matched these people based on logic. But the <span className="text-orange-500">Double Logic</span> of platforms is faster. 
                They don't see "The High-Roller"; they see a <span className="text-primary">database entry</span> ready for targeted psychological triggers.
              </p>
              <Button onClick={onComplete} className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-display uppercase tracking-widest">
                Access Targeted Feed Data →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSolved && (
          <Button 
            onClick={checkInvestigation}
            disabled={Object.keys(assignments).length === 0}
            className="mt-8 w-full py-6 bg-primary text-primary-foreground font-display font-bold text-lg rounded-none skew-x-2"
          >
            SUBMIT INVESTIGATION REPORT
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default StageShadowProfile;
