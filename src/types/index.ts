export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  timezone: string;
  xp: number;
  coins: number;
  level: number;
  totalStaked: number;
  totalEarned: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: Date;
  lastActive: Date;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'custom';
  customDays?: string[]; // ['mon', 'tue', 'wed']
  startDate: Date;
  endDate: Date;
  wagerAmount: number;
  currency: string;
  privacy: 'solo' | 'public' | 'squad';
  squadId?: string;
  status: 'active' | 'completed' | 'failed' | 'paused';
  currentStreak: number;
  totalCheckIns: number;
  missedCheckIns: number;
  totalBurned: number;
  xpEarned: number;
  createdAt: Date;
  lastCheckIn?: Date;
}

export interface Squad {
  id: string;
  name: string;
  description?: string;
  code: string; // Invite code
  creatorId: string;
  members: SquadMember[];
  goalId?: string; // If squad is goal-specific
  totalPot: number;
  weeklyPot: number;
  maxMembers: number;
  isPublic: boolean;
  createdAt: Date;
}

export interface SquadMember {
  id: string;
  userId: string;
  squadId: string;
  role: 'creator' | 'member';
  joinedAt: Date;
  weeklyXP: number;
  weeklyCheckIns: number;
  status: 'active' | 'inactive';
}

export interface CheckIn {
  id: string;
  goalId: string;
  userId: string;
  date: Date;
  success: boolean;
  notes?: string;
  xpEarned: number;
  amountBurned: number;
  squadReactions?: SquadReaction[];
  createdAt: Date;
}

export interface SquadReaction {
  id: string;
  checkInId: string;
  userId: string;
  type: 'fire' | 'clap' | 'support' | 'roast';
  message?: string;
  createdAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  totalDeposited: number;
  totalWithdrawn: number;
  totalBurned: number;
  totalEarned: number;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'burn' | 'earn' | 'pot_win';
  amount: number;
  currency: string;
  goalId?: string;
  squadId?: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  paymentId?: string; // Stripe/Razorpay ID
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  coinReward: number;
  condition: {
    type: 'streak' | 'total_checkins' | 'total_xp' | 'squad_wins' | 'goals_completed';
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  goalId?: string;
  squadId?: string;
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  squadId?: string;
  entries: LeaderboardEntry[];
  potAmount?: number;
  winners?: string[]; // User IDs
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  xp: number;
  streak: number;
  checkIns: number;
  rank: number;
  change: number; // Position change from last period
}