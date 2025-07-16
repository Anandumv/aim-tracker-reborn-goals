import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LeaderboardEntry } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardDialogProps {
  children: React.ReactNode;
}

export function LeaderboardDialog({ children }: LeaderboardDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("weekly");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchLeaderboard(activeTab);
    }
  }, [open, activeTab]);

  const fetchLeaderboard = async (period: string) => {
    setLoading(true);
    try {
      // For now, fetch all profiles and sort by XP
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(50);

      if (error) throw error;

      const entries: LeaderboardEntry[] = data.map((profile, index) => ({
        userId: profile.user_id,
        username: profile.username,
        avatar: profile.avatar,
        xp: profile.xp,
        streak: profile.current_streak,
        checkIns: 0, // Would need to calculate from check_ins table
        rank: index + 1,
        change: 0 // Would need historical data
      }));

      setLeaderboard(entries);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-semibold">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboard
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all_time">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading leaderboard...</p>
              </div>
            ) : leaderboard.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {leaderboard.map((entry, index) => (
                  <Card key={entry.userId} className={`transition-all ${index < 3 ? 'ring-2 ring-primary/20' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8">
                            {getRankIcon(entry.rank)}
                          </div>
                          
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {entry.avatar || entry.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">{entry.username}</span>
                              {entry.rank <= 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  {entry.rank === 1 ? 'Champion' : entry.rank === 2 ? 'Runner-up' : 'Bronze'}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                {entry.xp} XP
                              </span>
                              <span>🔥 {entry.streak} day streak</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getChangeIcon(entry.change)}
                          {entry.change !== 0 && (
                            <span className="text-sm text-muted-foreground">
                              {Math.abs(entry.change)}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No leaderboard data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}