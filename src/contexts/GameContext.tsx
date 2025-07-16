import { useState, useEffect, createContext, useContext } from 'react';
import { User, Goal, Squad, CheckIn, UserAchievement } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface GameState {
  user: User | null;
  goals: Goal[];
  squads: Squad[];
  achievements: UserAchievement[];
  dailyCheckIns: CheckIn[];
  loading: boolean;
}

interface GameContextType extends GameState {
  // User actions
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  
  // Goal actions
  createGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'currentStreak' | 'totalCheckIns' | 'missedCheckIns' | 'totalBurned' | 'xpEarned'>) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  
  // Check-in actions
  performCheckIn: (goalId: string, success: boolean, notes?: string) => void;
  
  // Squad actions
  createSquad: (squad: Omit<Squad, 'id' | 'creatorId' | 'members' | 'totalPot' | 'weeklyPot' | 'createdAt'>) => void;
  joinSquad: (squadCode: string) => void;
  leaveSquad: (squadId: string) => void;
  
  // Stats
  getStats: () => {
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    currentStreak: number;
    weeklyXP: number;
    successRate: number;
  };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Database helper functions
const fetchUserProfile = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return {
    id: data.user_id,
    email: '', // Will be populated from auth
    username: data.username,
    avatar: data.avatar,
    timezone: data.timezone,
    xp: data.xp,
    coins: data.coins,
    level: data.level,
    totalStaked: data.total_staked,
    totalEarned: data.total_earned,
    currentStreak: data.current_streak,
    longestStreak: data.longest_streak,
    createdAt: new Date(data.created_at),
    lastActive: new Date(data.last_active)
  };
};


const fetchUserGoals = async (userId: string): Promise<Goal[]> => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching goals:', error);
    return [];
  }

  return data.map(goal => ({
    id: goal.id,
    userId: goal.user_id,
    title: goal.title,
    description: goal.description,
    category: goal.category,
    frequency: goal.frequency,
    customDays: goal.custom_days,
    startDate: new Date(goal.start_date),
    endDate: new Date(goal.end_date),
    wagerAmount: goal.wager_amount,
    currency: goal.currency,
    privacy: goal.privacy,
    squadId: goal.squad_id,
    status: goal.status,
    currentStreak: goal.current_streak,
    totalCheckIns: goal.total_check_ins,
    missedCheckIns: goal.missed_check_ins,
    totalBurned: goal.total_burned,
    xpEarned: goal.xp_earned,
    createdAt: new Date(goal.created_at),
    lastCheckIn: goal.last_check_in ? new Date(goal.last_check_in) : undefined
  }));
};

