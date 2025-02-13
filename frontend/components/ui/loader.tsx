import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Loader({
  className,
  size = 32,
}: {
  className: string;
  size: number;
}) {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Loader2 className="animate-spin" size={size} />
    </div>
  );
}
