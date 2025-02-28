
import Chat from "@/components/Chat";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col"
    >
      <div className="flex-1 max-w-4xl w-full mx-auto shadow-xl rounded-xl overflow-hidden bg-card border">
        <Chat />
      </div>
    </motion.div>
  );
};

export default Index;
