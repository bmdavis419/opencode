import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug || "index"
  const docs = await getCollection("docs")
  const doc = docs.find((d) => d.id === slug)

  if (!doc) return new Response("Not found", { status: 404 })

  const body = doc.body || ""
  const data = doc.data || {}
  const front = Object.entries(data)
    .filter((entry) => entry[1] !== undefined)
    .map((entry) => {
      const key = entry[0]
      const value = entry[1]
      return `${key}: ${JSON.stringify(value)}`
    })
    .join("\n")
  const text = front ? `---\n${front}\n---\n\n${body}` : body

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
