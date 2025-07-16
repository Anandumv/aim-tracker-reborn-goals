import { useState, useEffect, createContext, useContext } from 'react';
import { User, Goal, Squad, CheckIn, Wallet, UserAchievement } from '@/types';

interface GameState {
  user: User | null;
  goals: Goal[];
  squads: Squad[];
  wallet: Wallet | null;
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
  
  // Wallet actions
  updateWallet: (updates: Partial<Wallet>) => void;
  
  // Stats
  getStats: () => {
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    currentStreak: number;
    weeklyXP: number;
    totalEarned: number;
    successRate: number;
  };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'commit_user',
  GOALS: 'commit_goals',
  SQUADS: 'commit_squads',
  WALLET: 'commit_wallet',
  ACHIEVEMENTS: 'commit_achievements',
  CHECKINS: 'commit_checkins'
};

// Mock user for demo
const createMockUser = (): User => ({
  id: 'user_1',
  email: 'demo@commit.app',
  username: 'demo_user',
  avatar: '🎯',
  timezone: 'Asia/Kolkata',
  xp: 1250,
  coins: 450,
  level: 5,
  totalStaked: 2500,
  totalEarned: 750,
  currentStreak: 7,
  longestStreak: 15,
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  lastActive: new Date()
});

const createMockWallet = (): Wallet => ({
  id: 'wallet_1',
  userId: 'user_1',
  balance: 1500,
  currency: '₹',
  totalDeposited: 5000,
  totalWithdrawn: 750,
  totalBurned: 850,
  totalEarned: 750,
  updatedAt: new Date()
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    user: null,
    goals: [],
    squads: [],
    wallet: null,
    achievements: [],
    dailyCheckIns: [],
    loading: true
  });

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
        const storedSquads = localStorage.getItem(STORAGE_KEYS.SQUADS);
        const storedWallet = localStorage.getItem(STORAGE_KEYS.WALLET);
        const storedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
        const storedCheckIns = localStorage.getItem(STORAGE_KEYS.CHECKINS);

        setState({
          user: storedUser ? JSON.parse(storedUser) : createMockUser(),
          goals: storedGoals ? JSON.parse(storedGoals).map((g: any) => ({
            ...g,
            startDate: new Date(g.startDate),
            endDate: new Date(g.endDate),
            createdAt: new Date(g.createdAt),
            lastCheckIn: g.lastCheckIn ? new Date(g.lastCheckIn) : undefined
          })) : [],
          squads: storedSquads ? JSON.parse(storedSquads) : [],
          wallet: storedWallet ? JSON.parse(storedWallet) : createMockWallet(),
          achievements: storedAchievements ? JSON.parse(storedAchievements) : [],
          dailyCheckIns: storedCheckIns ? JSON.parse(storedCheckIns).map((c: any) => ({
            ...c,
            date: new Date(c.date),
            createdAt: new Date(c.createdAt)
          })) : [],
          loading: false
        });
      } catch (error) {
        console.error('Failed to load data:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!state.loading) {
      if (state.user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(state.goals));
      localStorage.setItem(STORAGE_KEYS.SQUADS, JSON.stringify(state.squads));
      if (state.wallet) localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(state.wallet));
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(state.achievements));
      localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(state.dailyCheckIns));
    }
  }, [state]);

  const updateUser = (updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates, lastActive: new Date() } : null
    }));
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

  const createGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'currentStreak' | 'totalCheckIns' | 'missedCheckIns' | 'totalBurned' | 'xpEarned'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: crypto.randomUUID(),
      userId: state.user?.id || 'user_1',
      currentStreak: 0,
      totalCheckIns: 0,
      missedCheckIns: 0,
      totalBurned: 0,
      xpEarned: 0,
      createdAt: new Date()
    };

    setState(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    }));
  };

  const deleteGoal = (goalId: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId)
    }));
  };

  const performCheckIn = (goalId: string, success: boolean, notes?: string) => {
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal) return;

    const today = new Date();
    const xpEarned = success ? 25 : 0;
    const amountBurned = success ? 0 : goal.wagerAmount;
    
    // Create check-in record
    const checkIn: CheckIn = {
      id: crypto.randomUUID(),
      goalId,
      userId: state.user?.id || 'user_1',
      date: today,
      success,
      notes,
      xpEarned,
      amountBurned,
      createdAt: new Date()
    };

    // Update goal stats
    const updatedGoal: Partial<Goal> = {
      lastCheckIn: today,
      totalCheckIns: goal.totalCheckIns + 1,
      currentStreak: success ? goal.currentStreak + 1 : 0,
      missedCheckIns: success ? goal.missedCheckIns : goal.missedCheckIns + 1,
      totalBurned: goal.totalBurned + amountBurned,
      xpEarned: goal.xpEarned + xpEarned
    };

    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === goalId ? { ...g, ...updatedGoal } : g),
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
      // Update wallet (burn money)
      if (state.wallet) {
        updateWallet({
          balance: state.wallet.balance - amountBurned,
          totalBurned: state.wallet.totalBurned + amountBurned
        });
      }
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

  const updateWallet = (updates: Partial<Wallet>) => {
    setState(prev => ({
      ...prev,
      wallet: prev.wallet ? { ...prev.wallet, ...updates, updatedAt: new Date() } : null
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
      totalEarned: state.wallet?.totalEarned || 0,
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
    updateWallet,
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