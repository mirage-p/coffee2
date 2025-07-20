export interface DrinkItem {
  id: number
  name: string
  ingredients: string[]
}

export interface PastryItem {
  id: number
  name: string
}

export interface MenuItem {
  id: number
  name: string
  ingredients?: string[]
  category: "drinks" | "pastries"
}

export interface CartItem extends MenuItem {
  quantity: number
  sweetness?: "regular" | "extra" // Only for drinks
}

export interface Order {
  id: string
  customer_name: string
  items: CartItem[]
  notes: string
  status: "pending" | "completed"
  created_at: string
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          customer_name: string
          items: CartItem[]
          notes: string
          status: "pending" | "completed"
          created_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          items: CartItem[]
          notes: string
          status?: "pending" | "completed"
          created_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          items?: CartItem[]
          notes?: string
          status?: "pending" | "completed"
          created_at?: string
        }
      }
    }
  }
}
