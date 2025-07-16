import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

interface CreateSquadDialogProps {
  children: React.ReactNode;
}

export function CreateSquadDialog({ children }: CreateSquadDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
    maxMembers: 10
  });

  const { createSquad } = useGame();

  const handleCreateSquad = async () => {
    if (!formData.name.trim()) return;
    
    setIsLoading(true);
    try {
      await createSquad({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        isPublic: formData.isPublic,
        maxMembers: formData.maxMembers,
        code: generateSquadCode()
      });
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        isPublic: false,
        maxMembers: 10
      });
    } catch (error) {
      console.error("Error creating squad:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSquadCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Squad
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="squad-name">Squad Name</Label>
            <Input
              id="squad-name"
              placeholder="Enter squad name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="squad-description">Description (Optional)</Label>
            <Textarea
              id="squad-description"
              placeholder="Describe your squad's purpose..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-members">Max Members</Label>
            <Input
              id="max-members"
              type="number"
              min="2"
              max="50"
              value={formData.maxMembers}
              onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 10 }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is-public">Public Squad</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to find and join your squad
              </p>
            </div>
            <Switch
              id="is-public"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
            />
          </div>

          <Button 
            onClick={handleCreateSquad} 
            disabled={!formData.name.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? "Creating..." : "Create Squad"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}