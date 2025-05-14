"use client";

import type React from "react";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
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
  FiArrowRight,
  FiInfo,
  FiCalendar,
  FiMinimize2,
  FiMapPin,
  FiBriefcase,
  FiTrendingUp,
  FiCheckCircle,
  FiEdit,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import StaffDirectory from "./StaffDirectory"; // Assuming these exist
import AppointmentCalendar from "./AppointmentCalender"; // Assuming these exist

// --- Interfaces ---
interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  loading?: boolean;
  suggested?: boolean;
}

interface UserData {
  name: string;
  preference: "property-management" | "sales" | "investment" | null;
  propertyAddress?: string; // Added property address
  email?: string;
  phone?: string;
}

interface Property {
  address: string;
  type: "house" | "apartment" | "commercial";
  bedrooms?: number;
  bathrooms?: number;
  price?: number;
  description: string;
  imageUrl: string;
}

// --- Mock Data ---
const mockProperties: Property[] = [
  {
    address: "123 Main St, Adelaide",
    type: "house",
    bedrooms: 3,
    bathrooms: 2,
    price: 750000,
    description: "Charming family home in a great location.",
    imageUrl:
      "https://via.placeholder.com/400x300/007BFF/FFFFFF?text=House+1",
  },
  {
    address: "456 Oak Ave, Adelaide",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    price: 450000,
    description: "Modern apartment with city views.",
    imageUrl:
      "https://via.placeholder.com/400x300/007BFF/FFFFFF?text=Apartment+1",
  },
  {
    address: "789 Business Rd, Adelaide",
    type: "commercial",
    price: 1200000,
    description: "Spacious commercial property, perfect for offices.",
    imageUrl:
      "https://via.placeholder.com/400x300/007BFF/FFFFFF?text=Commercial+1",
  },
  {
    address: "321 Pine Ln, Adelaide",
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
    price: 920000,
    description: "Elegant house with a large garden.",
    imageUrl:
      "https://via.placeholder.com/400x300/007BFF/FFFFFF?text=House+2",
  },
];

// --- Helper Functions ---
const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return "Price Upon Request";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
};

// --- Components ---

// Enhanced Mock AI response function
const getAIResponseEnhanced = async (
  messages: any[],
  userData: UserData,
  properties: Property[]
) => {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1500 + 750));

  const userMessage = messages[messages.length - 1].content.toLowerCase();
  const userName = userData.name.trim();

  const suggestQuestion = (question: string) => ({
    id: crypto.randomUUID(),
    content: question,
    isBot: true,
    timestamp: new Date(),
    suggested: true,
  });

  const findProperties = (query: string): Property[] => {
    const keywords = query.split(" ");
    return properties.filter((property) =>
      keywords.some((keyword) =>
        Object.values(property).some((val) =>
          typeof val === "string" && val.toLowerCase().includes(keyword)
        )
      )
    );
  };

  if (userMessage.includes("hello") || userMessage.includes("hi")) {
    const greeting = userName
      ? `Hey ${userName}! 👋 Ready to explore Adelaide's real estate with me, Emma? What's on your mind today?`
      : `Hello there! 👋 I'm Emma, your A One Real Estate assistant. What exciting real estate journey are you embarking on today?`;
    return greeting;
  }

  if (
    userMessage.includes("property") ||
    userMessage.includes("house") ||
    userMessage.includes("apartment")
  ) {
    if (!userName || !userData.preference) {
      return "Ah, the exciting world of properties! To tailor my assistance, could you tell me your name and if you're interested in property management, sales, or investment?";
    }
    const found = findProperties(userMessage);
    if (found.length > 0) {
      const propertyList = found
        .map(
          (p) =>
            `${p.type} at ${p.address} for ${formatCurrency(p.price)}`
        )
        .join(", ");
      return `Great news, ${userName}! I found these matching properties: ${propertyList}.  Would you like more details on any of these, or should we refine your search?`;
    }
    return `Fantastic! Based on your interest in ${userData.preference?.replace(
      "-",
      " "
    )}, and knowing you, ${userName}, what specific aspects are you curious about? Perhaps a specific suburb, property type, or price range?`;
  }

  if (userMessage.includes("investment")) {
    if (!userName || !userData.preference) {
      return "Smart move considering investment! To give you the best advice, could you share your name and your investment focus?";
    }
    return `Excellent, ${userName}! Investing in Adelaide can be quite rewarding. Are you looking at residential, commercial, or perhaps something else? Let's delve into your goals.  Have you considered a specific address or location for your investment?`;
  }

  if (userMessage.includes("rent") || userMessage.includes("lease")) {
    if (!userName || !userData.preference) {
      return "Looking for a new place to call home? To help me narrow down the options, could you tell me your name and what you're looking for in a rental?";
    }
    return `Right then, ${userName}! Finding the perfect rental is key. Are you interested in houses or apartments, and what areas of Adelaide are you considering? Do you have a specific address in mind?`;
  }

  if (
    userMessage.includes("calendar") ||
    userMessage.includes("sync") ||
    userMessage.includes("google calendar")
  ) {
    return "Staying organized is crucial! Yes, you can easily sync your appointments with Google Calendar or iCal. Would you like a quick guide on how to set that up?";
  }

  if (!userName || !userData.preference) {
    return `Thanks for reaching out! To make sure I provide the most relevant information, could you quickly tell me your name and whether you're interested in property management, sales, or investment?`;
  }

  const preferenceText = userData.preference.replace("-", " ");
  const intelligentFallbackResponses = [
    `So, ${userName}, focusing on ${preferenceText}, are there any specific questions I can answer for you right now?  Perhaps regarding a particular address?`,
    `Considering your interest in ${preferenceText}, ${userName}, would you like to explore some recent market trends or perhaps success stories in this area?  Do you have a property address you'd like to discuss?`,
    `Got it, ${userName}! For ${preferenceText}, what's the most pressing question you have today?  Or, are you looking for information on a specific property?`,
  ];
  return intelligentFallbackResponses[
    Math.floor(Math.random() * intelligentFallbackResponses.length)
  ];
};

