
import { motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const ChatHeader = () => {
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
            <AvatarImage src="/lovable-uploads/8b2508b2-ff1e-484a-b4e3-599cc6655ed2.png" alt="BiSmarter Logo" />
            <div className="h-full w-full rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <span className="text-sm font-medium">ס</span>
            </div>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
