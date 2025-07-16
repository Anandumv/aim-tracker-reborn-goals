import { useState } from "react";
import { GoalCard } from "@/components/GoalCard";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import { StatsCard } from "@/components/StatsCard";
import { useGoals } from "@/hooks/useGoals";
import { Target, CheckCircle, Clock, TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const { goals, addGoal, updateGoalProgress, toggleGoalComplete, stats } = useGoals();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-card mb-6">
            <Target className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Aim
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Simple goal tracking for meaningful progress
          </p>
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
        <div className="flex justify-center mb-8">
          <AddGoalDialog onAddGoal={addGoal} />
        </div>

        {/* Goals Grid */}
        {filteredGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/30 rounded-2xl mb-6">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <h3 className="text-xl font-semibold mb-3 text-foreground">
              Ready to start?
            </h3>
            
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Create your first goal and begin tracking your progress toward meaningful achievements.
            </p>
            
            <AddGoalDialog onAddGoal={addGoal} />
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No goals match your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
