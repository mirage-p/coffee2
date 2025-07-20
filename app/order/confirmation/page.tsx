import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderConfirmation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-yellow-50 flex items-center justify-center">
      <div className="container mx-auto p-4 max-w-md">
        <div className="text-center space-y-6 py-12">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-900">Order Received!</h1>
          <p className="text-lg text-emerald-700">
            Your order has been successfully submitted and is being prepared by our baristas.
          </p>
          <Link href="/order">
            <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">Place Another Order</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
