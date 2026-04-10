import { useState, useCallback } from "react";
import Landing from "@/components/Landing";
import StageBrowser from "@/components/StageBrowser";
import StageShadowProfile from "@/components/StageShadowProfile";
import StageTriggerFeed from "@/components/StageTriggerFeed";
import StageMastery from "@/components/StageMastery";
import ResearchSidebar from "@/components/ResearchSidebar";

type Stage = "landing" | "browser" | "shadow" | "feed" | "mastery";

const STAGE_MAP: Record<Stage, number> = {
  landing: 0,
  browser: 1,
  shadow: 2,
  feed: 3,
  mastery: 4,
};

const Index = () => {
  const [stage, setStage] = useState<Stage>("landing");
  const [activities, setActivities] = useState<string[]>([]);

  const handleBrowserComplete = useCallback((acts: string[]) => {
    setActivities(acts);
    setStage("shadow");
  }, []);

  const handleRestart = useCallback(() => {
    setActivities([]);
    setStage("landing");
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      {stage === "landing" && <Landing onStart={() => setStage("browser")} />}
      {stage === "browser" && <StageBrowser onComplete={handleBrowserComplete} />}
      {stage === "shadow" && <StageShadowProfile activities={activities} onComplete={() => setStage("feed")} />}
      {stage === "feed" && <StageTriggerFeed activities={activities} onComplete={() => setStage("mastery")} />}
      {stage === "mastery" && <StageMastery onRestart={handleRestart} />}

      <ResearchSidebar stage={STAGE_MAP[stage]} />
    </div>
  );
};

export default Index;
