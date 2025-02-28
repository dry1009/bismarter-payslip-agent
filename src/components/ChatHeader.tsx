
import { motion } from "framer-motion";

const ChatHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="p-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <span className="text-lg font-medium">ס</span>
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
          </div>
          <div>
            <h2 className="font-semibold">הסוכן שלי</h2>
            <p className="text-xs text-muted-foreground">מחובר</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
