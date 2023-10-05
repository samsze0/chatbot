type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
        };
        Insert: {
          id?: string;
          username?: string | null;
        };
        Update: {
          id?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      prompt_templates: {
        Row: {
          creator_user_id: string;
          id: string;
          is_public: boolean;
          name: string;
          prompt_template: string;
        };
        Insert: {
          creator_user_id?: string;
          id?: string;
          is_public: boolean;
          name: string;
          prompt_template: string;
        };
        Update: {
          creator_user_id?: string;
          id?: string;
          is_public?: boolean;
          name?: string;
          prompt_template?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prompt_templates_creator_user_id_fkey";
            columns: ["creator_user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
