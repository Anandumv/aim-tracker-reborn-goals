export function calculatePeriodDates(period: string, customEnd?: Date): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now);
  let end = new Date(now);

  switch (period) {
    case 'daily':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    
    case 'weekly':
      const dayOfWeek = now.getDay();
      start.setDate(now.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    
    case 'monthly':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;
    
    case 'quarterly':
      const quarter = Math.floor(now.getMonth() / 3);
      start.setMonth(quarter * 3, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(quarter * 3 + 3, 0);
      end.setHours(23, 59, 59, 999);
      break;
    
    case 'yearly':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    
    case 'custom':
      if (customEnd) {
        end = new Date(customEnd);
        end.setHours(23, 59, 59, 999);
      }
      break;
      
    default:
      // Default to current month
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
  }

  return { start, end };
}

export function getTimeRemaining(endDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  total: number;
  percentage: number;
  startDate: Date;
} {
  const now = new Date();
  const total = endDate.getTime() - now.getTime();
  
  if (total <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      total: 0,
      percentage: 100,
      startDate: endDate,
    };
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));

  // Calculate percentage of time elapsed (for progress visualization)
  const startOfPeriod = new Date(endDate);
  startOfPeriod.setFullYear(startOfPeriod.getFullYear() - 1); // Rough estimate
  const totalPeriod = endDate.getTime() - startOfPeriod.getTime();
  const elapsed = now.getTime() - startOfPeriod.getTime();
  const percentage = Math.min(100, Math.max(0, (elapsed / totalPeriod) * 100));

  return {
    days,
    hours,
    minutes,
    total,
    percentage,
    startDate: startOfPeriod,
  };
}

export function formatTimeRemaining(timeRemaining: ReturnType<typeof getTimeRemaining>): string {
  const { days, hours } = timeRemaining;
  
  if (days > 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months === 1 ? '' : 's'} remaining`;
  }
  
  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} remaining`;
  }
  
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} remaining`;
  }
  
  return 'Less than an hour remaining';
}