// Store for connected clients
const clients = new Set<ReadableStreamDefaultController>()

export function registerClient(controller: ReadableStreamDefaultController) {
  clients.add(controller)
  console.log(`Client connected. Total clients: ${clients.size}`)

  return () => {
    clients.delete(controller)
    console.log(`Client disconnected. Total clients: ${clients.size}`)
  }
}

export function notifyClients(data: any) {
  const event = `data: ${JSON.stringify(data)}\n\n`
  console.log(`Notifying ${clients.size} clients:`, data)

  // Create a copy of clients to iterate over
  const clientsCopy = Array.from(clients)

  clientsCopy.forEach((client) => {
    try {
      client.enqueue(new TextEncoder().encode(event))
    } catch (error) {
      console.error("Failed to send event to client:", error)
      // Remove failed client
      clients.delete(client)
    }
  })
}
