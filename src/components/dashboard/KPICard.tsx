import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "primary";
}

export function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  variant = "default" 
}: KPICardProps) {
  return (
    <Card className="p-1 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center",
          variant === "success" && "bg-success/10",
          variant === "warning" && "bg-warning/10", 
          variant === "primary" && "bg-primary/10",
          variant === "default" && "bg-muted"
        )}>
          <Icon className={cn(
            "h-4 w-4",
            variant === "success" && "text-success",
            variant === "warning" && "text-warning", 
            variant === "primary" && "text-primary",
            variant === "default" && "text-muted-foreground"
          )} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-2">
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
            {trend && (
              <span className={cn(
                "text-sm font-medium flex items-center px-2 py-0.5 rounded-full",
                trend.isPositive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}