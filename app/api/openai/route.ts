import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { initialMessage } from "@/lib/data"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()

        const systemMessage = {
            role: "system",
            content: initialMessage.content,
        }

        const result = streamText({
            model: openai("gpt-4o-mini"),
            system: systemMessage.content,
            messages,
            temperature: 0.7,
        })

        return result.toDataStreamResponse()
    } catch (error) {
        console.error("OpenAI API error:", error)
        return new Response(
            JSON.stringify({
                error: "There was an error processing your request",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
    }
}
