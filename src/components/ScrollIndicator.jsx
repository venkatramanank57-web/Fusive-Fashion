import { ChevronDown } from "lucide-react";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-6 left-0 w-full flex flex-col items-center animate-bounce z-20 pointer-events-none">
      
      {/* V icon */}
      <div className="flex justify-center w-full">
        <ChevronDown 
          size={isMobile() ? 40 : 50} // Responsive size
          strokeWidth={1} 
          className="text-gray-700"
        />
      </div>

    </div>
  );
}

// Helper to check mobile if needed, or just use fixed size
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;