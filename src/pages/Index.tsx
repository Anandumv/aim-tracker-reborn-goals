import { useState, useEffect } from "react";
import { AccountabilityGoalCard } from "@/components/AccountabilityGoalCard";
import { CreateGoalDialog } from "@/components/CreateGoalDialog";
import { GameStats } from "@/components/GameStats";
import { useGame } from "@/contexts/GameContext";
import { Target, Flame, Trophy, Users, Zap, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { 
    user, 
    goals, 
    loading, 
    createGoal, 
    performCheckIn,
    getStats
  } = useGame();
  
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("active");

  // Show welcome toast for new users
  useEffect(() => {
    if (user && goals.length === 0) {
      toast({
        title: "🎯 Welcome to Commit!",
        description: "Ready to put your money where your goals are? Create your first goal and stake some money!",
        duration: 5000,
      });
    }
  }, [user, goals.length, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your accountability journey...</p>
        </div>
      </div>
    );
  }

  // Get unique categories
  const categories = Array.from(new Set(goals.map(goal => goal.category)));

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || goal.category === filterCategory;
    const matchesStatus = filterStatus === "all" || goal.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCheckIn = (goalId: string, success: boolean) => {
    performCheckIn(goalId, success);
    
    if (success) {
      toast({
        title: "🎉 Great job!",
        description: "You earned 25 XP and kept your streak alive!",
        duration: 3000,
      });
    } else {
      const goal = goals.find(g => g.id === goalId);
      toast({
        title: "😞 Money burned!",
        description: `₹${goal?.wagerAmount} has been deducted from your wallet. Get back on track tomorrow!`,
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-3xl shadow-glow mb-8">
            <Target className="h-10 w-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Commit
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            Put Your Money Where Your Goals Are
          </p>
          
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-base text-muted-foreground leading-relaxed">
              Set meaningful goals, stake real money, join accountability squads, and earn rewards for success. 
              Fail and your money goes to the community pot. Succeed and earn XP, coins, and respect.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Game Stats */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <GameStats />
          </div>

          {/* Right Column - Goals */}
          <div className="xl:col-span-2 order-1 xl:order-2">
            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="flex-1">
                <CreateGoalDialog onCreateGoal={createGoal} />
              </div>
              
              {goals.length > 0 && (
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="rounded-2xl">
                    <Users className="h-5 w-5 mr-2" />
                    Find Squad
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-2xl">
                    <Trophy className="h-5 w-5 mr-2" />
                    Leaderboard
                  </Button>
                </div>
              )}
            </div>

            {/* Filters */}
            {goals.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search goals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-0 bg-muted/30 text-base rounded-2xl"
                  />
                </div>
                
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48 h-12 border-0 bg-muted/30 rounded-2xl">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40 h-12 border-0 bg-muted/30 rounded-2xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Goals</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Goals Grid */}
            {filteredGoals.length > 0 ? (
              <div className="space-y-6">
                {filteredGoals.map((goal) => (
                  <AccountabilityGoalCard
                    key={goal.id}
                    goal={goal}
                    onCheckIn={handleCheckIn}
                  />
                ))}
              </div>
            ) : goals.length === 0 ? (
              <Card className="border-0 bg-gradient-subtle rounded-3xl p-12 text-center">
                <CardContent className="space-y-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-primary rounded-3xl">
                    <Target className="h-12 w-12 text-primary-foreground" />
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-foreground">
                      Ready to Commit? 🎯
                    </h2>
                    
                    <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                      Turn your goals into serious commitments. Stake real money, join squads, 
                      and watch your motivation skyrocket!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto">
                        <Target className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">Set Goals</h3>
                      <p className="text-sm text-muted-foreground">Choose what matters and stake money on it</p>
                    </div>
                    
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">Join Squads</h3>
                      <p className="text-sm text-muted-foreground">Get accountability from friends</p>
                    </div>
                    
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto">
                        <Trophy className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">Earn Rewards</h3>
                      <p className="text-sm text-muted-foreground">Win XP, coins, and pot money</p>
                    </div>
                  </div>

                  <CreateGoalDialog onCreateGoal={createGoal} />
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-subtle rounded-2xl mb-6">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  No matches found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;