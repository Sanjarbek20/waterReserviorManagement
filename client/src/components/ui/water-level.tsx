import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface WaterLevelProps {
  percentage: number;
  width?: string;
  height?: string;
  showLabel?: boolean;
  className?: string;
  animate?: boolean;
}

export default function WaterLevel({
  percentage,
  width = "w-full",
  height = "h-40",
  showLabel = true,
  className,
  animate = true
}: WaterLevelProps) {
  const [currentPercentage, setCurrentPercentage] = useState(0);
  
  useEffect(() => {
    // Animate the water level
    if (animate) {
      const start = Math.min(currentPercentage, percentage);
      const end = Math.max(currentPercentage, percentage);
      const duration = 1000; // 1 second
      const increment = (end - start) / (duration / 16);
      
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        
        if (
          (increment > 0 && current >= percentage) ||
          (increment < 0 && current <= percentage)
        ) {
          clearInterval(timer);
          setCurrentPercentage(percentage);
        } else {
          setCurrentPercentage(current);
        }
      }, 16);
      
      return () => clearInterval(timer);
    } else {
      setCurrentPercentage(percentage);
    }
  }, [percentage, animate]);
  
  // Determine color based on percentage
  let fillColor = "bg-blue-500";
  if (currentPercentage < 30) {
    fillColor = "bg-red-500";
  } else if (currentPercentage < 50) {
    fillColor = "bg-orange-500";
  } else if (currentPercentage > 80) {
    fillColor = "bg-green-500";
  }
  
  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden bg-gray-200",
        width,
        height,
        className
      )}
    >
      <div 
        className={cn(
          "absolute bottom-0 w-full transition-height duration-1000",
          fillColor
        )}
        style={{ height: `${currentPercentage}%` }}
      >
        {/* Water animation effect */}
        <div className="absolute top-0 left-0 w-[200%] h-[10px] bg-white bg-opacity-20 rounded-full animate-wave"></div>
      </div>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white drop-shadow-md">
            {Math.round(currentPercentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

// Add a custom animation to the tailwind.config.ts file
// Make sure to append this to the existing animations
// animation: {
//   'wave': 'wave 3s infinite linear',
// },
// keyframes: {
//   'wave': {
//     '0%': { transform: 'translateX(-50%) scale(1)' },
//     '50%': { transform: 'translateX(0%) scale(1)' },
//     '100%': { transform: 'translateX(-50%) scale(1)' },
//   },
// },
