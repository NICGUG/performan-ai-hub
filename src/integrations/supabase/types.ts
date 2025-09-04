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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      documentos_puesto: {
        Row: {
          created_at: string
          fecha_subida: string
          id: string
          nombre_archivo: string
          puesto_id: string
          ruta_archivo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fecha_subida?: string
          id?: string
          nombre_archivo: string
          puesto_id: string
          ruta_archivo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fecha_subida?: string
          id?: string
          nombre_archivo?: string
          puesto_id?: string
          ruta_archivo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_puesto_puesto_id_fkey"
            columns: ["puesto_id"]
            isOneToOne: false
            referencedRelation: "puestos"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluaciones_puesto: {
        Row: {
          comentarios: string | null
          created_at: string
          criterio: string
          fecha_evaluacion: string
          id: string
          puesto_id: string
          puntuacion: number | null
          updated_at: string
        }
        Insert: {
          comentarios?: string | null
          created_at?: string
          criterio: string
          fecha_evaluacion?: string
          id?: string
          puesto_id: string
          puntuacion?: number | null
          updated_at?: string
        }
        Update: {
          comentarios?: string | null
          created_at?: string
          criterio?: string
          fecha_evaluacion?: string
          id?: string
          puesto_id?: string
          puntuacion?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluaciones_puesto_puesto_id_fkey"
            columns: ["puesto_id"]
            isOneToOne: false
            referencedRelation: "puestos"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_calendario: {
        Row: {
          created_at: string
          descripcion: string | null
          estado: string
          fecha_fin: string | null
          fecha_inicio: string
          id: string
          prioridad: string
          puesto_relacionado: string | null
          recordatorios: string[] | null
          tipo: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_fin?: string | null
          fecha_inicio: string
          id?: string
          prioridad?: string
          puesto_relacionado?: string | null
          recordatorios?: string[] | null
          tipo?: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          prioridad?: string
          puesto_relacionado?: string | null
          recordatorios?: string[] | null
          tipo?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventos_calendario_puesto_relacionado_fkey"
            columns: ["puesto_relacionado"]
            isOneToOne: false
            referencedRelation: "puestos"
            referencedColumns: ["id"]
          },
        ]
      }
      puestos: {
        Row: {
          area: string
          created_at: string
          descripcion: string | null
          estado: string
          fecha_creacion: string
          id: string
          propietario: string | null
          titulo: string
          ubicacion: string | null
          ultima_accion: string | null
          updated_at: string
        }
        Insert: {
          area: string
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_creacion?: string
          id?: string
          propietario?: string | null
          titulo: string
          ubicacion?: string | null
          ultima_accion?: string | null
          updated_at?: string
        }
        Update: {
          area?: string
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_creacion?: string
          id?: string
          propietario?: string | null
          titulo?: string
          ubicacion?: string | null
          ultima_accion?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      valoraciones_documentos: {
        Row: {
          created_at: string
          criterio: string
          documento_id: string
          fecha_extraccion: string
          id: string
          metodo_extraccion: string
          puesto_id: string
          puntuacion: number
          revisado: boolean
          texto_original: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          criterio: string
          documento_id: string
          fecha_extraccion?: string
          id?: string
          metodo_extraccion?: string
          puesto_id: string
          puntuacion: number
          revisado?: boolean
          texto_original?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          criterio?: string
          documento_id?: string
          fecha_extraccion?: string
          id?: string
          metodo_extraccion?: string
          puesto_id?: string
          puntuacion?: number
          revisado?: boolean
          texto_original?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "valoraciones_documentos_documento_id_fkey"
            columns: ["documento_id"]
            isOneToOne: false
            referencedRelation: "documentos_puesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valoraciones_documentos_puesto_id_fkey"
            columns: ["puesto_id"]
            isOneToOne: false
            referencedRelation: "puestos"
            referencedColumns: ["id"]
          },
        ]
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
