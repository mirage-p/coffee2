import { registerClient } from "@/lib/events"

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'))

      const cleanup = registerClient(controller)

      // Keep connection alive with periodic pings
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode('data: {"type":"ping"}\n\n'))
        } catch (error) {
          clearInterval(pingInterval)
          cleanup()
        }
      }, 30000) // Ping every 30 seconds

      // Return cleanup function
      return () => {
        clearInterval(pingInterval)
        cleanup()
      }
    },
    cancel() {
      // Handle client disconnect
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}
