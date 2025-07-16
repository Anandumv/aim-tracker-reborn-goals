import { useState } from "react";
import { GoalCard } from "@/components/GoalCard";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import { StatsCard } from "@/components/StatsCard";
import { useGoals } from "@/hooks/useGoals";
import { Target, TrendingUp, CheckCircle, Clock, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { goals, addGoal, updateGoalProgress, toggleGoalComplete, stats } = useGoals();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Get unique categories
  const categories = Array.from(new Set(goals.map(goal => goal.category)));

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || goal.category === filterCategory;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "completed" && (goal.completed || goal.currentValue >= goal.targetValue)) ||
                         (filterStatus === "active" && !goal.completed && goal.currentValue < goal.targetValue);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const completionRate = stats.totalGoals > 0 ? Math.round((stats.completedGoals / stats.totalGoals) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-glow mb-6">
            <Target className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Aim: Goals & Progress
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your goals, monitor progress, and achieve success with our beautiful goal tracking app.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Goals"
            value={stats.totalGoals}
            icon={Target}
            description="Goals created"
          />
          
          <StatsCard
            title="Completed"
            value={stats.completedGoals}
            icon={CheckCircle}
            description="Goals achieved"
            trend={{ value: completionRate, isPositive: true }}
          />
          
          <StatsCard
            title="Active Goals"
            value={stats.activeGoals}
            icon={Clock}
            description="In progress"
          />
          
          <StatsCard
            title="Average Progress"
            value={`${stats.averageProgress}%`}
            icon={TrendingUp}
            description="Overall completion"
          />
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 border-muted/20"
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-card/50 border-muted/20">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
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
            <SelectTrigger className="w-full sm:w-40 bg-card/50 border-muted/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Goals</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Goal Button */}
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
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/20 rounded-2xl mb-6">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">
              {goals.length === 0 ? "No goals yet" : "No goals match your filters"}
            </h3>
            
            <p className="text-muted-foreground mb-6">
              {goals.length === 0 
                ? "Create your first goal to start tracking your progress" 
                : "Try adjusting your search or filter criteria"
              }
            </p>
            
            {goals.length === 0 && <AddGoalDialog onAddGoal={addGoal} />}
          </div>
        )}

        {/* Filter Results Badge */}
        {(searchTerm || filterCategory !== "all" || filterStatus !== "all") && filteredGoals.length > 0 && (
          <div className="flex justify-center mt-6">
            <Badge variant="secondary" className="px-4 py-2">
              Showing {filteredGoals.length} of {goals.length} goals
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
