import type { Order } from "./types"

// In-memory store for orders
// In a real application, this would be replaced with a database
class OrderStore {
  private orders: Order[] = []

  addOrder(order: Order) {
    console.log("OrderStore: Adding order", order)
    this.orders.unshift(order) // Add to the beginning for newest first
    console.log("OrderStore: Total orders now", this.orders.length)
  }

  getOrders() {
    console.log("OrderStore: Getting orders, total:", this.orders.length)
    return [...this.orders]
  }

  getOrderById(id: string) {
    const order = this.orders.find((order) => order.id === id)
    console.log("OrderStore: Getting order by ID", id, "found:", !!order)
    return order
  }

  updateOrder(updatedOrder: Order) {
    console.log("OrderStore: Updating order", updatedOrder.id)
    this.orders = this.orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
  }

  // Debug method to see all orders
  debugOrders() {
    console.log("OrderStore: All orders:", this.orders)
    return this.orders
  }
}

// Create a singleton instance
export const orderStore = new OrderStore()
