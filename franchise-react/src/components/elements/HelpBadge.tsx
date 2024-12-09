import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HelpBadgeProps {
  to: string;
  className?: string;
  text: string;
}

export default function HelpBadge({ to, className, text }: HelpBadgeProps) {
  return (
    <Link to={to} rel="noopener noreferrer" target={to === "#" ? "" : "_blank"} className="max-h-min">
      <Badge className={cn("text-red-950 bg-yellow-300 rounded-sm font-normal h-4 text-[10px] px-1", className)}>
        {text}
      </Badge>
    </Link>
  );
}
