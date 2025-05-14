"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiMessageCircle,
  FiArrowRight,
  FiMenu,
  FiX,
  FiMapPin,
  FiStar,
  FiPhone,
  FiMail,
} from "react-icons/fi"
import StaffDirectory from "@/components/StaffDirectory"
import AppointmentCalendar from "../components/AppointmentCalender"
import ChatAssistant from "@/components/ChatAssistant"
import AuthModal from "@/components/AuthModal"
import "@/styles/globals.css"

// Market stats data
const marketStats = [
  { label: "Properties Sold", value: "1,200+", icon: FiHome },
  { label: "Client Satisfaction", value: "98%", icon: FiStar },
  { label: "Years in Business", value: "15+", icon: FiCalendar },
  { label: "Adelaide Suburbs", value: "30+", icon: FiMapPin },
]

export default function Page() {
  const [showStaff, setShowStaff] = useState(false)
  const [showAppointment, setShowAppointment] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleChatClick = () => {
    if (isAuthenticated) {
      setShowChat(true)
    } else {
      setShowAuthModal(true)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setShowAuthModal(false)
    setShowChat(true)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 p-4 bg-[#012169] shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiHome className="text-white text-2xl" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">A One Real Estate</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setShowStaff(true)}
              className="text-white hover:text-[#FF6B00] transition-colors flex items-center gap-2"
            >
              <FiUsers /> Our Team
            </button>
            <button
              onClick={() => setShowAppointment(true)}
              className="text-white hover:text-[#FF6B00] transition-colors flex items-center gap-2"
            >
              <FiCalendar /> Book Appointment
            </button>
            <button
              onClick={handleChatClick}
              className="bg-[#FF6B00] hover:bg-[#ff8642] text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
            >
              <FiMessageCircle /> Let's Chat
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white text-2xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-[72px] left-0 right-0 z-30 bg-[#012169] shadow-lg"
          >
            <div className="container mx-auto py-4 flex flex-col gap-4">
              <button
                onClick={() => {
                  setShowStaff(true)
                  setMobileMenuOpen(false)
                }}
                className="text-white hover:text-[#FF6B00] transition-colors flex items-center gap-2 p-3"
              >
                <FiUsers /> Our Team
              </button>
              <button
                onClick={() => {
                  setShowAppointment(true)
                  setMobileMenuOpen(false)
                }}
                className="text-white hover:text-[#FF6B00] transition-colors flex items-center gap-2 p-3"
              >
                <FiCalendar /> Book Appointment
              </button>
              <button
                onClick={() => {
                  handleChatClick()
                  setMobileMenuOpen(false)
                }}
                className="bg-[#FF6B00] hover:bg-[#ff8642] text-white px-4 py-3 rounded-lg transition-all flex items-center gap-2"
              >
                <FiMessageCircle /> Let's Chat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1">
        {showChat ? (
          <div className="w-full h-[calc(100vh-72px)] bg-white overflow-hidden flex flex-col">
            <ChatAssistant onClose={() => setShowChat(false)} />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-[#012169] to-[#1a3a7e] text-white py-24 md:py-32">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/012169/012169')] opacity-20 bg-cover bg-center"></div>
              </div>
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  >
                    Adelaide's Trusted Real Estate Partner
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-white/90"
                  >
                    Personalized property solutions with expert guidance every step of the way.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4 justify-center pt-6"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAppointment(true)}
                      className="bg-[#FF6B00] hover:bg-[#ff8642] text-white px-6 py-3 rounded-lg shadow-lg transition-all flex items-center gap-2 text-lg font-medium"
                    >
                      Book a Consultation <FiArrowRight />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleChatClick}
                      className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg shadow-lg transition-all flex items-center gap-2 text-lg font-medium"
                    >
                      Chat with Emma <FiMessageCircle />
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  {marketStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white p-8 rounded-xl shadow-sm text-center"
                    >
                      <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-[#012169]/10 text-[#012169] rounded-full">
                        <stat.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-3xl font-bold text-[#012169]">{stat.value}</h3>
                      <p className="text-gray-600">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Services Section */}
            <section className="py-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#012169] mb-4">Our Services</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Comprehensive real estate solutions tailored to your needs
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
                  >
                    <div className="bg-[#FF6B00] w-14 h-14 rounded-full flex items-center justify-center mb-6">
                      <FiHome className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-[#012169]">Property Sales</h3>
                    <p className="text-gray-600 mb-6">
                      Expert guidance through every step of selling your property, from valuation to settlement.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
                  >
                    <div className="bg-[#FF6B00] w-14 h-14 rounded-full flex items-center justify-center mb-6">
                      <FiUsers className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-[#012169]">Property Management</h3>
                    <p className="text-gray-600 mb-6">
                      Comprehensive management services to maximize your investment returns and minimize stress.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
                  >
                    <div className="bg-[#FF6B00] w-14 h-14 rounded-full flex items-center justify-center mb-6">
                      <FiStar className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-[#012169]">Investment Advisory</h3>
                    <p className="text-gray-600 mb-6">
                      Strategic advice to help you build and optimize your property investment portfolio.
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-[#012169]">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center text-white">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Property?</h2>
                  <p className="text-white/80 text-lg mb-8">
                    Whether you're buying, selling, or investing, our team of experts is here to help you every step of
                    the way.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAppointment(true)}
                      className="bg-[#FF6B00] hover:bg-[#ff8642] text-white px-6 py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-lg font-medium"
                    >
                      <FiCalendar /> Schedule a Consultation
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowStaff(true)}
                      className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-lg font-medium"
                    >
                      <FiUsers /> Meet Our Team
                    </motion.button>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <FiHome className="text-[#FF6B00] text-2xl" />
                      <h3 className="text-xl font-bold">A One Real Estate</h3>
                    </div>
                    <p className="text-gray-400 mb-4">Your trusted partner in Adelaide real estate since 2008.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          Home
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          Our Team
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          Services
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4">Contact</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-3">
                        <FiPhone className="text-[#FF6B00]" />
                        <a href="tel:+61812345678" className="text-gray-400 hover:text-white transition-colors">
                          +61 8 1234 5678
                        </a>
                      </li>
                      <li className="flex items-center gap-3">
                        <FiMail className="text-[#FF6B00]" />
                        <a
                          href="mailto:info@aonerealestate.com.au"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          info@aonerealestate.com.au
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                  <p>&copy; {new Date().getFullYear()} A One Real Estate. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </>
        )}
      </main>

      {/* Modals */}
      <StaffDirectory isOpen={showStaff} onClose={() => setShowStaff(false)} />
      <AppointmentCalendar
        isOpen={showAppointment}
        onClose={() => setShowAppointment(false)}
        isAuthenticated={isAuthenticated}
        onAuthRequired={() => setShowAuthModal(true)}
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
    </div>
  )
}