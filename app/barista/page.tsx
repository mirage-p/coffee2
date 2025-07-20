"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, RefreshCw, Wifi, Database } from "lucide-react"
import type { Order } from "@/lib/types"
import { completeOrder, getOrders } from "@/lib/actions"
import { supabase } from "@/lib/supabase"

export default function BaristaPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [debugInfo, setDebugInfo] = useState<string>("")

  const fetchOrders = async () => {
    try {
      setError(null)
      console.log("BaristaPage: Fetching orders...")
      const fetchedOrders = await getOrders()
      console.log("BaristaPage: Fetched orders:", fetchedOrders)
      setOrders(fetchedOrders)
      setDebugInfo(`Last fetch: ${new Date().toLocaleTimeString()} - Found ${fetchedOrders.length} orders`)
      return fetchedOrders
    } catch (error) {
      console.error("BaristaPage: Failed to fetch orders:", error)
      setError("Failed to load orders: " + (error as Error).message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    console.log("Setting up Supabase realtime subscription...")
    setConnectionStatus("connecting")

    const channel = supabase
      .channel("orders-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("New order received:", payload.new)
          const newOrder = payload.new as Order
          setOrders((prev) => [newOrder, ...prev])
          setDebugInfo(`New order: ${newOrder.customer_name} at ${new Date().toLocaleTimeString()}`)
          setConnectionStatus("connected")
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("Order updated:", payload.new)
          const updatedOrder = payload.new as Order
          setOrders((prev) => prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)))
          setDebugInfo(`Order updated: ${updatedOrder.id} at ${new Date().toLocaleTimeString()}`)
        },
      )
      .subscribe((status) => {
        console.log("Subscription status:", status)
        if (status === "SUBSCRIBED") {
          setConnectionStatus("connected")
          setError(null)
        } else if (status === "CHANNEL_ERROR") {
          setConnectionStatus("disconnected")
          setError("Real-time connection failed")
        }
      })

    return () => {
      console.log("Cleaning up Supabase subscription...")
      supabase.removeChannel(channel)
    }
  }

  useEffect(() => {
    console.log("BaristaPage: Component mounted")
    fetchOrders().then(() => {
      const cleanup = setupRealtimeSubscription()
      return cleanup
    })

    return () => {
      console.log("BaristaPage: Component unmounting")
    }
  }, [])

  const handleCompleteOrder = async (orderId: string) => {
    try {
      console.log("BaristaPage: Completing order", orderId)
      await completeOrder(orderId)
      // Real-time subscription will handle the UI update
    } catch (error) {
      console.error("BaristaPage: Failed to complete order:", error)
      setError("Failed to complete order: " + (error as Error).message)
    }
  }

  const handleRefresh = () => {
    console.log("BaristaPage: Manual refresh triggered")
    setLoading(true)
    fetchOrders()
  }

  const pendingOrders = orders.filter((order) => order.status === "pending")
  const completedOrders = orders.filter((order) => order.status === "completed")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-emerald-700">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-yellow-50">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-900">Barista Dashboard</h1>
          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <div className="flex items-center gap-1 text-sm">
              {connectionStatus === "connected" && (
                <>
                  <Database className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-600">Real-time</span>
                </>
              )}
              {connectionStatus === "connecting" && (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-yellow-600" />
                  <span className="text-yellow-600">Connecting...</span>
                </>
              )}
              {connectionStatus === "disconnected" && (
                <>
                  <Wifi className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">Disconnected</span>
                </>
              )}
            </div>

            <Button onClick={handleRefresh} variant="outline" className="border-emerald-300 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Supabase Status:</span>
          </div>
          <p className="text-blue-700">{debugInfo}</p>
          <p className="text-blue-700">Total orders: {orders.length}</p>
          <p className="text-blue-700">
            Pending: {pendingOrders.length}, Completed: {completedOrders.length}
          </p>
          <p className="text-blue-700">Connection: {connectionStatus} (Real-time Database)</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-emerald-800">
              <Clock className="h-5 w-5" /> Pending Orders ({pendingOrders.length})
            </h2>

            {pendingOrders.length === 0 ? (
              <Card className="border-emerald-200">
                <CardContent className="p-6 text-center text-emerald-600">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No pending orders</p>
                  <p className="text-sm mt-1">Orders will appear here instantly when customers place them</p>
                  <p className="text-xs mt-2 text-emerald-500">Real-time updates via Supabase</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-emerald-500 border-emerald-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-emerald-900">Order for {order.customer_name}</CardTitle>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-xs text-emerald-600">
                        {new Date(order.created_at).toLocaleTimeString()} - ID: {order.id.slice(0, 8)}
                      </p>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <ul className="space-y-3">
                        {order.items.map((item, index) => (
                          <li key={index} className="border-b border-emerald-100 pb-3 last:border-0 last:pb-0">
                            <div className="flex justify-between">
                              <span className="font-medium text-emerald-900">
                                {item.quantity}x {item.name}
                                {item.sweetness && (
                                  <span className="text-sm text-emerald-600 ml-2">({item.sweetness} sweetness)</span>
                                )}
                              </span>
                            </div>
                            {item.ingredients && (
                              <div className="mt-1 text-sm text-emerald-600">
                                {item.ingredients.map((ingredient, i) => (
                                  <span key={i}>
                                    • {ingredient}
                                    {i < item.ingredients!.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                      {order.notes && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-yellow-800">
                            <strong>Special Instructions:</strong> {order.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        Mark as Complete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-emerald-800">
              <CheckCircle className="h-5 w-5" /> Completed Orders ({completedOrders.length})
            </h2>

            {completedOrders.length === 0 ? (
              <Card className="border-emerald-200">
                <CardContent className="p-6 text-center text-emerald-600">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No completed orders</p>
                  <p className="text-sm mt-1">Completed orders will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedOrders.slice(0, 5).map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-emerald-500 opacity-75 border-emerald-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-emerald-900">Order for {order.customer_name}</CardTitle>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                          Completed
                        </Badge>
                      </div>
                      <p className="text-xs text-emerald-600">
                        {new Date(order.created_at).toLocaleTimeString()} - ID: {order.id.slice(0, 8)}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {order.items.map((item, index) => (
                          <li key={index} className="border-b border-emerald-100 pb-2 last:border-0 last:pb-0">
                            <div className="flex justify-between">
                              <span className="text-emerald-700">
                                {item.quantity}x {item.name}
                                {item.sweetness && (
                                  <span className="text-sm text-emerald-600 ml-2">({item.sweetness})</span>
                                )}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
