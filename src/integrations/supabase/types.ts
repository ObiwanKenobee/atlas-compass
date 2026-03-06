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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cost_structure: {
        Row: {
          created_at: string
          data_acquisition: number
          engineering_infra: number
          id: string
          metric_date: string
          operations_team: number
          partnerships_field: number
          research_modeling: number
        }
        Insert: {
          created_at?: string
          data_acquisition?: number
          engineering_infra?: number
          id?: string
          metric_date?: string
          operations_team?: number
          partnerships_field?: number
          research_modeling?: number
        }
        Update: {
          created_at?: string
          data_acquisition?: number
          engineering_infra?: number
          id?: string
          metric_date?: string
          operations_team?: number
          partnerships_field?: number
          research_modeling?: number
        }
        Relationships: []
      }
      financial_metrics: {
        Row: {
          burn_rate: number
          cac: number
          cash_on_hand: number
          created_at: string
          headcount: number
          id: string
          ltv: number
          metric_date: string
          mrr: number
          mrr_growth_percent: number
          revenue_per_employee: number
          runway_months: number
          updated_at: string
        }
        Insert: {
          burn_rate?: number
          cac?: number
          cash_on_hand?: number
          created_at?: string
          headcount?: number
          id?: string
          ltv?: number
          metric_date?: string
          mrr?: number
          mrr_growth_percent?: number
          revenue_per_employee?: number
          runway_months?: number
          updated_at?: string
        }
        Update: {
          burn_rate?: number
          cac?: number
          cash_on_hand?: number
          created_at?: string
          headcount?: number
          id?: string
          ltv?: number
          metric_date?: string
          mrr?: number
          mrr_growth_percent?: number
          revenue_per_employee?: number
          runway_months?: number
          updated_at?: string
        }
        Relationships: []
      }
      investor_updates: {
        Row: {
          created_at: string
          description: string
          id: string
          title: string
          update_date: string
          update_type: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          title: string
          update_date?: string
          update_type: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          title?: string
          update_date?: string
          update_type?: string
        }
        Relationships: []
      }
      revenue_streams: {
        Row: {
          created_at: string
          enterprise_simulations: number
          gov_institutional: number
          id: string
          marketplace_fees: number
          metric_date: string
          verification_api: number
        }
        Insert: {
          created_at?: string
          enterprise_simulations?: number
          gov_institutional?: number
          id?: string
          marketplace_fees?: number
          metric_date?: string
          verification_api?: number
        }
        Update: {
          created_at?: string
          enterprise_simulations?: number
          gov_institutional?: number
          id?: string
          marketplace_fees?: number
          metric_date?: string
          verification_api?: number
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
