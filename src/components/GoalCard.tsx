import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Plus, Minus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTimeRemaining, formatTimeRemaining } from "@/utils/timeUtils";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";

interface Goal {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: string;
  createdAt: Date;
  deadline?: Date;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  periodStartDate: Date;
  periodEndDate: Date;
  completed: boolean;
  lastUpdated: Date;
}

interface GoalCardProps {
  goal: Goal;
  onUpdate: (goalId: string, newValue: number) => void;
  onToggleComplete: (goalId: string) => void;
}

export function GoalCard({ goal, onUpdate, onToggleComplete }: GoalCardProps) {
  const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
  const isCompleted = goal.completed || progressPercentage >= 100;
  const timeRemaining = getTimeRemaining(goal.periodEndDate);
  const timeRemainingText = formatTimeRemaining(timeRemaining);

  const handleIncrement = async () => {
    if (!isCompleted) {
      // Add haptic feedback on mobile
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Light });
      }
      onUpdate(goal.id, Math.min(goal.currentValue + 1, goal.targetValue));
    }
  };

  const handleDecrement = async () => {
    if (goal.currentValue > 0) {
      // Add haptic feedback on mobile
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Light });
      }
      onUpdate(goal.id, goal.currentValue - 1);
    }
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-card border-0 bg-card/50 backdrop-blur-sm",
      isCompleted && "bg-gradient-subtle"
    )}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-lg font-semibold text-foreground mb-1 truncate",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {goal.title}
            </h3>
            
            <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
              {goal.category}
            </Badge>
            
            {!isCompleted && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {timeRemainingText}
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleComplete(goal.id)}
            className="ml-3 h-8 w-8 p-0 rounded-full hover:bg-primary-light"
          >
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2 bg-muted"
          />
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {Math.round(progressPercentage)}%
            </span>
            
            <div className="flex items-center gap-2">
              <Button
                variant="minimal"
                size="sm"
                onClick={handleDecrement}
                disabled={goal.currentValue <= 0}
                className="h-8 w-8 p-0 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleIncrement}
                disabled={isCompleted}
                className="h-8 w-8 p-0 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}