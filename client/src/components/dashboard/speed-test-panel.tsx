import { Gauge } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { useSpeedTest } from "@/hooks/use-speed-test";

export function SpeedTestPanel() {
  const { isRunning, results, runSpeedTest } = useSpeedTest();

  return (
    <GlassPanel className="rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-primary flex items-center">
          <Gauge className="mr-3" />
          Network Speed Test
        </h3>
        <Button 
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          onClick={runSpeedTest}
          disabled={isRunning}
          data-testid="button-start-speed-test"
        >
          {isRunning ? "Testing..." : "Start Test"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="rgba(255, 215, 0, 0.2)" strokeWidth="8" fill="none"/>
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                stroke="#FFD700" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (results.downloadSpeed / 100) * 283} 
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-primary" data-testid="text-download-speed">
                {results.downloadSpeed.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">Mbps</span>
            </div>
          </div>
          <p className="text-white font-medium">Download Speed</p>
        </div>
        
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="rgba(255, 215, 0, 0.2)" strokeWidth="8" fill="none"/>
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                stroke="#FFD700" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (results.uploadSpeed / 50) * 283} 
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-primary" data-testid="text-upload-speed">
                {results.uploadSpeed.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">Mbps</span>
            </div>
          </div>
          <p className="text-white font-medium">Upload Speed</p>
        </div>
        
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="rgba(255, 215, 0, 0.2)" strokeWidth="8" fill="none"/>
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                stroke="#FFD700" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray="283" 
                strokeDashoffset={283 - ((100 - results.ping) / 100) * 283} 
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-primary" data-testid="text-ping">
                {Math.round(results.ping)}
              </span>
              <span className="text-sm text-muted-foreground">ms</span>
            </div>
          </div>
          <p className="text-white font-medium">Ping</p>
        </div>
      </div>
    </GlassPanel>
  );
}
