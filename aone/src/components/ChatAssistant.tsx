"use client"

import type React from "react"

import { useEffect, useRef, useState, useMemo } from "react"
import {
  FiSend,
  FiUsers,
  FiUser,
  FiHome,
  FiLoader,
  FiX,
  FiMessageSquare,
  FiChevronDown,
  FiClock,
  FiInfo,
  FiCalendar,
  FiMinimize2,
} from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"
import StaffDirectory from "./StaffDirectory"
import AppointmentCalendar from "./AppointmentCalender"

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
  loading?: boolean
}

interface UserData {
  name: string
  preference: "property-management" | "sales" | "investment" | null
}

// Mock AI response function
const getAIResponse = async (messages: any[]) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const userMessage = messages[messages.length - 1].content.toLowerCase()

  if (userMessage.includes("hello") || userMessage.includes("hi")) {
    return "Hello! I'm Emma, your A One Real Estate assistant. How can I help you today?"
  }

  if (userMessage.includes("property") || userMessage.includes("house") || userMessage.includes("apartment")) {
    return "I'd be happy to help with your property search. Could you tell me your name and what type of service you're looking for?"
  }

  if (userMessage.includes("investment")) {
    return "Investment properties are a great option in Adelaide. To provide personalized advice, could you share your name and investment goals?"
  }

  if (userMessage.includes("rent") || userMessage.includes("lease")) {
    return "We have several rental properties available. To help you find the perfect match, may I know your name and rental preferences?"
  }

  if (userMessage.includes("calendar") || userMessage.includes("sync") || userMessage.includes("google calendar")) {
    return "You can sync your appointments with Google Calendar or iCal. Would you like me to show you how to set that up?"
  }

  return "Thanks for your message. To better assist you, could you share your name and what type of real estate service you're interested in?"
}

interface ChatAssistantProps {
  onClose?: () => void
  isAuthenticated?: boolean
}

