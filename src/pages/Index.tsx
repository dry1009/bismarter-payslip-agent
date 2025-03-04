
import Chat from "@/components/Chat";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = () => {
  return (
    <div className="h-[100dvh] w-full overflow-hidden">
      <ErrorBoundary>
        <Chat />
      </ErrorBoundary>
    </div>
  );
};

export default Index;
