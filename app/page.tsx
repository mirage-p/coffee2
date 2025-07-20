import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-gradient-to-b from-emerald-50 to-yellow-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-emerald-900">Matcha Café POS System</h1>
        <p className="text-lg text-emerald-700">Select your interface</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link href="/order">
          <Button size="lg" className="w-64 h-32 text-xl bg-emerald-600 hover:bg-emerald-700">
            Customer Interface
          </Button>
        </Link>

        <Link href="/barista">
          <Button
            size="lg"
            variant="outline"
            className="w-64 h-32 text-xl border-emerald-600 text-emerald-800 hover:bg-emerald-100 bg-transparent"
          >
            Barista Interface
          </Button>
        </Link>
      </div>
    </div>
  )
}
