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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          size: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          size: string
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          size?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          note: string | null
          order_number: string
          status: Database["public"]["Enums"]["order_status"]
          submitted_at: string | null
          total_pieces: number
          total_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          submitted_at?: string | null
          total_pieces?: number
          total_value?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          submitted_at?: string | null
          total_pieces?: number
          total_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          category: Database["public"]["Enums"]["product_category"]
          color: string
          created_at: string
          delivery: string
          description: string | null
          fabric: string
          fit: Database["public"]["Enums"]["product_fit"]
          id: string
          image_url: string | null
          moq: number
          name: string
          retail: number
          sizes: string[]
          sku: string
          slug: string
          sort_order: number
          updated_at: string
          weight: string
          wholesale: number
        }
        Insert: {
          active?: boolean
          category: Database["public"]["Enums"]["product_category"]
          color: string
          created_at?: string
          delivery?: string
          description?: string | null
          fabric: string
          fit: Database["public"]["Enums"]["product_fit"]
          id?: string
          image_url?: string | null
          moq?: number
          name: string
          retail: number
          sizes?: string[]
          sku: string
          slug: string
          sort_order?: number
          updated_at?: string
          weight: string
          wholesale: number
        }
        Update: {
          active?: boolean
          category?: Database["public"]["Enums"]["product_category"]
          color?: string
          created_at?: string
          delivery?: string
          description?: string | null
          fabric?: string
          fit?: Database["public"]["Enums"]["product_fit"]
          id?: string
          image_url?: string | null
          moq?: number
          name?: string
          retail?: number
          sizes?: string[]
          sku?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          weight?: string
          wholesale?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          boutique_name: string | null
          categories: string[] | null
          city: string | null
          contact_person: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          instagram: string | null
          message: string | null
          monthly_qty: string | null
          phone: string | null
          status: Database["public"]["Enums"]["partner_status"]
          store_type: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          boutique_name?: string | null
          categories?: string[] | null
          city?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email: string
          id: string
          instagram?: string | null
          message?: string | null
          monthly_qty?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          store_type?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          boutique_name?: string | null
          categories?: string[] | null
          city?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          instagram?: string | null
          message?: string | null
          monthly_qty?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          store_type?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      stock: {
        Row: {
          id: string
          product_id: string
          quantity: number
          size: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity?: number
          size: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          size?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "partner"
      order_status:
        | "draft"
        | "submitted"
        | "confirmed"
        | "shipped"
        | "cancelled"
      partner_status: "pending" | "approved" | "rejected"
      product_category: "jeans" | "chino" | "cargo"
      product_fit: "Slim" | "Regular Slim" | "Relaxed" | "Cargo"
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
      app_role: ["admin", "partner"],
      order_status: ["draft", "submitted", "confirmed", "shipped", "cancelled"],
      partner_status: ["pending", "approved", "rejected"],
      product_category: ["jeans", "chino", "cargo"],
      product_fit: ["Slim", "Regular Slim", "Relaxed", "Cargo"],
    },
  },
} as const
