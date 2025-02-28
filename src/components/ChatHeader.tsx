
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";

const ChatHeader = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-3 px-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleRefresh}
        >
          <Avatar className="h-7 w-7">
            <div className="h-full w-full rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <span className="text-sm font-medium">ס</span>
            </div>
          </Avatar>
          <h1 className="text-gray-800 text-lg font-medium">הסוכן שלי</h1>
        </div>
        <div className="text-gray-500 text-sm">שאל כל דבר</div>
      </div>
    </header>
  );
};

export default ChatHeader;
