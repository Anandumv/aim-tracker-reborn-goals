import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Flame, 
  Trophy, 
  Users, 
  Clock, 
  CheckCircle, 
  X,
  DollarSign,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Goal } from "@/types";
import { useGame } from "@/contexts/GameContext";

interface GoalCardProps {
  goal: Goal;
  onCheckIn: (goalId: string, success: boolean) => void;
}

export function AccountabilityGoalCard({ goal, onCheckIn }: GoalCardProps) {
  const { user } = useGame();
  
  const today = new Date().toDateString();
  const hasCheckedInToday = goal.lastCheckIn && 
    new Date(goal.lastCheckIn).toDateString() === today;

  const progressPercentage = Math.round(
    (goal.totalCheckIns / Math.max(1, goal.totalCheckIns + goal.missedCheckIns)) * 100
  );

  const daysRemaining = Math.ceil(
    (goal.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const streakColor = goal.currentStreak >= 7 ? "text-orange-500" : 
                     goal.currentStreak >= 3 ? "text-yellow-500" : "text-gray-400";

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-glow border-0 rounded-3xl",
      goal.status === 'active' ? "bg-card/80 backdrop-blur-sm" : "bg-muted/50",
      hasCheckedInToday && "ring-2 ring-primary/50"
    )}>
      {/* Status indicator */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        goal.status === 'active' ? "bg-gradient-primary" : "bg-muted"
      )} />
      
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground mb-2 truncate">
              {goal.title}
            </h3>
            
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary" className="text-sm font-medium px-3 py-1 rounded-full bg-primary-light text-primary">
                {goal.category}
              </Badge>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                {goal.currency}{goal.wagerAmount}
              </div>

              {goal.privacy === 'squad' && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Squad
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Flame className={cn("h-4 w-4", streakColor)} />
                <span className={streakColor}>{goal.currentStreak} day streak</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {daysRemaining}d left
              </div>
              
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-primary" />
                {goal.xpEarned} XP
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Success Rate</span>
              <span className="font-medium text-foreground">
                {goal.totalCheckIns} / {goal.totalCheckIns + goal.missedCheckIns} ({progressPercentage}%)
              </span>
            </div>
            
            <Progress value={progressPercentage} className="h-2 bg-muted/30" />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{goal.totalCheckIns}</div>
              <div className="text-xs text-muted-foreground">Check-ins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">
                {goal.currency}{goal.totalBurned}
              </div>
              <div className="text-xs text-muted-foreground">Burned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">{goal.xpEarned}</div>
              <div className="text-xs text-muted-foreground">XP Earned</div>
            </div>
          </div>

          {/* Check-in Actions */}
          {goal.status === 'active' && (
            <div className="pt-4 border-t border-border">
              {hasCheckedInToday ? (
                <div className="flex items-center justify-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Checked in today!</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center text-sm font-medium text-foreground">
                    Did you complete your goal today?
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="default"
                      className="flex-1 h-12 rounded-2xl font-semibold shadow-glow"
                      onClick={() => onCheckIn(goal.id, true)}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Yes! ✅
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex-1 h-12 rounded-2xl"
                      onClick={() => onCheckIn(goal.id, false)}
                    >
                      <X className="h-5 w-5 mr-2" />
                      No 😞
                    </Button>
                  </div>
                  
                  <div className="text-xs text-center text-destructive">
                    ⚠️ Saying "No" will burn {goal.currency}{goal.wagerAmount} from your wallet
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}