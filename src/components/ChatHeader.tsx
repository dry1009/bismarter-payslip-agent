
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

const ChatHeader = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // טעינה מקדימה של התמונה למטמון הדפדפן
    const img = new Image();
    img.src = "/lovable-uploads/8b2508b2-ff1e-484a-b4e3-599cc6655ed2.png";
    img.onload = () => setImageLoaded(true);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-3 px-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="text-gray-500 text-sm">שאל כל דבר לגבי השכר שלך</div>
        <div 
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleRefresh}
        >
          <h1 className="text-gray-800 text-lg font-medium ml-2">BiSmarter</h1>
          <Avatar className="h-7 w-7">
            <AvatarImage 
              src="/lovable-uploads/8b2508b2-ff1e-484a-b4e3-599cc6655ed2.png" 
              alt="BiSmarter Logo"
              className={imageLoaded ? "opacity-100" : "opacity-0"}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <AvatarFallback className="bg-white opacity-0">
                <span className="text-sm font-medium">ס</span>
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
