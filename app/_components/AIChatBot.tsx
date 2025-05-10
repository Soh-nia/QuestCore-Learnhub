"use client"

import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import RemarkGfm from "remark-gfm"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, MessageCircle, Loader2, ArrowDownCircle, Trash2 } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import type { Message } from "ai"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define a unique key for localStorage
const CHAT_STORAGE_KEY = "questcore-chat-history"

export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showChatIcon, setShowChatIcon] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatIconRef = useRef<HTMLButtonElement>(null)
//   const [chatHeight, setChatHeight] = useState(400) // Default height

  // Load saved messages from localStorage on initial render
  const loadSavedMessages = (): Message[] => {
    if (typeof window === "undefined") return [] // Handle SSR

    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error("Failed to load chat history:", error)
      return []
    }
  }

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error, setMessages } = useChat({
    api: "/api/gemini",
    initialMessages: loadSavedMessages(),
    onFinish: () => {
      scrollToBottom()
    },
    onResponse: (response) => {
      if (typeof window !== "undefined") {
        try {
          const updatedMessages = [
            ...messages,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: response.text,
            },
          ]
          localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedMessages))
        } catch (error) {
          console.error("Failed to save chat history:", error)
        }
      }
    },
  })

//   Calculate appropriate chat height based on viewport
//   useEffect(() => {
//     const calculateHeight = () => {
//       const viewportHeight = window.innerHeight
//       // Use 60% of viewport height, but not less than 300px or more than 500px
//       const calculatedHeight = Math.min(Math.max(viewportHeight * 0.6, 400), 500)
//       setChatHeight(calculatedHeight)
//     }

//     calculateHeight()
//     window.addEventListener("resize", calculateHeight)
//     return () => window.removeEventListener("resize", calculateHeight)
//   }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
      } catch (error) {
        console.error("Failed to save chat history:", error)
      }
    }
  }, [messages])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowChatIcon(true)
      } else {
        setShowChatIcon(false)
        setIsChatOpen(false)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [isLoading])

  useEffect(() => {
    let scrollInterval: NodeJS.Timeout | null = null

    if (isLoading) {
      scrollInterval = setInterval(scrollToBottom, 800)
    }

    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval)
      }
    }
  }, [isLoading])

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
    setTimeout(scrollToBottom, 500)
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem(CHAT_STORAGE_KEY)
  }

  return (
    <>
      <AnimatePresence>
        {showChatIcon && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button
              ref={chatIconRef}
              onClick={toggleChat}
              size="icon"
              className="size-16 rounded-full shadow-lg bg-lime-600 hover:bg-lime-700"
            >
              {!isChatOpen ? <MessageCircle className="size-8" /> : <ArrowDownCircle className="size-6" />}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && showChatIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-18 right-4 z-50"
          >
            <Card className="border shadow-xl flex flex-col w-[95%] md:w-[450px]">
              <CardHeader className="bg-lime-700 text-white p-4">
                <CardTitle className="flex justify-between items-center">
                  <span>QuestCore Assistant</span>
                  <div className="flex gap-2">
                    {messages.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearChat}
                        className="text-white hover:bg-lime-900"
                        title="Clear chat history"
                      >
                        <Trash2 className="size-5" />
                        <span className="sr-only">Clear chat</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-lime-900">
                      <X className="size-6" />
                      <span className="sr-only">Close chat</span>
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription className="text-lime-100">
                  Ask me anything about our courses or platform
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[250px]">
                  <div className="p-3" ref={scrollAreaRef}>
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                        <MessageCircle className="size-12 mb-4 text-lime-600" />
                        <p className="text-lg font-medium">How can I help you today?</p>
                        <p className="text-sm mt-2">Ask about courses, enrollment, or get learning recommendations.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.role === "user" ? "bg-lime-700 text-white" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <ReactMarkdown
                                remarkPlugins={[RemarkGfm]}
                                components={{
                                  code: ({ className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || "")
                                    return match ? (
                                      <pre className="bg-gray-200 px-1 rounded">
                                        <code {...props} className={className}>
                                          {children}
                                        </code>
                                      </pre>
                                    ) : (
                                      <code {...props} className="bg-gray-200 px-2 rounded">
                                        {children}
                                      </code>
                                    )
                                  },
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-center w-full items-center gap-4 my-5">
                            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
                              <Loader2 className="size-6 animate-spin" />
                            </div>
                            <button type="button" onClick={() => stop()} className="underline">
                              Abort
                            </button>
                          </div>
                        )}
                        {error && (
                          <div className="flex justify-center w-full items-center gap-4 my-5">
                            <div>An error occurred. Please try again.</div>
                            <button type="button" onClick={() => reload()} className="underline">
                              Retry
                            </button>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-lime-600 hover:bg-lime-700"
                  >
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}