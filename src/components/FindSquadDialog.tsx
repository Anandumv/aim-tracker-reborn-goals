import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, User } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { Squad } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface FindSquadDialogProps {
  children: React.ReactNode;
}

export function FindSquadDialog({ children }: FindSquadDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [publicSquads, setPublicSquads] = useState<Squad[]>([]);
  const [loading, setLoading] = useState(false);
  const { joinSquad } = useGame();

  useEffect(() => {
    if (open) {
      fetchPublicSquads();
    }
  }, [open]);

  const fetchPublicSquads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('squads')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const squads: Squad[] = data.map(squad => ({
        id: squad.id,
        name: squad.name,
        description: squad.description,
        code: squad.code,
        creatorId: squad.creator_id,
        members: [], // Will be populated when needed
        goalId: squad.goal_id,
        totalPot: squad.total_pot,
        weeklyPot: squad.weekly_pot,
        maxMembers: squad.max_members,
        isPublic: squad.is_public,
        createdAt: new Date(squad.created_at)
      }));

      setPublicSquads(squads);
    } catch (error) {
      console.error("Error fetching public squads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSquad = async (squadCode: string) => {
    try {
      await joinSquad(squadCode);
      setOpen(false);
    } catch (error) {
      console.error("Error joining squad:", error);
    }
  };

  const filteredSquads = publicSquads.filter(squad =>
    squad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    squad.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Squad
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search squads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading squads...</p>
            </div>
          ) : filteredSquads.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSquads.map((squad) => (
                <Card key={squad.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{squad.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {squad.code}
                          </Badge>
                        </div>
                        {squad.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {squad.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>0/{squad.maxMembers}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>Public</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleJoinSquad(squad.code)}
                        className="ml-4"
                      >
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No squads found matching your search" : "No public squads available"}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}