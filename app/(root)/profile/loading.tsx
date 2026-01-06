import LoadingSpinner from "@/components/LoadingSpinner";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" text="Loading profile..." />
    </div>
  );
};

export default Loading;
