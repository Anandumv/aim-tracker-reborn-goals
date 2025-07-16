import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Trophy, 
  Clock, 
  CheckCircle,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Goal } from "@/types";
import { useGame } from "@/contexts/GameContext";

interface GoalCardProps {
  goal: Goal;
  onComplete: (goalId: string) => void;
}

export function AccountabilityGoalCard({ goal, onComplete }: GoalCardProps) {
  const daysRemaining = Math.ceil(
    (goal.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalDays = Math.ceil(
    (goal.endDate.getTime() - goal.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const progressPercentage = Math.max(0, Math.round(((totalDays - daysRemaining) / totalDays) * 100));

  const isCompleted = goal.status === 'completed';
  const isExpired = daysRemaining <= 0 && !isCompleted;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:scale-[1.02] border-0 rounded-3xl",
      isCompleted ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 ring-2 ring-green-500/30" :
      isExpired ? "bg-gradient-to-r from-red-500/20 to-rose-500/20 ring-2 ring-red-500/30" :
      "bg-card/80 backdrop-blur-sm hover:shadow-glow"
    )}>
      {/* Status indicator */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        isCompleted ? "bg-gradient-to-r from-green-500 to-emerald-500" :
        isExpired ? "bg-gradient-to-r from-red-500 to-rose-500" :
        "bg-gradient-primary"
      )} />
      
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground mb-3 truncate">
              {goal.title}
            </h3>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {isCompleted ? "Completed!" : isExpired ? "Expired" : `${daysRemaining}d left`}
              </div>
              
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-primary" />
                {progressPercentage}% progress
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-2 bg-muted/30" />
              <div className="text-xs text-muted-foreground text-center">
                Day {totalDays - daysRemaining + 1} of {totalDays}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!isCompleted && !isExpired && (
          <div className="pt-4 border-t border-border">
            <Button
              variant="default"
              className="w-full h-12 rounded-2xl font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-200"
              onClick={() => onComplete(goal.id)}
            >
              <Trophy className="h-5 w-5 mr-2" />
              Complete Quest
            </Button>
          </div>
        )}

        {/* Completion Status */}
        {isCompleted && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Quest Completed! 🎉</span>
            </div>
          </div>
        )}

        {/* Expired Status */}
        {isExpired && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <Target className="h-5 w-5" />
              <span className="font-medium">Quest Expired 💀</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}