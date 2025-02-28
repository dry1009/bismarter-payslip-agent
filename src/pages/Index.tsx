
import Chat from "@/components/Chat";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"
    >
      <div className="flex-1 max-w-4xl w-full mx-auto shadow-xl rounded-xl overflow-hidden bg-card border">
        <Chat />
      </div>
    </motion.div>
  );
};

export default Index;
