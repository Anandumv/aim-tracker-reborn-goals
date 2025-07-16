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
  completed: boolean;
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

  const addGoal = (goalData: Omit<Goal, 'id' | 'currentValue' | 'completed' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: crypto.randomUUID(),
      currentValue: 0,
      completed: false,
      createdAt: new Date(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalProgress = (goalId: string, newValue: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentValue: newValue, completed: newValue >= goal.targetValue }
        : goal
    ));
  };

  const toggleGoalComplete = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: !goal.completed }
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