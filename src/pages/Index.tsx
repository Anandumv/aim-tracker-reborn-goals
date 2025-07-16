import { useState, useEffect } from "react";
import { GoalCard } from "@/components/GoalCard";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import { StatsCard } from "@/components/StatsCard";
import { SettingsDialog } from "@/components/SettingsDialog";
import { useGoals } from "@/hooks/useGoals";
import { useNotifications } from "@/hooks/useNotifications";
import { Target, CheckCircle, Clock, TrendingUp, Search, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const { goals, addGoal, updateGoalProgress, toggleGoalComplete, stats } = useGoals();
  const { sendGoalReminder } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Send reminder notifications
  useEffect(() => {
    if (goals.length > 0) {
      sendGoalReminder(stats.activeGoals, stats.todayUpdated);
    }
  }, [goals.length, stats.activeGoals, stats.todayUpdated, sendGoalReminder]);

  // Get unique categories
  const categories = Array.from(new Set(goals.map(goal => goal.category)));

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || goal.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-3xl shadow-glow">
              <Target className="h-10 w-10 text-primary-foreground" />
            </div>
            <SettingsDialog />
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Grail
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            Your personal goal companion
          </p>
          
          <div className="max-w-md mx-auto text-center">
            <p className="text-base text-muted-foreground leading-relaxed">
              Track what matters. No pressure, no streaks, just meaningful progress toward your goals.
            </p>
          </div>
          
          {goals.length > 0 && (
            <div className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground bg-primary-light px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Your data stays private on your device
            </div>
          )}
        </div>

        {/* Stats */}
        {goals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Goals"
              value={stats.totalGoals}
              icon={Target}
            />
            
            <StatsCard
              title="Completed"
              value={stats.completedGoals}
              icon={CheckCircle}
            />
            
            <StatsCard
              title="In Progress"
              value={stats.activeGoals}
              icon={Clock}
            />
            
            <StatsCard
              title="Updated Today"
              value={stats.todayUpdated}
              icon={Activity}
            />
            
            <StatsCard
              title="Avg Progress"
              value={`${stats.averageProgress}%`}
              icon={TrendingUp}
            />
          </div>
        )}

        {/* Search and Filter */}
        {goals.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-0 bg-muted/30 text-base"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48 h-12 border-0 bg-muted/30">
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
          </div>
        )}

        {/* Add Goal */}
        <div className="flex justify-center mb-12">
          <AddGoalDialog onAddGoal={addGoal} />
        </div>

        {/* Goals Grid */}
        {filteredGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdate={updateGoalProgress}
                onToggleComplete={toggleGoalComplete}
              />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-subtle rounded-3xl mb-8">
              <Target className="h-10 w-10 text-primary" />
            </div>
            
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              Welcome to Grail! 
            </h3>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              Start your journey by creating your first goal. Whether it's reading more books, 
              exercising regularly, or learning a new skill - we're here to help you succeed.
            </p>
            
            <AddGoalDialog onAddGoal={addGoal} />
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">Set Goals</h4>
                <p className="text-sm text-muted-foreground">Choose what matters to you</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">Track Progress</h4>
                <p className="text-sm text-muted-foreground">See your improvement over time</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">Achieve Success</h4>
                <p className="text-sm text-muted-foreground">Celebrate your wins</p>
              </div>
            </div>
          </div>
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
  );
};

export default Index;
