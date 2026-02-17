import { ChevronDown } from "lucide-react";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-10 ">
      
      {/* V icon */}
      <ChevronDown 
        size={50} 
        strokeWidth={1} 
        className="text-gray-700"
      />

    </div>
  );
}
