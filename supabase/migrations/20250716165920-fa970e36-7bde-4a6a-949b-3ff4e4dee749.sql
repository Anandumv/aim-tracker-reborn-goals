-- Create custom types
CREATE TYPE app_role AS ENUM ('admin', 'user');
CREATE TYPE goal_frequency AS ENUM ('daily', 'weekly', 'custom');
CREATE TYPE goal_status AS ENUM ('active', 'completed', 'failed', 'paused');
CREATE TYPE goal_privacy AS ENUM ('solo', 'public', 'squad');
CREATE TYPE squad_role AS ENUM ('creator', 'member');
CREATE TYPE member_status AS ENUM ('active', 'inactive');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdraw', 'burn', 'earn', 'pot_win');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE achievement_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE achievement_condition_type AS ENUM ('streak', 'total_checkins', 'total_xp', 'squad_wins', 'goals_completed');
CREATE TYPE reaction_type AS ENUM ('fire', 'clap', 'support', 'roast');
CREATE TYPE leaderboard_period AS ENUM ('daily', 'weekly', 'monthly', 'all_time');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    avatar TEXT,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    xp INTEGER NOT NULL DEFAULT 0,
    coins INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    total_staked INTEGER NOT NULL DEFAULT 0,
    total_earned INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_active TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wallets table
CREATE TABLE public.wallets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    balance INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT '₹',
    total_deposited INTEGER NOT NULL DEFAULT 0,
    total_withdrawn INTEGER NOT NULL DEFAULT 0,
    total_burned INTEGER NOT NULL DEFAULT 0,
    total_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goals table
CREATE TABLE public.goals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    frequency goal_frequency NOT NULL DEFAULT 'daily',
    custom_days TEXT[],
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    wager_amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT '₹',
    privacy goal_privacy NOT NULL DEFAULT 'solo',
    squad_id UUID,
    status goal_status NOT NULL DEFAULT 'active',
    current_streak INTEGER NOT NULL DEFAULT 0,
    total_check_ins INTEGER NOT NULL DEFAULT 0,
    missed_check_ins INTEGER NOT NULL DEFAULT 0,
    total_burned INTEGER NOT NULL DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    last_check_in TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create squads table
CREATE TABLE public.squads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    code TEXT NOT NULL UNIQUE,
    creator_id UUID NOT NULL,
    goal_id UUID,
    total_pot INTEGER NOT NULL DEFAULT 0,
    weekly_pot INTEGER NOT NULL DEFAULT 0,
    max_members INTEGER NOT NULL DEFAULT 10,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create squad_members table
CREATE TABLE public.squad_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    squad_id UUID NOT NULL,
    role squad_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    weekly_xp INTEGER NOT NULL DEFAULT 0,
    weekly_check_ins INTEGER NOT NULL DEFAULT 0,
    status member_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, squad_id)
);

-- Create check_ins table
CREATE TABLE public.check_ins (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID NOT NULL,
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    success BOOLEAN NOT NULL,
    notes TEXT,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    amount_burned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    type transaction_type NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT '₹',
    goal_id UUID,
    squad_id UUID,
    description TEXT NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 0,
    coin_reward INTEGER NOT NULL DEFAULT 0,
    condition_type achievement_condition_type NOT NULL,
    condition_value INTEGER NOT NULL,
    rarity achievement_rarity NOT NULL DEFAULT 'common',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL,
    goal_id UUID,
    squad_id UUID,
    unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

-- Create squad_reactions table
CREATE TABLE public.squad_reactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    check_in_id UUID NOT NULL,
    user_id UUID NOT NULL,
    type reaction_type NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(check_in_id, user_id)
);

-- Add foreign key constraints
ALTER TABLE public.goals ADD FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.goals ADD FOREIGN KEY (squad_id) REFERENCES public.squads(id) ON DELETE SET NULL;
ALTER TABLE public.wallets ADD FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.squads ADD FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.squads ADD FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE SET NULL;
ALTER TABLE public.squad_members ADD FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.squad_members ADD FOREIGN KEY (squad_id) REFERENCES public.squads(id) ON DELETE CASCADE;
ALTER TABLE public.check_ins ADD FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE CASCADE;
ALTER TABLE public.check_ins ADD FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.transactions ADD FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.transactions ADD FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE SET NULL;
ALTER TABLE public.transactions ADD FOREIGN KEY (squad_id) REFERENCES public.squads(id) ON DELETE SET NULL;
ALTER TABLE public.user_achievements ADD FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_achievements ADD FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE;
ALTER TABLE public.user_achievements ADD FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE SET NULL;
ALTER TABLE public.user_achievements ADD FOREIGN KEY (squad_id) REFERENCES public.squads(id) ON DELETE SET NULL;
ALTER TABLE public.squad_reactions ADD FOREIGN KEY (check_in_id) REFERENCES public.check_ins(id) ON DELETE CASCADE;
ALTER TABLE public.squad_reactions ADD FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_reactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for wallets
CREATE POLICY "Users can view their own wallet" ON public.wallets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" ON public.wallets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallet" ON public.wallets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for goals
CREATE POLICY "Users can view their own goals" ON public.goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public goals" ON public.goals
    FOR SELECT USING (privacy = 'public');

