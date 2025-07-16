import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Target, Users, Lock, Globe, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Goal } from "@/types";
import { useGame } from "@/contexts/GameContext";

interface CreateGoalDialogProps {
  onCreateGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'currentStreak' | 'totalCheckIns' | 'missedCheckIns' | 'totalBurned' | 'xpEarned' | 'lastCheckIn'>) => void;
}

const categories = [
  "💪 Fitness", "📚 Learning", "💼 Career", "🎯 Personal", "💰 Finance", "🧘 Wellness"
];

const wagerAmounts = [50, 100, 200, 500, 1000];

const customDaysOptions = [
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' },
];

export function CreateGoalDialog({ onCreateGoal }: CreateGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [customDays, setCustomDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>();
  const [wagerAmount, setWagerAmount] = useState(100);
  const [customWager, setCustomWager] = useState<number>();
  const [privacy, setPrivacy] = useState<'solo' | 'public' | 'squad'>('solo');
  const [isPublicSquad, setIsPublicSquad] = useState(false);

  const handleCustomDayToggle = (day: string) => {
    setCustomDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !category || !endDate) {
      return;
    }

    if (frequency === 'custom' && customDays.length === 0) {
      return;
    }

    const finalWager = customWager || wagerAmount;

    onCreateGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      frequency,
      customDays: frequency === 'custom' ? customDays : undefined,
      startDate,
      endDate,
      wagerAmount: finalWager,
      currency: '₹',
      privacy,
      status: 'active'
    });

    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
    setFrequency('daily');
    setCustomDays([]);
    setStartDate(new Date());
    setEndDate(undefined);
    setWagerAmount(100);
    setCustomWager(undefined);
    setPrivacy('solo');
    setIsPublicSquad(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="lg" 
          className="rounded-2xl px-10 py-6 text-lg font-semibold shadow-glow hover:shadow-glow hover:scale-105 transition-all duration-200"
        >
          <Plus className="h-6 w-6 mr-3" />
          Create Goal & Stake Money
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] border-0 bg-card/98 backdrop-blur-sm rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4 pt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mx-auto">
            <Target className="h-8 w-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-3xl font-bold text-foreground">
            Stake & Commit
          </DialogTitle>
          <p className="text-muted-foreground">
            What are you committing to for the next 30 days?
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 mt-8">
          {/* Goal Title */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-base font-semibold text-foreground">
              Goal Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Wake up before 6 AM every day"
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

          {/* Frequency */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">
              Frequency
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {(['daily', 'weekly', 'custom'] as const).map((freq) => (
                <Button
                  key={freq}
                  type="button"
                  variant={frequency === freq ? "default" : "outline"}
                  className="h-12 rounded-xl capitalize"
                  onClick={() => setFrequency(freq)}
                >
                  {freq}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Days */}
          {frequency === 'custom' && (
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">
                Select Days
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {customDaysOptions.map((day) => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={customDays.includes(day.value) ? "default" : "outline"}
                    className="h-10 text-sm"
                    onClick={() => handleCustomDayToggle(day.value)}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-0 bg-muted/50 h-14 rounded-2xl px-6"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-0 bg-muted/50 h-14 rounded-2xl px-6",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date <= startDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Wager Amount */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Wager Amount (Money at Stake)
            </Label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {wagerAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={wagerAmount === amount && !customWager ? "default" : "outline"}
                  className="h-12 rounded-xl"
                  onClick={() => {
                    setWagerAmount(amount);
                    setCustomWager(undefined);
                  }}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Custom amount"
              value={customWager || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setCustomWager(isNaN(value) ? undefined : value);
              }}
              className="border-0 bg-muted/50 h-12 rounded-2xl px-6"
            />
            <p className="text-xs text-destructive">
              ⚠️ This amount will be deducted from your wallet for each missed day
            </p>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">
              Privacy & Squad
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant={privacy === 'solo' ? "default" : "outline"}
                className="h-12 rounded-xl flex items-center gap-2"
                onClick={() => setPrivacy('solo')}
              >
                <Lock className="h-4 w-4" />
                Solo
              </Button>
              <Button
                type="button"
                variant={privacy === 'public' ? "default" : "outline"}
                className="h-12 rounded-xl flex items-center gap-2"
                onClick={() => setPrivacy('public')}
              >
                <Globe className="h-4 w-4" />
                Public
              </Button>
              <Button
                type="button"
                variant={privacy === 'squad' ? "default" : "outline"}
                className="h-12 rounded-xl flex items-center gap-2"
                onClick={() => setPrivacy('squad')}
              >
                <Users className="h-4 w-4" />
                Squad
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-semibold text-foreground">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any specific details about your goal..."
              className="border-0 bg-muted/50 min-h-[80px] resize-none rounded-2xl px-6"
            />
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
              disabled={!title.trim() || !category || !endDate || (frequency === 'custom' && customDays.length === 0)}
            >
              Stake ₹{customWager || wagerAmount} & Commit!
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}