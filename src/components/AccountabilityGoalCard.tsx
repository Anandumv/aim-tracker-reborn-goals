import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Trophy, 
  Clock, 
  CheckCircle,
  Zap,
  Star,
  Crown,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Goal } from "@/types";

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
  const isAlmostDone = progressPercentage >= 80 && !isCompleted;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-500 hover:scale-[1.02] border-0 rounded-3xl group",
      isCompleted ? "bg-gradient-success ring-2 ring-green-500/50 shadow-success animate-success-bounce" :
      isExpired ? "bg-gradient-to-br from-red-500/20 to-rose-600/30 ring-2 ring-red-500/40" :
      isAlmostDone ? "bg-gradient-to-br from-amber-500/20 to-orange-600/30 ring-2 ring-amber-500/40 animate-glow-pulse" :
      "bg-gradient-card backdrop-blur-sm hover:shadow-glow"
    )}>
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary-light/10" />
      </div>
      
      {/* Status indicator with animation */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 transition-all duration-500",
        isCompleted ? "bg-gradient-success animate-pulse" :
        isExpired ? "bg-gradient-to-r from-red-500 to-rose-500" :
        isAlmostDone ? "bg-gradient-warning animate-pulse" :
        "bg-gradient-primary"
      )} />
      
      {/* Floating icons for special states */}
      {isCompleted && (
        <div className="absolute top-4 right-4 animate-float">
          <Crown className="h-6 w-6 text-yellow-400" />
        </div>
      )}
      
      {isAlmostDone && !isCompleted && (
        <div className="absolute top-4 right-4 animate-float">
          <Sparkles className="h-6 w-6 text-amber-400" />
        </div>
      )}
      
      <CardContent className="p-6 relative z-10">
        {/* Header with enhanced typography */}
        <div className="mb-6">
          <h3 className={cn(
            "text-xl font-bold mb-3 truncate transition-colors duration-300",
            isCompleted ? "text-green-100" : "text-foreground group-hover:gradient-text"
          )}>
            {goal.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-300",
              isCompleted ? "bg-green-500/20 text-green-300" :
              isExpired ? "bg-red-500/20 text-red-300" :
              isAlmostDone ? "bg-amber-500/20 text-amber-300" :
              "bg-muted/30"
            )}>
              <Clock className="h-3 w-3" />
              {isCompleted ? "Completed!" : isExpired ? "Expired" : `${daysRemaining}d left`}
            </div>
            
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary">
              <Zap className="h-3 w-3" />
              {progressPercentage}%
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Progress 
                value={progressPercentage} 
                className={cn(
                  "h-3 bg-muted/30 transition-all duration-500",
                  isCompleted && "animate-pulse"
                )}
              />
              {/* Progress glow effect */}
              <div 
                className={cn(
                  "absolute top-0 left-0 h-3 rounded-full transition-all duration-500",
                  isCompleted ? "bg-gradient-success opacity-50" :
                  isAlmostDone ? "bg-gradient-warning opacity-30" :
                  "bg-gradient-primary opacity-20"
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">
                Day {Math.max(1, totalDays - daysRemaining + 1)} of {totalDays}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-primary" />
                <span className="text-primary font-medium">
                  {isCompleted ? "Quest Complete!" : `${progressPercentage}% Progress`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Button */}
        {!isCompleted && !isExpired && (
          <div className="pt-4 border-t border-border/50">
            <Button
              variant="default"
              className={cn(
                "w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105",
                isAlmostDone ? 
                  "bg-gradient-warning hover:shadow-warning animate-glow-pulse" :
                  "bg-gradient-primary hover:shadow-glow"
              )}
              onClick={() => onComplete(goal.id)}
            >
              <Trophy className="h-5 w-5 mr-2" />
              {isAlmostDone ? "Claim Victory!" : "Complete Quest"}
            </Button>
          </div>
        )}

        {/* Enhanced Completion Status */}
        {isCompleted && (
          <div className="pt-4 border-t border-green-500/30">
            <div className="flex items-center justify-center gap-3 p-4 bg-green-500/20 rounded-2xl">
              <CheckCircle className="h-6 w-6 text-green-400 animate-pulse" />
              <div className="text-center">
                <div className="font-bold text-green-100 text-lg">Quest Completed!</div>
                <div className="text-sm text-green-300">You're a champion! 🎉</div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Expired Status */}
        {isExpired && (
          <div className="pt-4 border-t border-red-500/30">
            <div className="flex items-center justify-center gap-3 p-4 bg-red-500/20 rounded-2xl">
              <Target className="h-6 w-6 text-red-400" />
              <div className="text-center">
                <div className="font-bold text-red-100 text-lg">Quest Expired</div>
                <div className="text-sm text-red-300">Try again next time! 💪</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}