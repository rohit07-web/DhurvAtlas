export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PublicationStatus = "draft" | "in_review" | "published";
export type ResourceType = "report" | "dataset" | "image" | "video";

export interface Database {
  public: {
    Tables: {
      stations: {
        Row: {
          id: string;
          name: string;
          region: string;
          description: string | null;
          coordinates: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          region: string;
          description?: string | null;
          coordinates?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          region?: string;
          description?: string | null;
          coordinates?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      expeditions: {
        Row: {
          id: string;
          title: string;
          station_id: string | null;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          station_id?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          station_id?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expeditions_station_id_fkey";
            columns: ["station_id"];
            isOneToOne: false;
            referencedRelation: "stations";
            referencedColumns: ["id"];
          }
        ];
      };
      resources: {
        Row: {
          id: string;
          title: string;
          type: ResourceType;
          expedition_id: string | null;
          description: string | null;
          source_url: string | null;
          file_path: string | null;
          publication_status: PublicationStatus;
          approved_summary: string | null;
          doi: string | null;
          authors: string[] | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          type: ResourceType;
          expedition_id?: string | null;
          description?: string | null;
          source_url?: string | null;
          file_path?: string | null;
          publication_status?: PublicationStatus;
          approved_summary?: string | null;
          doi?: string | null;
          authors?: string[] | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          type?: ResourceType;
          expedition_id?: string | null;
          description?: string | null;
          source_url?: string | null;
          file_path?: string | null;
          publication_status?: PublicationStatus;
          approved_summary?: string | null;
          doi?: string | null;
          authors?: string[] | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "resources_expedition_id_fkey";
            columns: ["expedition_id"];
            isOneToOne: false;
            referencedRelation: "expeditions";
            referencedColumns: ["id"];
          }
        ];
      };
      stories: {
        Row: { id: string; source_resource_id: string; title: string; excerpt: string; body: string; byline: string; publication_status: 'draft' | 'published'; created_at: string; updated_at: string; };
        Insert: { id?: string; source_resource_id: string; title: string; excerpt?: string; body?: string; byline?: string; publication_status?: 'draft' | 'published'; created_at?: string; updated_at?: string; };
        Update: { source_resource_id?: string; title?: string; excerpt?: string; body?: string; byline?: string; publication_status?: 'draft' | 'published'; };
        Relationships: [{ foreignKeyName: 'stories_source_resource_id_fkey'; columns: ['source_resource_id']; isOneToOne: false; referencedRelation: 'resources'; referencedColumns: ['id']; }];
      };
      ai_drafts: {
        Row: {
          id: string;
          resource_id: string;
          suggested_summary: string;
          source_basis?: string | null;
          key_takeaways: Json;
          suggested_tags: Json;
          social_caption: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          resource_id: string;
          suggested_summary: string;
          source_basis?: string | null;
          key_takeaways: Json;
          suggested_tags: Json;
          social_caption?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          resource_id?: string;
          suggested_summary?: string;
          source_basis?: string | null;
          key_takeaways?: Json;
          suggested_tags?: Json;
          social_caption?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_drafts_resource_id_fkey";
            columns: ["resource_id"];
            isOneToOne: false;
            referencedRelation: "resources";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: { is_admin: { Args: Record<string, never>; Returns: boolean }; claim_ai_slot: { Args: Record<string, never>; Returns: boolean }; };
    Enums: {
      resource_type_enum: ResourceType;
      publication_status_enum: PublicationStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
