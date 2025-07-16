import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Target } from "lucide-react";
import { Goal } from "@/types";

interface CreateGoalDialogProps {
  onCreateGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'currentStreak' | 'totalCheckIns' | 'missedCheckIns' | 'totalBurned' | 'xpEarned' | 'lastCheckIn'>) => void;
  children?: React.ReactNode;
}

const categories = [
  "💪 Fitness", "📚 Learning", "💼 Career", "🎯 Personal", "💰 Finance", "🧘 Wellness"
];

const durations = [
  { label: "1 Week", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "30 Days", days: 30 },
  { label: "60 Days", days: 60 },
  { label: "90 Days", days: 90 }
];

export function CreateGoalDialog({ onCreateGoal, children }: CreateGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !category) {
      return;
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

    onCreateGoal({
      title: title.trim(),
      category,
      frequency: 'daily',
      startDate,
      endDate,
      wagerAmount: 0,
      currency: '',
      privacy: 'solo',
      status: 'active'
    });

    // Reset form
    setTitle("");
    setCategory("");
    setDuration(30);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button 
            variant="default" 
            size="lg" 
            className="rounded-2xl px-10 py-6 text-lg font-semibold shadow-glow hover:shadow-glow hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-6 w-6 mr-3" />
            Create Goal
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] border-0 bg-card/98 backdrop-blur-sm rounded-3xl">
         <DialogHeader className="text-center space-y-4 pt-2">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mx-auto">
             <Target className="h-8 w-8 text-primary-foreground" />
           </div>
           <DialogTitle className="text-3xl font-bold text-foreground">
             Start New Quest
           </DialogTitle>
           <p className="text-muted-foreground">
             Choose your challenge and set your commitment level!
           </p>
         </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* Goal Title */}
          <div className="space-y-3">
             <Label htmlFor="title" className="text-base font-semibold text-foreground">
               What's your quest?
             </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Exercise for 30 minutes every day"
              className="border-0 bg-muted/50 text-lg h-14 rounded-2xl px-6"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-base font-semibold text-foreground">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="border-0 bg-muted/50 h-14 rounded-2xl px-6">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">
              Duration
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {durations.map((dur) => (
                <Button
                  key={dur.days}
                  type="button"
                  variant={duration === dur.days ? "default" : "outline"}
                  className="h-12 rounded-xl text-sm"
                  onClick={() => setDuration(dur.days)}
                >
                  {dur.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="flex-1 h-14 rounded-2xl text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
               className="flex-1 h-14 rounded-2xl text-base font-semibold shadow-glow"
               disabled={!title.trim() || !category}
             >
               Start Quest
             </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}