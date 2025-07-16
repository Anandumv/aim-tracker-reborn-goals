import { useState, useEffect } from 'react';

export interface Goal {
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

const STORAGE_KEY = 'aim_goals';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load goals from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const goalsWithDates = parsed.map((goal: any) => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          deadline: goal.deadline ? new Date(goal.deadline) : undefined,
          periodStartDate: goal.periodStartDate ? new Date(goal.periodStartDate) : new Date(),
          periodEndDate: goal.periodEndDate ? new Date(goal.periodEndDate) : new Date(),
          lastUpdated: goal.lastUpdated ? new Date(goal.lastUpdated) : new Date(),
          // Migrate old goals without period info
          period: goal.period || 'custom',
        }));
        setGoals(goalsWithDates);
      } catch (error) {
        console.error('Failed to parse stored goals:', error);
      }
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goalData: Omit<Goal, 'id' | 'currentValue' | 'completed' | 'createdAt' | 'lastUpdated'>) => {
    const now = new Date();
    const newGoal: Goal = {
      ...goalData,
      id: crypto.randomUUID(),
      currentValue: 0,
      completed: false,
      createdAt: now,
      lastUpdated: now,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalProgress = (goalId: string, newValue: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            currentValue: newValue, 
            completed: newValue >= goal.targetValue,
            lastUpdated: new Date()
          }
        : goal
    ));
  };

  const toggleGoalComplete = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: !goal.completed, lastUpdated: new Date() }
        : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  // Statistics
  const stats = {
    totalGoals: goals.length,
    completedGoals: goals.filter(goal => goal.completed || goal.currentValue >= goal.targetValue).length,
    activeGoals: goals.filter(goal => !goal.completed && goal.currentValue < goal.targetValue).length,
    averageProgress: goals.length > 0 
      ? Math.round(goals.reduce((acc, goal) => acc + (goal.currentValue / goal.targetValue) * 100, 0) / goals.length)
      : 0,
    todayUpdated: goals.filter(goal => {
      const today = new Date();
      const lastUpdate = new Date(goal.lastUpdated);
      return today.toDateString() === lastUpdate.toDateString();
    }).length,
  };

  return {
    goals,
    addGoal,
    updateGoalProgress,
    toggleGoalComplete,
    deleteGoal,
    stats,
  };
}