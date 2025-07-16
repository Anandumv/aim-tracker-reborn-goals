import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

interface JoinSquadDialogProps {
  children: React.ReactNode;
}

export function JoinSquadDialog({ children }: JoinSquadDialogProps) {
  const [open, setOpen] = useState(false);
  const [squadCode, setSquadCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { joinSquad } = useGame();

  const handleJoinSquad = async () => {
    if (!squadCode.trim()) return;
    
    setIsLoading(true);
    try {
      await joinSquad(squadCode.trim());
      setOpen(false);
      setSquadCode("");
    } catch (error) {
      console.error("Error joining squad:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Join Squad
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="squad-code">Squad Code</Label>
            <Input
              id="squad-code"
              placeholder="Enter squad code (e.g., SQUAD123)"
              value={squadCode}
              onChange={(e) => setSquadCode(e.target.value.toUpperCase())}
              className="uppercase"
            />
          </div>
          <Button 
            onClick={handleJoinSquad} 
            disabled={!squadCode.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? "Joining..." : "Join Squad"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}