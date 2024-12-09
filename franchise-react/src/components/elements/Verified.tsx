import { Approved } from "@/assets/KYCPendingSVG";
import { cn } from "@/lib/utils";

export const Verified = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col md:pt-5", className)}>
      <div className="lg:mt-4 ml-4">
        <Approved />
      </div>
      <span className="text-xs text-constructive mt-0.5">Verified</span>
    </div>
  );
};