CREATE POLICY "Users can insert their own goals" ON public.goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON public.goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON public.goals
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for squads
CREATE POLICY "Users can view squads they're members of" ON public.squads
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.squad_members 
            WHERE squad_id = public.squads.id
        ) OR is_public = true
    );

CREATE POLICY "Users can create squads" ON public.squads
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Squad creators can update their squads" ON public.squads
    FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Squad creators can delete their squads" ON public.squads
    FOR DELETE USING (auth.uid() = creator_id);

-- Create RLS policies for squad_members
CREATE POLICY "Users can view squad members of their squads" ON public.squad_members
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() IN (
            SELECT user_id FROM public.squad_members sm2 
            WHERE sm2.squad_id = public.squad_members.squad_id
        )
    );

CREATE POLICY "Users can join squads" ON public.squad_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave squads" ON public.squad_members
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for check_ins
CREATE POLICY "Users can view their own check-ins" ON public.check_ins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own check-ins" ON public.check_ins
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins" ON public.check_ins
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for achievements
CREATE POLICY "Anyone can view achievements" ON public.achievements
    FOR SELECT USING (true);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for squad_reactions
CREATE POLICY "Users can view reactions in their squads" ON public.squad_reactions
    FOR SELECT USING (
        auth.uid() IN (
            SELECT sm.user_id FROM public.squad_members sm
            JOIN public.check_ins ci ON ci.goal_id IN (
                SELECT g.id FROM public.goals g WHERE g.squad_id = sm.squad_id
            )
            WHERE ci.id = public.squad_reactions.check_in_id
        )
    );

CREATE POLICY "Users can insert their own reactions" ON public.squad_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, username, avatar, timezone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar', '🎯'),
        COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
    );
    
    INSERT INTO public.wallets (user_id, balance, currency)
    VALUES (NEW.id, 1500, '₹');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at
    BEFORE UPDATE ON public.wallets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_squads_updated_at
    BEFORE UPDATE ON public.squads
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_squad_members_updated_at
    BEFORE UPDATE ON public.squad_members
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_check_ins_updated_at
    BEFORE UPDATE ON public.check_ins
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_squad_reactions_updated_at
    BEFORE UPDATE ON public.squad_reactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_status ON public.goals(status);
CREATE INDEX idx_goals_squad_id ON public.goals(squad_id);
CREATE INDEX idx_check_ins_goal_id ON public.check_ins(goal_id);
CREATE INDEX idx_check_ins_user_id ON public.check_ins(user_id);
CREATE INDEX idx_check_ins_date ON public.check_ins(date);
CREATE INDEX idx_squad_members_user_id ON public.squad_members(user_id);
CREATE INDEX idx_squad_members_squad_id ON public.squad_members(squad_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);

-- Insert some sample achievements
INSERT INTO public.achievements (name, description, icon, xp_reward, coin_reward, condition_type, condition_value, rarity) VALUES
('First Steps', 'Complete your first check-in', '🎯', 50, 10, 'total_checkins', 1, 'common'),
('Streak Starter', 'Maintain a 3-day streak', '🔥', 100, 25, 'streak', 3, 'common'),
('Week Warrior', 'Maintain a 7-day streak', '⚡', 200, 50, 'streak', 7, 'rare'),
('Monthly Master', 'Maintain a 30-day streak', '👑', 500, 100, 'streak', 30, 'epic'),
('Legendary Commitment', 'Maintain a 100-day streak', '🏆', 1000, 250, 'streak', 100, 'legendary'),
('Goal Getter', 'Complete 10 check-ins', '📈', 250, 50, 'total_checkins', 10, 'common'),
('Persistent Player', 'Complete 50 check-ins', '💪', 500, 100, 'total_checkins', 50, 'rare'),
('XP Hunter', 'Earn 1000 XP', '⭐', 200, 50, 'total_xp', 1000, 'rare'),
('XP Master', 'Earn 5000 XP', '🌟', 500, 100, 'total_xp', 5000, 'epic');