import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Trophy, 
  Flame, 
  Zap, 
  Target, 
  Users, 
  Crown,
  Medal,
  Star
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useToast } from "@/hooks/use-toast";

export function GameStats() {
  const { user, getStats } = useGame();
  const { toast } = useToast();
  const stats = getStats();

  if (!user) return null;

  const levelProgress = (user.xp % 250) / 250 * 100; // 250 XP per level

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card className="border-0 bg-gradient-primary text-primary-foreground rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white/20">
                <AvatarFallback className="text-2xl bg-white/20">
                  {user.avatar || user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Crown className="h-4 w-4" />
                  <span className="text-sm opacity-90">Level {user.level}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold">{user.xp}</div>
              <div className="text-sm opacity-90">Total XP</div>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Level {user.level}</span>
              <span>Level {user.level + 1}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 bg-card/80 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{user.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.activeGoals}</div>
            <div className="text-sm text-muted-foreground">Active Goals</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.successRate}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.weeklyXP}</div>
            <div className="text-sm text-muted-foreground">Weekly XP</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-16 rounded-2xl text-base font-semibold"
          size="lg"
          onClick={() => toast({
            title: "Coming Soon! 🚀",
            description: "Squad functionality is being built. Stay tuned!",
            duration: 3000,
          })}
        >
          <Users className="h-5 w-5 mr-2" />
          Join Squad
        </Button>
        
        <Button 
          variant="outline" 
          className="h-16 rounded-2xl text-base font-semibold"
          size="lg"
          onClick={() => toast({
            title: "Coming Soon! 🏆",
            description: "Leaderboard is being developed. Check back soon!",
            duration: 3000,
          })}
        >
          <Trophy className="h-5 w-5 mr-2" />
          Leaderboard
        </Button>
      </div>
    </div>
  );
}