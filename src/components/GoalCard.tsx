import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Calendar, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

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
  completed: boolean;
}

interface GoalCardProps {
  goal: Goal;
  onUpdate: (goalId: string, newValue: number) => void;
  onToggleComplete: (goalId: string) => void;
}

export function GoalCard({ goal, onUpdate, onToggleComplete }: GoalCardProps) {
  const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
  const isCompleted = goal.completed || progressPercentage >= 100;
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleIncrement = () => {
    if (!isCompleted) {
      onUpdate(goal.id, Math.min(goal.currentValue + 1, goal.targetValue));
    }
  };

  const handleDecrement = () => {
    if (goal.currentValue > 0) {
      onUpdate(goal.id, goal.currentValue - 1);
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-glow border-muted/20",
      isCompleted && "bg-gradient-secondary"
    )}>
      <div className="absolute inset-0 bg-gradient-primary opacity-5" />
      
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={cn(
              "text-lg font-semibold",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {goal.title}
            </CardTitle>
            {goal.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {goal.description}
              </p>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleComplete(goal.id)}
            className="ml-2 hover:bg-primary/20"
          >
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            {goal.category}
          </Badge>
          {goal.deadline && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(goal.deadline)}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative pt-0">
        <div className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-primary" />
                <span>Progress</span>
              </div>
              <span className="font-medium">
                {goal.currentValue} / {goal.targetValue} {goal.unit}
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-muted/30"
            />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{Math.round(progressPercentage)}% complete</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>
                  {goal.targetValue - goal.currentValue > 0 
                    ? `${goal.targetValue - goal.currentValue} ${goal.unit} to go`
                    : 'Goal achieved!'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecrement}
                disabled={goal.currentValue <= 0}
                className="h-8 w-8 p-0"
              >
                -
              </Button>
              
              <Button
                variant="gradient"
                size="sm"
                onClick={handleIncrement}
                disabled={isCompleted}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}