interface ChatAssistantProps {
  onClose?: () => void;
  isAuthenticated?: boolean;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({
  onClose,
  isAuthenticated = true,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userData, setUserData] = useState<UserData>({
    name: "",
    preference: null,
    propertyAddress: "",
    email: "",
    phone: "",
  });
  const [showStaff, setShowStaff] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAppointment, setShowAppointment] = useState(false);
  const [appointmentStaffId, setAppointmentStaffId] =
    useState<number | null>(null);
  const [minimized, setMinimized] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<Message[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

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
    6. If the user provides a property address, store it and use it in subsequent responses.
  `,
    []
  );

  // Initial engaging message
  useEffect(() => {
    const initialMessage = {
      id: "welcome",
      content: `Hi there! 👋 I'm Emma, your A One Real Estate assistant.  Are you looking into property management, sales, or perhaps exploring investment opportunities in Adelaide today?`,
      isBot: true,
      timestamp: new Date(),
    };
    const firstSuggestion = {
      id: "suggest-1",
      content: "Tell me about property management.",
      isBot: true,
      timestamp: new Date(),
      suggested: true,
    };
    setMessages([initialMessage]);
    setSuggestedQuestions([firstSuggestion]);
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => {
      const container = chatRef.current;
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      setIsNearBottom(scrollTop + clientHeight >= scrollHeight - 100);
    };
    const container = chatRef.current;
    container?.addEventListener("scroll", onScroll);
    return () => container?.removeEventListener("scroll", onScroll);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showStaff, isNearBottom]);

  // Autofocus on form
  useEffect(() => {
    if (showForm) {
      nameInputRef.current?.focus();
    }
  }, [showForm]);

  // Handle sending a message
  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    if (showWelcome) {
      setShowWelcome(false);
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      content: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setSuggestedQuestions([]);

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
      ]);
    }, 300);

    try {
      const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.isBot ? "assistant" : "user",
          content: m.content,
        })),
        { role: "user", content: input },
      ];

      const aiResponse = await getAIResponseEnhanced(
        formattedMessages,
        userData,
        mockProperties
      );
      const botMsg: Message = {
        id: crypto.randomUUID(),
        content: aiResponse || "I'm having trouble responding.",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev.filter((m) => m.id !== "typing"), botMsg]);

      if (
        !userData.name ||
        !userData.preference ||
        /name|prefer|service|details/i.test(aiResponse || "")
      ) {
        setTimeout(() => setShowForm(true), 800);
      } else if (isNearBottom && userData.name && userData.preference) {
        const preference = userData.preference.replace("-", " ");
        const followUpQuestions = [
          `Show me properties related to ${preference}.`,
          `Tell me more about ${preference} in Adelaide.`,
          `What are the current market trends for ${preference}?`,
          `Can you connect me with a specialist in ${preference}?`,
        ];
        const newSuggestions = followUpQuestions.map(suggestQuestion);
        setTimeout(() => setSuggestedQuestions(newSuggestions), 1200);
      }
    } catch (err) {
      console.error("AI Error:", err);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "typing"),
        {
          id: crypto.randomUUID(),
          content: "⚠️ I'm having trouble responding. Please try again shortly.",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, systemPrompt, userData, isNearBottom]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  // Handle form input change
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!userData.name.trim()) {
      setFormError("Please enter your full name");
      nameInputRef.current?.focus();
      return;
    }

    if (!userData.preference) {
      setFormError("Please select a service preference");
      return;
    }

    if (!userData.email) {
      setFormError("Please enter your email address");
      return;
    }

    if (!userData.phone) {
      setFormError("Please enter your phone number");
      return;
    }

    try {
      formRef.current?.classList.add("submitting");
      await new Promise((res) => setTimeout(res, 500));

      let responseMessage = `Thanks ${userData.name}! 🎉 I've noted your interest in ${userData.preference.replace(
        "-",
        " "
      )}. `;
      if (userData.propertyAddress) {
        responseMessage += `I have also recorded the property address: ${userData.propertyAddress}. `;
      }
      responseMessage += "How can I further assist you today?";

      const thankYouMessage: Message = {
        id: crypto.randomUUID(),
        content: responseMessage,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, thankYouMessage]);
      setShowForm(false);
      setIsEditing(false); // Ensure form is not in edit mode after submit

      const immediateSuggestions = [
        `Show me properties related to ${userData.preference}.`,
        `Tell me about your team specializing in ${userData.preference}.`,
        `How can I book an appointment to discuss ${userData.preference}?`,
      ].map(suggestQuestion);
      setTimeout(() => setSuggestedQuestions(immediateSuggestions), 800);
    } catch {
      setFormError("Submission failed. Please try again.");
    } finally {
      formRef.current?.classList.remove("submitting");
    }
  };

  // Handle editing user data
  const handleEdit = () => {
    setIsEditing(true);
    setShowForm(true);
  };

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
    );
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

              <h2 className="text-3xl font-bold mb-4">
                Welcome to A One Real Estate
              </h2>
              <p className="text-white/80 mb-8">
                I'm Emma, your personal real estate assistant. I'm excited to help
                you navigate the Adelaide property market! Tell me, are you
                leaning towards property management, exploring sales, or perhaps
                diving into investment opportunities?
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
              className={`aone-message ${msg.isBot ? "bot" : "user"} ${
                msg.loading ? "loading" : ""
              } ${msg.suggested ? "suggested" : ""}`}
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
                ) : msg.suggested ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggestionClick(msg.content)}
                    className="suggestion-button"
                  >
                    {msg.content}
                  </motion.button>
                ) : (
                  <p style={{ lineHeight: "1.5" }}>{msg.content}</p>
                )}
                <time
                  className="message-time"
                  title={msg.timestamp.toLocaleString()}
                >
                  <FiClock style={{ width: "12px", height: "12px" }} />
                  {msg.timestamp.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {suggestedQuestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="aone-message bot suggested"
            >
              <div className="message-content">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuggestionClick(suggestion.content)}
                  className="suggestion-button"
                >
                  {suggestion.content}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* CTA buttons */}
        {userData.preference && (
          <motion.div
            className="aone-cta-container"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
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
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setShowAppointment(true)}
                                  className="bg-[#FF6B00] hover:bg-[#ff8642] text-white px-6 py-3 rounded-lg shadow-lg transition-all flex items-center gap-2 text-lg font-medium"
                                >
                                  Book a Consultation <FiArrowRight />
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
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
              }}
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
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {isEditing ? "Edit Your Information" : "Tell us about you"}
              </h2>
              <p style={{ color: "#666" }}>
                {isEditing
                  ? "Update your details below"
                  : "We'll connect you with the right expert"}
              </p>
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
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
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
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="glow-on-focus"
                  required
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
                <label
                  htmlFor="phone"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className="glow-on-focus"
                  required
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
                <label
                  htmlFor="propertyAddress"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Property Address (Optional)
                </label>
                <input
                  id="propertyAddress"
                  type="text"
                  name="propertyAddress"
                  value={userData.propertyAddress}
                  onChange={handleInputChange}
                  className="glow-on-focus"
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
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Service Needed
                </label>
                <div className="radio-grid">
                  {[
                    {
                      value: "property-management",
                      label: "Property Management",
                    },
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
                        border:
                          userData.preference === option.value
                            ? "2px solid #012169"
                            : "1px solid #ddd",
                        background:
                          userData.preference === option.value
                            ? "rgba(1, 33, 105, 0.05)"
                            : "white",
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
                          setUserData({
                            ...userData,
                            preference:
                              option.value as UserData["preference"],
                          })
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
                            border:
                              userData.preference === option.value
                                ? "5px solid #012169"
                                : "2px solid #ddd",
                            transition: "all 0.2s",
                          }}
                        />
                        <span style={{ textAlign: "center", fontSize: "0.9rem" }}>
                          {option.label}
                        </span>
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
            <div className="form-actions" style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
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
                }}
              >
                {isEditing ? (
                  <>
                    <FiCheckCircle className="mr-2" /> Update Information
                  </>
                ) : (
                  "Continue"
                )}
              </motion.button>
              {isEditing && (
                <motion.button
                  type="button"
                  className="aone-form-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setShowForm(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: "#e5e7eb",
                    color: "#374151",
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <FiX className="mr-2" /> Cancel
                </motion.button>
              )}
            </div>
            {!isEditing && userData.name && userData.preference && (
              <button
                type="button"
                onClick={handleEdit}
                className="edit-button"
                style={{
                  marginTop: "1rem",
                  color: "#012169",
                  textDecoration: "underline",
                  cursor: "pointer",
                  display: "block",
                  textAlign: "center",
                  fontSize: "0.9rem",
                }}
              >
                <FiEdit className="inline-block mr-1" /> Edit your information
              </button>
            )}
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
            background: input.trim()
              ? "linear-gradient(to right, #FF6B00, #ff8642)"
              : "#ccc",
            color: "white",
            cursor: input.trim() ? "pointer" : "not-allowed",
            boxShadow: input.trim() ? "0 4px 10px rgba(255, 107, 0, 0.3)" : "none",
          }}
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
