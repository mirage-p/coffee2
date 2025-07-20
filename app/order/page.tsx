"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Coffee, Croissant, Trash2 } from "lucide-react"
import { submitOrder } from "@/lib/actions"
import type { MenuItem, CartItem } from "@/lib/types"
import { menuItems } from "@/lib/data"

export default function OrderPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [orderNotes, setOrderNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      setCart(
        cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
      )
    } else {
      // Add drinks with default "regular" sweetness, pastries without sweetness
      const newItem: CartItem = {
        ...item,
        quantity: 1,
        sweetness: item.category === "drinks" ? "regular" : undefined,
      }
      setCart([...cart, newItem])
    }
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const updateSweetness = (id: number, sweetness: "regular" | "extra") => {
    setCart(cart.map((item) => (item.id === id ? { ...item, sweetness } : item)))
  }

  const handleSubmit = async () => {
    if (cart.length === 0) return
    if (!customerName.trim()) return

    setIsSubmitting(true)

    try {
      await submitOrder({
        customer_name: customerName,
        items: cart,
        notes: orderNotes,
        status: "pending",
        created_at: new Date().toISOString(),
      })

      setCart([])
      setCustomerName("")
      setOrderNotes("")
      router.push("/order/confirmation")
    } catch (error) {
      console.error("Failed to submit order:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const drinks = menuItems.filter((item) => item.category === "drinks")
  const pastries = menuItems.filter((item) => item.category === "pastries")

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-yellow-50">
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-emerald-900">Matcha and Yap</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Drinks Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-emerald-800">Matcha Drinks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {drinks.map((drink) => (
                  <Card key={drink.id} className="overflow-hidden hover:shadow-md transition-shadow border-emerald-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-emerald-900">{drink.name}</h3>
                          <div className="mt-1 space-y-1">
                            {drink.ingredients?.map((ingredient, index) => (
                              <p key={index} className="text-xs text-emerald-600">
                                • {ingredient}
                              </p>
                            ))}
                          </div>
                        </div>
                        <Coffee className="h-6 w-6 text-emerald-600" />
                      </div>
                      <Button
                        onClick={() => addToCart(drink)}
                        className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700"
                      >
                        Add to Order
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pastries Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-yellow-800">Pastries/Bread</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastries.map((pastry) => (
                  <Card key={pastry.id} className="overflow-hidden hover:shadow-md transition-shadow border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-yellow-900">{pastry.name}</h3>
                        </div>
                        <Croissant className="h-6 w-6 text-yellow-600" />
                      </div>
                      <Button
                        onClick={() => addToCart(pastry)}
                        className="w-full mt-3 bg-yellow-600 hover:bg-yellow-700"
                      >
                        Add to Order
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-emerald-800">Your Order</h2>
            <Card className="mb-4 border-emerald-200">
              <CardContent className="p-4">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-1 text-emerald-800">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                {cart.length === 0 ? (
                  <p className="text-center py-6 text-emerald-600">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="border-b border-emerald-100 pb-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-emerald-900">
                              {item.name}
                              {item.sweetness && (
                                <span className="text-sm text-emerald-600 ml-2">({item.sweetness} sweetness)</span>
                              )}
                            </h4>
                            <div className="flex items-center mt-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent border-emerald-300"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="mx-2">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent border-emerald-300"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>

                            {/* Sweetness selector for drinks */}
                            {item.category === "drinks" && (
                              <div className="mt-2">
                                <label className="block text-xs font-medium text-emerald-800 mb-1">Sweetness</label>
                                <Select
                                  value={item.sweetness || "regular"}
                                  onValueChange={(value: "regular" | "extra") => updateSweetness(item.id, value)}
                                >
                                  <SelectTrigger className="w-full h-7 text-xs border-emerald-200">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="regular">Regular</SelectItem>
                                    <SelectItem value="extra">Extra</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-4">
                      <label htmlFor="notes" className="block text-sm font-medium mb-1 text-emerald-800">
                        Special Instructions (for entire order)
                      </label>
                      <Textarea
                        id="notes"
                        placeholder="Any special instructions for your order..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="text-sm resize-none border-emerald-200 focus:border-emerald-400"
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={cart.length === 0 || !customerName.trim() || isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isSubmitting ? "Submitting..." : "Place Order"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
