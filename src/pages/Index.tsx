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
    updateGoal
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

  const handleCompleteGoal = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    // Update goal to completed
    await updateGoal(goalId, { status: 'completed' });
    
    // Epic completion sequence
    toast({
      title: "🎉 LEGENDARY VICTORY!",
      description: `You've conquered "${goal.title}" like a true champion!`,
      duration: 4000,
    });

    // Delayed XP bonus notification
    setTimeout(() => {
      toast({
        title: "⚡ +100 XP EARNED!",
        description: "Epic quest completion bonus! You're unstoppable!",
        duration: 3000,
      });
    }, 1000);

    // Level up check
    setTimeout(() => {
      if (user && (user.xp + 100) >= user.level * 250) {
        toast({
          title: "🚀 LEVEL UP!",
          description: `Congratulations! You've reached Level ${user.level + 1}!`,
          duration: 4000,
        });
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Enhanced Player Info */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-4 ring-primary/30 shadow-glow">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
                  {user?.avatar || user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Level indicator */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shadow-glow">
                {user?.level}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-1">{user?.username}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 px-3 py-1 bg-primary/20 rounded-full">
                  <Crown className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">Level {user?.level}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-primary/20 rounded-full">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">{user?.xp} XP</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-primary/20 rounded-full">
                  <Flame className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">{user?.currentStreak}</span>
                </div>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => signOut()}
            className="hover:bg-destructive/20 hover:text-destructive hover:border-destructive/50 transition-all duration-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Exit Game
          </Button>
        </div>

        {/* Enhanced New Quest Button */}
        <div className="mb-8">
          <CreateGoalDialog onCreateGoal={createGoal}>
            <Button size="lg" className="w-full h-20 text-xl font-bold rounded-3xl bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Target className="h-8 w-8 mr-4 animate-pulse" />
              <span className="relative z-10">Start Epic Quest</span>
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
                onComplete={handleCompleteGoal}
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