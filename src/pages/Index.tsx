import { useState, useEffect } from "react";
import { AccountabilityGoalCard } from "@/components/AccountabilityGoalCard";
import { CreateGoalDialog } from "@/components/CreateGoalDialog";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/hooks/useAuth";
import { Target, Flame, Zap, Search, LogOut, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Index = () => {
  const { 
    user, 
    goals, 
    loading, 
    createGoal, 
    performCheckIn,
    getStats
  } = useGame();
  
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Show welcome toast for new users
  useEffect(() => {
    if (user && goals.length === 0) {
      toast({
        title: "🎯 Welcome to the Quest!",
        description: "Ready to start your journey? Create your first quest and level up!",
        duration: 5000,
      });
    }
  }, [user, goals.length, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your quest journal...</p>
        </div>
      </div>
    );
  }

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCheckIn = (goalId: string, success: boolean) => {
    performCheckIn(goalId, success);
    
    if (success) {
      toast({
        title: "🎉 Quest Complete!",
        description: "You earned 25 XP and kept your streak alive!",
        duration: 3000,
      });
    } else {
      toast({
        title: "😞 Quest Failed!",
        description: "Don't worry, you can try again tomorrow!",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Player Info */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                {user?.avatar || user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{user?.username}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Crown className="h-4 w-4 text-primary" />
                  Level {user?.level}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-primary" />
                  {user?.xp} XP
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-primary" />
                  {user?.currentStreak} streak
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </div>

        {/* New Quest Button */}
        <div className="mb-8">
          <CreateGoalDialog onCreateGoal={createGoal}>
            <Button size="lg" className="w-full h-16 text-lg font-semibold rounded-2xl bg-gradient-primary hover:shadow-glow transition-all duration-200">
              <Target className="h-6 w-6 mr-3" />
              Start New Quest
            </Button>
          </CreateGoalDialog>
        </div>

        {/* Filter if there are multiple goals */}
        {goals.length > 5 && (
          <div className="mb-6">
            <Input
              placeholder="Search quests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-muted/30 h-12 rounded-2xl px-4"
            />
          </div>
        )}

        {/* Active Quests */}
        {filteredGoals.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Active Quests</h2>
            {filteredGoals.map((goal) => (
              <AccountabilityGoalCard
                key={goal.id}
                goal={goal}
                onCheckIn={handleCheckIn}
              />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-6">
              <Target className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Ready to Play? 🎮
            </h2>
            <p className="text-muted-foreground mb-8">
              Start your first quest and begin your journey to success!
            </p>
            <CreateGoalDialog onCreateGoal={createGoal}>
              <Button size="lg" className="px-8 py-3 bg-gradient-primary hover:shadow-glow transition-all duration-200">
                <Target className="h-5 w-5 mr-2" />
                Create First Quest
              </Button>
            </CreateGoalDialog>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;