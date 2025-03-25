import React from 'react';

interface SignalStrengthVisualizerProps {
  signalData: number[];
  height?: number;
}

export function SignalStrengthVisualizer({ signalData, height = 40 }: SignalStrengthVisualizerProps) {
  return (
    <div className="flex items-end h-10 space-x-1">
      {signalData.map((value, index) => (
        <div
          key={index}
          className="w-1.5 bg-primary rounded-t transition-all duration-300 ease-in-out"
          style={{
            height: `${Math.max(15, value)}%`,
            opacity: 0.4 + (value / 100) * 0.6
          }}
        />
      ))}
    </div>
  );
}