export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      investment_accounts: {
        Row: {
          account_number: string
          account_type: string
          balance: number
          created_at: string
          created_by: string
          gold_holdings: number
          id: string
          notes: string | null
          platinum_holdings: number
          silver_holdings: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number: string
          account_type?: string
          balance?: number
          created_at?: string
          created_by: string
          gold_holdings?: number
          id?: string
          notes?: string | null
          platinum_holdings?: number
          silver_holdings?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string
          account_type?: string
          balance?: number
          created_at?: string
          created_by?: string
          gold_holdings?: number
          id?: string
          notes?: string | null
          platinum_holdings?: number
          silver_holdings?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio_allocations: {
        Row: {
          account_id: string
          cash_percentage: number
          created_at: string
          created_by: string
          gold_percentage: number
          id: string
          platinum_percentage: number
          silver_percentage: number
          updated_at: string
        }
        Insert: {
          account_id: string
          cash_percentage?: number
          created_at?: string
          created_by: string
          gold_percentage?: number
          id?: string
          platinum_percentage?: number
          silver_percentage?: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          cash_percentage?: number
          created_at?: string
          created_by?: string
          gold_percentage?: number
          id?: string
          platinum_percentage?: number
          silver_percentage?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_allocations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "investment_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          metadata: Json | null
          metal_type: string | null
          name: string
          price_usd: number
          product_url: string | null
          purity: string | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          updated_at: string
          weight: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          metal_type?: string | null
          name: string
          price_usd: number
          product_url?: string | null
          purity?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          updated_at?: string
          weight?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          metal_type?: string | null
          name?: string
          price_usd?: number
          product_url?: string | null
          purity?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          updated_at?: string
          weight?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          state: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      security_questions: {
        Row: {
          created_at: string
          id: string
          question: string
        }
        Insert: {
          created_at?: string
          id?: string
          question: string
        }
        Update: {
          created_at?: string
          id?: string
          question?: string
        }
        Relationships: []
      }
      user_action_permissions: {
        Row: {
          account_settings_access: boolean | null
          allow_deposit_requests: boolean | null
          allow_withdrawal_requests: boolean | null
          auto_approve_deposits: boolean | null
          auto_approve_limit: number | null
          created_at: string
          created_by: string
          goal_setting_access: boolean | null
          holdings_analysis_access: boolean | null
          id: string
          live_chat_support: boolean | null
          market_news_notifications: boolean | null
          monthly_reports_access: boolean | null
          performance_reports_access: boolean | null
          phone_support: boolean | null
          price_alerts_enabled: boolean | null
          tax_reports_access: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_settings_access?: boolean | null
          allow_deposit_requests?: boolean | null
          allow_withdrawal_requests?: boolean | null
          auto_approve_deposits?: boolean | null
          auto_approve_limit?: number | null
          created_at?: string
          created_by: string
          goal_setting_access?: boolean | null
          holdings_analysis_access?: boolean | null
          id?: string
          live_chat_support?: boolean | null
          market_news_notifications?: boolean | null
          monthly_reports_access?: boolean | null
          performance_reports_access?: boolean | null
          phone_support?: boolean | null
          price_alerts_enabled?: boolean | null
          tax_reports_access?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_settings_access?: boolean | null
          allow_deposit_requests?: boolean | null
          allow_withdrawal_requests?: boolean | null
          auto_approve_deposits?: boolean | null
          auto_approve_limit?: number | null
          created_at?: string
          created_by?: string
          goal_setting_access?: boolean | null
          holdings_analysis_access?: boolean | null
          id?: string
          live_chat_support?: boolean | null
          market_news_notifications?: boolean | null
          monthly_reports_access?: boolean | null
          performance_reports_access?: boolean | null
          phone_support?: boolean | null
          price_alerts_enabled?: boolean | null
          tax_reports_access?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_ai_insights: {
        Row: {
          confidence_score: number | null
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          insight_type: string
          is_active: boolean
          metal_focus: string | null
          priority: number | null
          reasoning: string | null
          recommendation: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          insight_type: string
          is_active?: boolean
          metal_focus?: string | null
          priority?: number | null
          reasoning?: string | null
          recommendation: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_active?: boolean
          metal_focus?: string | null
          priority?: number | null
          reasoning?: string | null
          recommendation?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_banners: {
        Row: {
          banner_type: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean
          message: string
          priority: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          banner_type?: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message: string
          priority?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          banner_type?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message?: string
          priority?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_performance_metrics: {
        Row: {
          all_time_return: number | null
          created_at: string
          created_by: string
          gold_target_oz: number | null
          id: string
          one_month_return: number | null
          platinum_target_oz: number | null
          portfolio_target_value: number | null
          silver_target_oz: number | null
          target_date: string | null
          three_month_return: number | null
          updated_at: string
          user_id: string
          ytd_return: number | null
        }
        Insert: {
          all_time_return?: number | null
          created_at?: string
          created_by: string
          gold_target_oz?: number | null
          id?: string
          one_month_return?: number | null
          platinum_target_oz?: number | null
          portfolio_target_value?: number | null
          silver_target_oz?: number | null
          target_date?: string | null
          three_month_return?: number | null
          updated_at?: string
          user_id: string
          ytd_return?: number | null
        }
        Update: {
          all_time_return?: number | null
          created_at?: string
          created_by?: string
          gold_target_oz?: number | null
          id?: string
          one_month_return?: number | null
          platinum_target_oz?: number | null
          portfolio_target_value?: number | null
          silver_target_oz?: number | null
          target_date?: string | null
          three_month_return?: number | null
          updated_at?: string
          user_id?: string
          ytd_return?: number | null
        }
        Relationships: []
      }
      user_risk_profiles: {
        Row: {
          created_at: string
          created_by: string
          diversification_score: number | null
          id: string
          market_correlation: number | null
          notes: string | null
          risk_tolerance: string
          updated_at: string
          user_id: string
          volatility_comfort: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          diversification_score?: number | null
          id?: string
          market_correlation?: number | null
          notes?: string | null
          risk_tolerance?: string
          updated_at?: string
          user_id: string
          volatility_comfort?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          diversification_score?: number | null
          id?: string
          market_correlation?: number | null
          notes?: string | null
          risk_tolerance?: string
          updated_at?: string
          user_id?: string
          volatility_comfort?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_security_answers: {
        Row: {
          answer_hash: string
          created_at: string
          id: string
          question_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer_hash: string
          created_at?: string
          id?: string
          question_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer_hash?: string
          created_at?: string
          id?: string
          question_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_security_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "security_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tool_settings: {
        Row: {
          calculator_expected_return: number | null
          calculator_time_horizon: number | null
          created_at: string
          created_by: string
          email_alerts_enabled: boolean | null
          gold_price_alert: number | null
          gold_target_percentage: number | null
          id: string
          maximum_investment: number | null
          minimum_investment: number | null
          platinum_price_alert: number | null
          platinum_target_percentage: number | null
          push_notifications_enabled: boolean | null
          rebalance_threshold: number | null
          silver_price_alert: number | null
          silver_target_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calculator_expected_return?: number | null
          calculator_time_horizon?: number | null
          created_at?: string
          created_by: string
          email_alerts_enabled?: boolean | null
          gold_price_alert?: number | null
          gold_target_percentage?: number | null
          id?: string
          maximum_investment?: number | null
          minimum_investment?: number | null
          platinum_price_alert?: number | null
          platinum_target_percentage?: number | null
          push_notifications_enabled?: boolean | null
          rebalance_threshold?: number | null
          silver_price_alert?: number | null
          silver_target_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calculator_expected_return?: number | null
          calculator_time_horizon?: number | null
          created_at?: string
          created_by?: string
          email_alerts_enabled?: boolean | null
          gold_price_alert?: number | null
          gold_target_percentage?: number | null
          id?: string
          maximum_investment?: number | null
          minimum_investment?: number | null
          platinum_price_alert?: number | null
          platinum_target_percentage?: number | null
          push_notifications_enabled?: boolean | null
          rebalance_threshold?: number | null
          silver_price_alert?: number | null
          silver_target_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_transactions: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          id: string
          metal_type: string
          notes: string | null
          price_per_oz: number
          status: string
          total_value: number | null
          transaction_date: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          id?: string
          metal_type: string
          notes?: string | null
          price_per_oz: number
          status?: string
          total_value?: number | null
          transaction_date?: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          id?: string
          metal_type?: string
          notes?: string | null
          price_per_oz?: number
          status?: string
          total_value?: number | null
          transaction_date?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          amount_oz: number
          created_at: string
          created_by: string
          estimated_value: number | null
          id: string
          metal_type: string
          processed_at: string | null
          processed_by: string | null
          rejection_reason: string | null
          shipping_address: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_state: string | null
          shipping_zip: string | null
          status: string
          tracking_number: string | null
          updated_at: string
          user_id: string
          withdrawal_type: string
        }
        Insert: {
          amount_oz: number
          created_at?: string
          created_by: string
          estimated_value?: number | null
          id?: string
          metal_type: string
          processed_at?: string | null
          processed_by?: string | null
          rejection_reason?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
          user_id: string
          withdrawal_type: string
        }
        Update: {
          amount_oz?: number
          created_at?: string
          created_by?: string
          estimated_value?: number | null
          id?: string
          metal_type?: string
          processed_at?: string | null
          processed_by?: string | null
          rejection_reason?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
          withdrawal_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_account_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
