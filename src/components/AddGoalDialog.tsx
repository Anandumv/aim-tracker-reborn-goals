import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Target } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { calculatePeriodDates } from "@/utils/timeUtils";

interface Goal {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: string;
  createdAt: Date;
  deadline?: Date;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  periodStartDate: Date;
  periodEndDate: Date;
  completed: boolean;
  lastUpdated: Date;
}

interface AddGoalDialogProps {
  onAddGoal: (goal: Omit<Goal, 'id' | 'currentValue' | 'completed' | 'createdAt' | 'lastUpdated'>) => void;
}

const categories = [
  "Health", "Learning", "Career", "Personal", "Finance", "Lifestyle"
];

const units = [
  "times", "hours", "days", "minutes", "pages", "exercises", "lessons"
];

const periods = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'custom', label: 'Custom Period' },
];

export function AddGoalDialog({ onAddGoal }: AddGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState<number>(10);
  const [unit, setUnit] = useState("times");
  const [category, setCategory] = useState("");
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'>('monthly');
  const [customEndDate, setCustomEndDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !category || targetValue <= 0) {
      return;
    }

    const { start, end } = calculatePeriodDates(period, customEndDate);

    onAddGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      targetValue,
      unit,
      category,
      period,
      periodStartDate: start,
      periodEndDate: end,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setTargetValue(10);
    setUnit("times");
    setCategory("");
    setPeriod('monthly');
    setCustomEndDate(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className="rounded-2xl px-10 py-6 text-lg font-semibold shadow-glow hover:shadow-glow hover:scale-105 transition-all duration-200">
          <Plus className="h-6 w-6 mr-3" />
          Create Your First Goal
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] border-0 bg-card/98 backdrop-blur-sm rounded-3xl">
        <DialogHeader className="text-center space-y-4 pt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mx-auto">
            <Target className="h-8 w-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-3xl font-bold text-foreground">
            Create a Goal
          </DialogTitle>
          <p className="text-muted-foreground">
            What would you like to achieve?
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 mt-8">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-base font-semibold text-foreground">
              Goal Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Read 12 books, Exercise 3 times per week..."
              className="border-0 bg-muted/50 text-lg h-14 rounded-2xl px-6"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="target" className="text-base font-semibold text-foreground">
                Target
              </Label>
              <Input
                id="target"
                type="number"
                min="1"
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="border-0 bg-muted/50 h-14 rounded-2xl px-6 text-lg"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="unit" className="text-base font-semibold text-foreground">
                Unit
              </Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="border-0 bg-muted/50 h-14 rounded-2xl px-6">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-foreground">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="border-0 bg-muted/50 h-12">
                <SelectValue placeholder="Choose category" />
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

          <div className="space-y-2">
            <Label htmlFor="period" className="text-sm font-medium text-foreground">
              Time Period
            </Label>
            <Select value={period} onValueChange={(value: any) => setPeriod(value)} required>
              <SelectTrigger className="border-0 bg-muted/50 h-12">
                <SelectValue placeholder="Choose time period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {period === 'custom' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-0 bg-muted/50 h-12",
                      !customEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customEndDate ? format(customEndDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={setCustomEndDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Notes (optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any additional details..."
              className="border-0 bg-muted/50 min-h-[80px] resize-none"
            />
          </div>

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
              disabled={!title.trim() || !category || targetValue <= 0}
            >
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}