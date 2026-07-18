// Generated from the live `ignaite` Supabase project (public schema) via
// `supabase gen types` (MCP generate_typescript_types). Regenerate after any
// migration: it is the single source of truth for row/insert/update shapes used
// by the typed clients in this folder. Do not hand-edit.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          note: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          note?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          note?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          created_at: string;
          id: string;
          item_slug: string;
          item_type: Database["public"]["Enums"]["bookmark_item_type"];
          note: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          item_slug: string;
          item_type: Database["public"]["Enums"]["bookmark_item_type"];
          note?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          item_slug?: string;
          item_type?: Database["public"]["Enums"]["bookmark_item_type"];
          note?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string | null;
          handle: string | null;
          id: string;
          is_public: boolean;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          handle?: string | null;
          id: string;
          is_public?: boolean;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          handle?: string | null;
          id?: string;
          is_public?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      bookmark_item_type: "app" | "recipe";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
