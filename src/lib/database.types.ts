export type TransactionKind = "income" | "expense";
export type RecurringFrequency = "weekly" | "monthly" | "yearly";
export type CategoryKind = "income" | "expense" | "both";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          currency: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          currency?: string;
        };
        Update: {
          full_name?: string | null;
          currency?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          kind: CategoryKind;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          kind: CategoryKind;
          icon?: string;
        };
        Update: {
          name?: string;
          kind?: CategoryKind;
          icon?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          description: string;
          amount: number;
          kind: TransactionKind;
          occurred_on: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          description: string;
          amount: number;
          kind: TransactionKind;
          occurred_on?: string;
        };
        Update: {
          category_id?: string | null;
          description?: string;
          amount?: number;
          kind?: TransactionKind;
          occurred_on?: string;
        };
        Relationships: [];
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          monthly_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          monthly_amount: number;
        };
        Update: {
          category_id?: string;
          monthly_amount?: number;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          icon: string;
          target_amount: number;
          current_amount: number;
          target_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          icon?: string;
          target_amount: number;
          current_amount?: number;
          target_date?: string | null;
        };
        Update: {
          name?: string;
          icon?: string;
          target_amount?: number;
          current_amount?: number;
          target_date?: string | null;
        };
        Relationships: [];
      };
      recurring_transactions: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          description: string;
          amount: number;
          kind: TransactionKind;
          frequency: RecurringFrequency;
          next_occurrence: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          description: string;
          amount: number;
          kind: TransactionKind;
          frequency: RecurringFrequency;
          next_occurrence: string;
          is_active?: boolean;
        };
        Update: {
          category_id?: string | null;
          description?: string;
          amount?: number;
          kind?: TransactionKind;
          frequency?: RecurringFrequency;
          next_occurrence?: string;
          is_active?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
