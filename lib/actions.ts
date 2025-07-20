"use server"

import { v4 as uuidv4 } from "uuid"
import type { Order } from "./types"
import { createServerClient } from "./supabase"
import { revalidatePath } from "next/cache"

export async function submitOrder(orderData: Omit<Order, "id">) {
  try {
    const supabase = createServerClient()
    const id = uuidv4()

    const order: Order = {
      ...orderData,
      id,
    }

    console.log("submitOrder: Creating order with ID", id)

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          id: order.id,
          customer_name: order.customer_name,
          items: order.items,
          notes: order.notes,
          status: order.status,
          created_at: order.created_at,
        },
      ])
      .select()

    if (error) {
      console.error("submitOrder: Supabase error:", error)
      throw new Error(`Failed to create order: ${error.message}`)
    }

    console.log("submitOrder: Order created successfully", data)

    revalidatePath("/barista")
    return { success: true, orderId: id }
  } catch (error) {
    console.error("submitOrder: Error:", error)
    throw error
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const supabase = createServerClient()
    console.log("getOrders: Fetching orders from Supabase")

    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("getOrders: Supabase error:", error)
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    console.log("getOrders: Retrieved orders:", data?.length || 0)
    return data || []
  } catch (error) {
    console.error("getOrders: Error:", error)
    throw error
  }
}

export async function completeOrder(orderId: string) {
  try {
    const supabase = createServerClient()
    console.log("completeOrder: Completing order", orderId)

    const { data, error } = await supabase.from("orders").update({ status: "completed" }).eq("id", orderId).select()

    if (error) {
      console.error("completeOrder: Supabase error:", error)
      throw new Error(`Failed to complete order: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error("Order not found")
    }

    console.log("completeOrder: Order completed successfully")

    revalidatePath("/barista")
    return { success: true }
  } catch (error) {
    console.error("completeOrder: Error:", error)
    throw error
  }
}