const fetchUserCheckIns = async (userId: string): Promise<CheckIn[]> => {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching check-ins:', error);
    return [];
  }

  return data.map(checkIn => ({
    id: checkIn.id,
    goalId: checkIn.goal_id,
    userId: checkIn.user_id,
    date: new Date(checkIn.date),
    success: checkIn.success,
    notes: checkIn.notes,
    xpEarned: checkIn.xp_earned,
    amountBurned: checkIn.amount_burned,
    createdAt: new Date(checkIn.created_at)
  }));
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<GameState>({
    user: null,
    goals: [],
    squads: [],
    achievements: [],
    dailyCheckIns: [],
    loading: true
  });

  // Load data from Supabase when user authenticates
  useEffect(() => {
    if (authLoading) return;
    
    if (authUser) {
      loadUserData(authUser.id, authUser.email || '');
    } else {
      // User is not authenticated, clear state
      setState({
        user: null,
        goals: [],
        squads: [],
        achievements: [],
        dailyCheckIns: [],
        loading: false
      });
    }
  }, [authUser, authLoading]);

  const loadUserData = async (userId: string, email: string) => {
    try {
      const [profile, goals, checkIns] = await Promise.all([
        fetchUserProfile(userId),
        fetchUserGoals(userId),
        fetchUserCheckIns(userId)
      ]);

      setState({
        user: profile ? { ...profile, email } : null,
        goals,
        squads: [], // TODO: Implement squad loading
        achievements: [], // TODO: Implement achievement loading
        dailyCheckIns: checkIns,
        loading: false
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!authUser || !state.user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          avatar: updates.avatar,
          timezone: updates.timezone,
          xp: updates.xp,
          coins: updates.coins,
          level: updates.level,
          total_staked: updates.totalStaked,
          total_earned: updates.totalEarned,
          current_streak: updates.currentStreak,
          longest_streak: updates.longestStreak,
          last_active: new Date().toISOString()
        })
        .eq('user_id', authUser.id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates, lastActive: new Date() } : null
      }));
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const addXP = (amount: number) => {
    setState(prev => {
      if (!prev.user) return prev;
      const newXP = prev.user.xp + amount;
      const newLevel = Math.floor(newXP / 250) + 1; // Level up every 250 XP
      
      return {
        ...prev,
        user: {
          ...prev.user,
          xp: newXP,
          level: newLevel,
          lastActive: new Date()
        }
      };
    });
  };

  const addCoins = (amount: number) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, coins: prev.user.coins + amount } : null
    }));
  };

  const createGoal = async (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'currentStreak' | 'totalCheckIns' | 'missedCheckIns' | 'totalBurned' | 'xpEarned'>) => {
    if (!authUser) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: authUser.id,
          title: goalData.title,
          description: goalData.description,
          category: goalData.category,
          frequency: goalData.frequency,
          custom_days: goalData.customDays,
          start_date: goalData.startDate.toISOString().split('T')[0],
          end_date: goalData.endDate.toISOString().split('T')[0],
          wager_amount: goalData.wagerAmount,
          currency: goalData.currency,
          privacy: goalData.privacy,
          squad_id: goalData.squadId,
          status: goalData.status
        })
        .select()
        .single();

      if (error) throw error;

      const newGoal: Goal = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description,
        category: data.category,
        frequency: data.frequency,
        customDays: data.custom_days,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        wagerAmount: data.wager_amount,
        currency: data.currency,
        privacy: data.privacy,
        squadId: data.squad_id,
        status: data.status,
        currentStreak: data.current_streak,
        totalCheckIns: data.total_check_ins,
        missedCheckIns: data.missed_check_ins,
        totalBurned: data.total_burned,
        xpEarned: data.xp_earned,
        createdAt: new Date(data.created_at),
        lastCheckIn: data.last_check_in ? new Date(data.last_check_in) : undefined
      };

      setState(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal]
      }));

      toast({
        title: "Goal created!",
        description: `${newGoal.title} has been added to your goals`,
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive"
      });
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    if (!authUser) return;

    try {
      const { error } = await supabase
        .from('goals')
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          frequency: updates.frequency,
          custom_days: updates.customDays,
          start_date: updates.startDate?.toISOString().split('T')[0],
          end_date: updates.endDate?.toISOString().split('T')[0],
          wager_amount: updates.wagerAmount,
          currency: updates.currency,
          privacy: updates.privacy,
          squad_id: updates.squadId,
          status: updates.status,
          current_streak: updates.currentStreak,
          total_check_ins: updates.totalCheckIns,
          missed_check_ins: updates.missedCheckIns,
          total_burned: updates.totalBurned,
          xp_earned: updates.xpEarned,
          last_check_in: updates.lastCheckIn?.toISOString()
        })
        .eq('id', goalId);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        goals: prev.goals.map(goal => 
          goal.id === goalId ? { ...goal, ...updates } : goal
        )
      }));
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive"
      });
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!authUser) return;

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        goals: prev.goals.filter(goal => goal.id !== goalId)
      }));

      toast({
        title: "Goal deleted",
        description: "Goal has been removed from your list"
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive"
      });
    }
  };

  const performCheckIn = async (goalId: string, success: boolean, notes?: string) => {
    if (!authUser) return;
    
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal) return;

    const today = new Date();
    const xpEarned = success ? 25 : 0;
    
    try {
      // Create check-in record
      const { error: checkInError } = await supabase
        .from('check_ins')
        .insert({
          goal_id: goalId,
          user_id: authUser.id,
          date: today.toISOString().split('T')[0],
          success,
          notes,
          xp_earned: xpEarned,
          amount_burned: 0
        });

      if (checkInError) throw checkInError;

      // Update goal stats
      const updatedGoal: Partial<Goal> = {
        lastCheckIn: today,
        totalCheckIns: goal.totalCheckIns + 1,
        currentStreak: success ? goal.currentStreak + 1 : 0,
        missedCheckIns: success ? goal.missedCheckIns : goal.missedCheckIns + 1,
        totalBurned: goal.totalBurned,
        xpEarned: goal.xpEarned + xpEarned
      };

      await updateGoal(goalId, updatedGoal);

      // Create local check-in record for immediate UI update
      const checkIn: CheckIn = {
        id: crypto.randomUUID(),
        goalId,
        userId: authUser.id,
        date: today,
        success,
        notes,
        xpEarned,
        amountBurned: 0,
        createdAt: new Date()
      };

      setState(prev => ({
        ...prev,
        dailyCheckIns: [...prev.dailyCheckIns, checkIn]
      }));

      // Add XP and update user streak
      if (success) {
        addXP(xpEarned);
        updateUser({ 
          currentStreak: Math.max(state.user?.currentStreak || 0, goal.currentStreak + 1),
          longestStreak: Math.max(state.user?.longestStreak || 0, goal.currentStreak + 1)
        });
      } else {
        updateUser({ currentStreak: 0 });
      }
    } catch (error) {
      console.error('Error performing check-in:', error);
      toast({
        title: "Error",
        description: "Failed to record check-in",
        variant: "destructive"
      });
    }
  };

  const createSquad = (squadData: Omit<Squad, 'id' | 'creatorId' | 'members' | 'totalPot' | 'weeklyPot' | 'createdAt'>) => {
    const newSquad: Squad = {
      ...squadData,
      id: crypto.randomUUID(),
      creatorId: state.user?.id || 'user_1',
      members: [{
        id: crypto.randomUUID(),
        userId: state.user?.id || 'user_1',
        squadId: '',
        role: 'creator',
        joinedAt: new Date(),
        weeklyXP: 0,
        weeklyCheckIns: 0,
        status: 'active'
      }],
      totalPot: 0,
      weeklyPot: 0,
      createdAt: new Date()
    };

    newSquad.members[0].squadId = newSquad.id;

    setState(prev => ({
      ...prev,
      squads: [...prev.squads, newSquad]
    }));
  };

  const joinSquad = (squadCode: string) => {
    // Mock implementation - would normally make API call
    console.log('Joining squad with code:', squadCode);
  };

  const leaveSquad = (squadId: string) => {
    setState(prev => ({
      ...prev,
      squads: prev.squads.filter(squad => squad.id !== squadId)
    }));
  };

  const getStats = () => {
    const activeGoals = state.goals.filter(g => g.status === 'active').length;
    const completedGoals = state.goals.filter(g => g.status === 'completed').length;
    const totalCheckIns = state.goals.reduce((sum, g) => sum + g.totalCheckIns, 0);
    const totalMissed = state.goals.reduce((sum, g) => sum + g.missedCheckIns, 0);
    const successRate = totalCheckIns > 0 ? Math.round((totalCheckIns / (totalCheckIns + totalMissed)) * 100) : 0;
    
    // Calculate weekly XP (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyXP = state.dailyCheckIns
      .filter(c => c.date >= weekAgo && c.success)
      .reduce((sum, c) => sum + c.xpEarned, 0);

    return {
      totalGoals: state.goals.length,
      activeGoals,
      completedGoals,
      currentStreak: state.user?.currentStreak || 0,
      weeklyXP,
      successRate
    };
  };

  const value: GameContextType = {
    ...state,
    updateUser,
    addXP,
    addCoins,
    createGoal,
    updateGoal,
    deleteGoal,
    performCheckIn,
    createSquad,
    joinSquad,
    leaveSquad,
    getStats
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}