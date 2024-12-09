import { Loader } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex items-start justify-center h-full">
      <Loader className="w-8 h-8" />
    </div>
  );
}
