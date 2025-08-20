import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  dueTime?: string;
  onClick?: () => void;
}

export function TaskItem({ 
  title, 
  description, 
  priority, 
  status, 
  dueTime, 
  onClick 
}: TaskItemProps) {
  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-warning text-warning-foreground",
    low: "bg-muted text-muted-foreground",
  };

  const statusIcons = {
    pending: AlertCircle,
    "in-progress": Clock,
    completed: CheckCircle2,
  };

  const StatusIcon = statusIcons[status];

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
      <StatusIcon className={cn(
        "w-4 h-4 mt-0.5",
        status === "completed" && "text-success",
        status === "in-progress" && "text-warning",
        status === "pending" && "text-muted-foreground"
      )} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium truncate">{title}</h4>
          <Badge 
            variant="secondary" 
            className={cn("text-xs", priorityColors[priority])}
          >
            {priority}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {description}
        </p>
        
        {dueTime && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{dueTime}</span>
          </div>
        )}
      </div>
      
      {onClick && (
        <Button variant="ghost" size="sm" onClick={onClick}>
          Ver
        </Button>
      )}
    </div>
  );
}