export default function ChatAssistant({ onClose, isAuthenticated = true }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [userData, setUserData] = useState<UserData>({ name: "", preference: null })
  const [showStaff, setShowStaff] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showAppointment, setShowAppointment] = useState(false)
  const [appointmentStaffId, setAppointmentStaffId] = useState<number | null>(null)
  const [minimized, setMinimized] = useState(false)

  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)

  // Personalized system prompt
  const systemPrompt = useMemo(
    () => `
    You are Emma, a digital assistant for A One Real Estate in Adelaide.
    Goals:
    1. Greet user by first name if known
    2. Collect name + preference (property-management, sales, or investment)
    3. Keep it conversational, short, and professional
    4. Offer to connect with specialists once data collected
    5. Use simple language, max 2 sentences per response
  `,
    [],
  )

  // Initial message from Emma
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        content: `Hi there! 👋 I'm Emma, your A One Real Estate assistant. Are you looking for property management, sales, or investment advice today?`,
        isBot: true,
        timestamp: new Date(),
      },
    ])
  }, [])

  // Scroll detection
  useEffect(() => {
    const onScroll = () => {
      const container = chatRef.current
      if (!container) return
      const { scrollTop, scrollHeight, clientHeight } = container
      setIsNearBottom(scrollTop + clientHeight >= scrollHeight - 100)
    }
    const container = chatRef.current
    container?.addEventListener("scroll", onScroll)
    return () => container?.removeEventListener("scroll", onScroll)
  }, [])

  // Auto scroll if near bottom
  useEffect(() => {
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, showStaff, isNearBottom])

  // Autofocus on form
  useEffect(() => {
    if (showForm) {
      nameInputRef.current?.focus()
    }
  }, [showForm])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    // Close welcome message if still open
    if (showWelcome) {
      setShowWelcome(false)
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      content: input,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    // Typing simulation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: "typing",
          content: "",
          isBot: true,
          loading: true,
          timestamp: new Date(),
        },
      ])
    }, 300)

    try {
      const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.isBot ? "assistant" : "user", content: m.content })),
        { role: "user", content: input },
      ]

      const aiResponse = await getAIResponse(formattedMessages)
      const botMsg: Message = {
        id: crypto.randomUUID(),
        content: aiResponse || "I'm having trouble responding.",
        isBot: true,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev.filter((m) => m.id !== "typing"), botMsg])

      // If AI hints at asking for name or preference
      if (/name|prefer|service|details/i.test(aiResponse || "") && isNearBottom) {
        setTimeout(() => setShowForm(true), 600)
      }
    } catch (err) {
      console.error("AI Error:", err)
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "typing"),
        {
          id: crypto.randomUUID(),
          content: "⚠️ I'm having trouble responding. Please try again shortly.",
          isBot: true,
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    if (!userData.name.trim()) {
      setFormError("Please enter your full name")
      nameInputRef.current?.focus()
      return
    }

    if (!userData.preference) {
      setFormError("Please select a service preference")
      return
    }

    try {
      formRef.current?.classList.add("submitting")
      await new Promise((res) => setTimeout(res, 500))

      const thankYouMessage: Message = {
        id: crypto.randomUUID(),
        content: `Thanks ${userData.name}! 🎉 I've noted your interest in ${userData.preference.replace("-", " ")}. Would you like to meet our specialists in this area?`,
        isBot: true,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, thankYouMessage])
      setShowForm(false)
    } catch {
      setFormError("Submission failed. Please try again.")
    } finally {
      formRef.current?.classList.remove("submitting")
    }
  }

  // Add this function to handle booking appointments with specific staff
  const handleBookAppointment = (staffId?: number) => {
    if (staffId) {
      setAppointmentStaffId(staffId)
    } else {
      setAppointmentStaffId(null)
    }
    setShowAppointment(true)
  }

  if (minimized) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={() => setMinimized(false)}
          className="bg-[#012169] text-white p-4 rounded-full shadow-lg hover:bg-[#1a3a7e] transition-colors flex items-center justify-center"
        >
          <FiMessageSquare className="w-6 h-6" />
        </button>
      </motion.div>
    )
  }

  return (
    <div className="aone-chat-container h-full">
      {/* Header */}
      <motion.header
        className="aone-header"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        style={{
          background: "linear-gradient(to right, #012169, #1a3a7e)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="header-brand">
          <FiHome className="aone-icon" />
          <h1 className="text-xl font-bold">A One Real Estate</h1>
          <div className="online-indicator" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMinimized(true)}
            className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Minimize"
          >
            <FiMinimize2 className="text-white w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <FiX className="text-white w-4 h-4" />
            </button>
          )}
        </div>
      </motion.header>

      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute inset-0 z-10 bg-gradient-to-b from-[#012169]/95 to-[#012169]/80 flex flex-col items-center justify-center text-white p-6 text-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-md"
            >
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiMessageSquare className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl font-bold mb-4">Welcome to A One Real Estate</h2>
              <p className="text-white/80 mb-8">
                I'm Emma, your personal real estate assistant. I'm here to help you find the perfect property solution
                in Adelaide.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWelcome(false)}
                className="bg-[#FF6B00] hover:bg-[#ff8642] text-white px-6 py-3 rounded-lg shadow-lg transition-all flex items-center gap-2 mx-auto"
              >
                Start Chatting <FiChevronDown />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <main
        className="aone-chat-messages"
        ref={chatRef}
        aria-live="polite"
        style={{
          background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
        }}
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`aone-message ${msg.isBot ? "bot" : "user"} ${msg.loading ? "loading" : ""}`}
            >
              {msg.isBot && !msg.loading && (
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "12px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#012169",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  E
                </div>
              )}

              <div className="message-content">
                {msg.loading ? (
                  <div className="typing-loader">
                    <FiLoader className="animate-spin" />
                    <span>Emma is typing...</span>
                  </div>
                ) : (
                  <p style={{ lineHeight: "1.5" }}>{msg.content}</p>
                )}
                <time className="message-time" title={msg.timestamp.toLocaleString()}>
                  <FiClock style={{ width: "12px", height: "12px" }} />
                  {msg.timestamp.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                </time>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* CTA buttons */}
        {userData.preference && (
          <motion.div className="aone-cta-container" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <motion.button
              className="aone-cta-button"
              onClick={() => setShowStaff(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "linear-gradient(to right, #FF6B00, #ff8642)",
                color: "white",
              }}
            >
              <FiUsers />
              <span>Meet Our Specialists</span>
            </motion.button>

            <motion.button
              className="aone-cta-button"
              onClick={() => handleBookAppointment()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "linear-gradient(to right, #012169, #1a3a7e)",
                color: "white",
              }}
            >
              <FiCalendar />
              <span>Book an Appointment</span>
            </motion.button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            ref={formRef}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onSubmit={handleFormSubmit}
            className="aone-form-container"
          >
            <button
              type="button"
              className="aone-form-close"
              onClick={() => setShowForm(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.25rem",
                color: "#333",
                cursor: "pointer",
              }}
            >
              <FiX />
            </button>

            <div className="form-header" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                className="form-icon"
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #012169, #1a3a7e)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  color: "white",
                  fontSize: "1.5rem",
                }}
              >
                <FiUser />
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Tell us about you</h2>
              <p style={{ color: "#666" }}>We'll connect you with the right expert</p>
            </div>

            <div className="form-body">
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Full Name
                </label>
                <input
                  id="name"
                  ref={nameInputRef}
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="glow-on-focus"
                  required
                  aria-required="true"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    outline: "none",
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Service Needed</label>
                <div className="radio-grid">
                  {[
                    { value: "property-management", label: "Property Management" },
                    { value: "sales", label: "Sales" },
                    { value: "investment", label: "Investment" },
                  ].map((option) => (
                    <motion.label
                      key={option.value}
                      whileTap={{ scale: 0.98 }}
                      className="radio-card"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "1rem",
                        borderRadius: "8px",
                        border: userData.preference === option.value ? "2px solid #012169" : "1px solid #ddd",
                        background: userData.preference === option.value ? "rgba(1, 33, 105, 0.05)" : "white",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="radio"
                        name="preference"
                        value={option.value}
                        checked={userData.preference === option.value}
                        onChange={() =>
                          setUserData({ ...userData, preference: option.value as UserData["preference"] })
                        }
                        style={{ position: "absolute", opacity: 0 }}
                      />
                      <div
                        className="radio-content"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          className="radio-indicator"
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: userData.preference === option.value ? "5px solid #012169" : "2px solid #ddd",
                            transition: "all 0.2s",
                          }}
                        />
                        <span style={{ textAlign: "center", fontSize: "0.9rem" }}>{option.label}</span>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>

              {formError && (
                <motion.div
                  className="form-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: "#fff0f0",
                    color: "#dc2626",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #fecaca",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FiInfo />
                  {formError}
                </motion.div>
              )}
            </div>

            <motion.button
              type="submit"
              className="aone-form-submit"
              whileHover={{ scale: 1.02 }}
              style={{
                background: "linear-gradient(to right, #012169, #1a3a7e)",
                color: "white",
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "none",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s",
                marginTop: "1rem",
              }}
            >
              Continue
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Appointment Calendar */}
      <AppointmentCalendar
        isOpen={showAppointment}
        onClose={() => setShowAppointment(false)}
        initialStaffId={appointmentStaffId}
        isAuthenticated={isAuthenticated}
      />

      {/* Staff Directory */}
      <StaffDirectory isOpen={showStaff} onClose={() => setShowStaff(false)} />

      {/* Input */}
      <div className="aone-input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything about real estate..."
          disabled={loading}
          className="glow-on-focus"
          style={{
            flex: 1,
            padding: "0.75rem 1.25rem",
            borderRadius: "999px",
            border: "1px solid #ddd",
            fontSize: "1rem",
            outline: "none",
            transition: "all 0.2s",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        />
        <button
          onClick={handleSend}
          className="aone-send-button"
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() ? "linear-gradient(to right, #FF6B00, #ff8642)" : "#ccc",
            color: "white",
            cursor: input.trim() ? "pointer" : "not-allowed",
            boxShadow: input.trim() ? "0 4px 10px rgba(255, 107, 0, 0.3)" : "none",
          }}
        >
          <FiSend />
        </button>
      </div>
    </div>
  )
}
