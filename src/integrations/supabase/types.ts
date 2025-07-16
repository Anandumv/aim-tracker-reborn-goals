export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          coin_reward: number
          condition_type: Database["public"]["Enums"]["achievement_condition_type"]
          condition_value: number
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          rarity: Database["public"]["Enums"]["achievement_rarity"]
          xp_reward: number
        }
        Insert: {
          coin_reward?: number
          condition_type: Database["public"]["Enums"]["achievement_condition_type"]
          condition_value: number
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          rarity?: Database["public"]["Enums"]["achievement_rarity"]
          xp_reward?: number
        }
        Update: {
          coin_reward?: number
          condition_type?: Database["public"]["Enums"]["achievement_condition_type"]
          condition_value?: number
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          rarity?: Database["public"]["Enums"]["achievement_rarity"]
          xp_reward?: number
        }
        Relationships: []
      }
      check_ins: {
        Row: {
          amount_burned: number
          created_at: string
          date: string
          goal_id: string
          id: string
          notes: string | null
          success: boolean
          updated_at: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          amount_burned?: number
          created_at?: string
          date: string
          goal_id: string
          id?: string
          notes?: string | null
          success: boolean
          updated_at?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          amount_burned?: number
          created_at?: string
          date?: string
          goal_id?: string
          id?: string
          notes?: string | null
          success?: boolean
          updated_at?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string
          created_at: string
          currency: string
          current_streak: number
          custom_days: string[] | null
          description: string | null
          end_date: string
          frequency: Database["public"]["Enums"]["goal_frequency"]
          id: string
          last_check_in: string | null
          missed_check_ins: number
          privacy: Database["public"]["Enums"]["goal_privacy"]
          squad_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["goal_status"]
          title: string
          total_burned: number
          total_check_ins: number
          updated_at: string
          user_id: string
          wager_amount: number
          xp_earned: number
        }
        Insert: {
          category: string
          created_at?: string
          currency?: string
          current_streak?: number
          custom_days?: string[] | null
          description?: string | null
          end_date: string
          frequency?: Database["public"]["Enums"]["goal_frequency"]
          id?: string
          last_check_in?: string | null
          missed_check_ins?: number
          privacy?: Database["public"]["Enums"]["goal_privacy"]
          squad_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["goal_status"]
          title: string
          total_burned?: number
          total_check_ins?: number
          updated_at?: string
          user_id: string
          wager_amount: number
          xp_earned?: number
        }
        Update: {
          category?: string
          created_at?: string
          currency?: string
          current_streak?: number
          custom_days?: string[] | null
          description?: string | null
          end_date?: string
          frequency?: Database["public"]["Enums"]["goal_frequency"]
          id?: string
          last_check_in?: string | null
          missed_check_ins?: number
          privacy?: Database["public"]["Enums"]["goal_privacy"]
          squad_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["goal_status"]
          title?: string
          total_burned?: number
          total_check_ins?: number
          updated_at?: string
          user_id?: string
          wager_amount?: number
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "goals_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          coins: number
          created_at: string
          current_streak: number
          id: string
          last_active: string
          level: number
          longest_streak: number
          role: Database["public"]["Enums"]["app_role"]
          timezone: string
          total_earned: number
          total_staked: number
          updated_at: string
          user_id: string
          username: string
          xp: number
        }
        Insert: {
          avatar?: string | null
          coins?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_active?: string
          level?: number
          longest_streak?: number
          role?: Database["public"]["Enums"]["app_role"]
          timezone?: string
          total_earned?: number
          total_staked?: number
          updated_at?: string
          user_id: string
          username: string
          xp?: number
        }
        Update: {
          avatar?: string | null
          coins?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_active?: string
          level?: number
          longest_streak?: number
          role?: Database["public"]["Enums"]["app_role"]
          timezone?: string
          total_earned?: number
          total_staked?: number
          updated_at?: string
          user_id?: string
          username?: string
          xp?: number
        }
        Relationships: []
      }
      squad_members: {
        Row: {
          created_at: string
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["squad_role"]
          squad_id: string
          status: Database["public"]["Enums"]["member_status"]
          updated_at: string
          user_id: string
          weekly_check_ins: number
          weekly_xp: number
        }
        Insert: {
          created_at?: string
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["squad_role"]
          squad_id: string
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
          user_id: string
          weekly_check_ins?: number
          weekly_xp?: number
        }
        Update: {
          created_at?: string
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["squad_role"]
          squad_id?: string
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
          user_id?: string
          weekly_check_ins?: number
          weekly_xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "squad_members_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      squad_reactions: {
        Row: {
          check_in_id: string
          created_at: string
          id: string
          message: string | null
          type: Database["public"]["Enums"]["reaction_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          check_in_id: string
          created_at?: string
          id?: string
          message?: string | null
          type: Database["public"]["Enums"]["reaction_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          check_in_id?: string
          created_at?: string
          id?: string
          message?: string | null
          type?: Database["public"]["Enums"]["reaction_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "squad_reactions_check_in_id_fkey"
            columns: ["check_in_id"]
            isOneToOne: false
            referencedRelation: "check_ins"
            referencedColumns: ["id"]
          },
        ]
      }
      squads: {
        Row: {
          code: string
          created_at: string
          creator_id: string
          description: string | null
          goal_id: string | null
          id: string
          is_public: boolean
          max_members: number
          name: string
          total_pot: number
          updated_at: string
          weekly_pot: number
        }
        Insert: {
          code: string
          created_at?: string
          creator_id: string
          description?: string | null
          goal_id?: string | null
          id?: string
          is_public?: boolean
          max_members?: number
          name: string
          total_pot?: number
          updated_at?: string
          weekly_pot?: number
        }
        Update: {
          code?: string
          created_at?: string
          creator_id?: string
          description?: string | null
          goal_id?: string | null
          id?: string
          is_public?: boolean
          max_members?: number
          name?: string
          total_pot?: number
          updated_at?: string
          weekly_pot?: number
        }
        Relationships: [
          {
            foreignKeyName: "squads_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string
          goal_id: string | null
          id: string
          payment_id: string | null
          squad_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description: string
          goal_id?: string | null
          id?: string
          payment_id?: string | null
          squad_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string
          goal_id?: string | null
          id?: string
          payment_id?: string | null
          squad_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string
          goal_id: string | null
          id: string
          squad_id: string | null
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          goal_id?: string | null
          id?: string
          squad_id?: string | null
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          goal_id?: string | null
          id?: string
          squad_id?: string | null
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          total_burned: number
          total_deposited: number
          total_earned: number
          total_withdrawn: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          total_burned?: number
          total_deposited?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          total_burned?: number
          total_deposited?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      achievement_condition_type:
        | "streak"
        | "total_checkins"
        | "total_xp"
        | "squad_wins"
        | "goals_completed"
      achievement_rarity: "common" | "rare" | "epic" | "legendary"
      app_role: "admin" | "user"
      goal_frequency: "daily" | "weekly" | "custom"
      goal_privacy: "solo" | "public" | "squad"
      goal_status: "active" | "completed" | "failed" | "paused"
      leaderboard_period: "daily" | "weekly" | "monthly" | "all_time"
      member_status: "active" | "inactive"
      reaction_type: "fire" | "clap" | "support" | "roast"
      squad_role: "creator" | "member"
      transaction_status: "pending" | "completed" | "failed"
      transaction_type: "deposit" | "withdraw" | "burn" | "earn" | "pot_win"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_condition_type: [
        "streak",
        "total_checkins",
        "total_xp",
        "squad_wins",
        "goals_completed",
      ],
      achievement_rarity: ["common", "rare", "epic", "legendary"],
      app_role: ["admin", "user"],
      goal_frequency: ["daily", "weekly", "custom"],
      goal_privacy: ["solo", "public", "squad"],
      goal_status: ["active", "completed", "failed", "paused"],
      leaderboard_period: ["daily", "weekly", "monthly", "all_time"],
      member_status: ["active", "inactive"],
      reaction_type: ["fire", "clap", "support", "roast"],
      squad_role: ["creator", "member"],
      transaction_status: ["pending", "completed", "failed"],
      transaction_type: ["deposit", "withdraw", "burn", "earn", "pot_win"],
    },
  },
} as const
