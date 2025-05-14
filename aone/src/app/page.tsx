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
  FiSearch,
  FiPhone,
  FiCheck,
  FiMail,
} from "react-icons/fi"
import StaffDirectory from "@/components/StaffDirectory"
import AppointmentCalendar from "../components/AppointmentCalender"
import ChatAssistant from "@/components/ChatAssistant"
import AuthModal from "@/components/AuthModal"
import "@/styles/globals.css"

// Featured properties data
const featuredProperties = [
  {
    id: 1,
    title: "Luxury Waterfront Villa",
    address: "42 Esplanade, Henley Beach",
    price: "$1,850,000",
    bedrooms: 4,
    bathrooms: 3,
    area: "320m²",
    image: "https://placehold.co/600x400/012169/FFF?text=Luxury+Villa",
    tags: ["Premium", "Waterfront"],
  },
  {
    id: 2,
    title: "Modern City Apartment",
    address: "15 Waymouth St, Adelaide CBD",
    price: "$695,000",
    bedrooms: 2,
    bathrooms: 2,
    area: "110m²",
    image: "https://placehold.co/600x400/012169/FFF?text=City+Apartment",
    tags: ["New", "City View"],
  },
  {
    id: 3,
    title: "Family Home with Garden",
    address: "28 Prospect Rd, Prospect",
    price: "$875,000",
    bedrooms: 4,
    bathrooms: 2,
    area: "220m²",
    image: "https://placehold.co/600x400/012169/FFF?text=Family+Home",
    tags: ["Garden", "Renovated"],
  },
]

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "James Wilson",
    role: "Property Investor",
    quote:
      "A One Real Estate helped me build a portfolio of high-performing investment properties. Their market knowledge is unmatched.",
    image: "https://placehold.co/100x100/012169/FFF?text=JW",
  },
  {
    id: 2,
    name: "Sarah Thompson",
    role: "First Home Buyer",
    quote:
      "As a first-time buyer, I was nervous about the process. The team at A One made everything simple and stress-free.",
    image: "https://placehold.co/100x100/012169/FFF?text=ST",
  },
  {
    id: 3,
    name: "David Chen",
    role: "Property Developer",
    quote:
      "We've partnered with A One on multiple development projects. Their expertise and professionalism are why we keep coming back.",
    image: "https://placehold.co/100x100/012169/FFF?text=DC",
  },
]

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
  const [activeTestimonial, setActiveTestimonial] = useState(0)

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
            <section className="relative bg-gradient-to-r from-[#012169] to-[#1a3a7e] text-white py-16 md:py-24">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/012169/012169')] opacity-20 bg-cover bg-center"></div>
              </div>
              <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                    >
                      Find Your Dream Home in Adelaide
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg md:text-xl text-white/90 max-w-lg"
                    >
                      A One Real Estate provides personalized property solutions with expert guidance every step of the
                      way.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap gap-4 pt-4"
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

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="hidden lg:block"
                  >
                    <div className="bg-white p-6 rounded-xl shadow-xl">
                      <h3 className="text-[#012169] font-bold text-xl mb-4">Find Your Property</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 mb-2 text-sm">Location</label>
                          <div className="relative">
                            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#012169] focus:border-transparent transition-colors text-gray-700">
                              <option>Adelaide CBD</option>
                              <option>North Adelaide</option>
                              <option>Glenelg</option>
                              <option>Prospect</option>
                              <option>Norwood</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 text-sm">Property Type</label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#012169] focus:border-transparent transition-colors text-gray-700">
                              <option>Any</option>
                              <option>House</option>
                              <option>Apartment</option>
                              <option>Townhouse</option>
                              <option>Land</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 text-sm">Price Range</label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#012169] focus:border-transparent transition-colors text-gray-700">
                              <option>Any</option>
                              <option>$300k - $500k</option>
                              <option>$500k - $750k</option>
                              <option>$750k - $1M</option>
                              <option>$1M+</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 text-sm">Beds</label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#012169] focus:border-transparent transition-colors text-gray-700">
                              <option>Any</option>
                              <option>1+</option>
                              <option>2+</option>
                              <option>3+</option>
                              <option>4+</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 text-sm">Baths</label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#012169] focus:border-transparent transition-colors text-gray-700">
                              <option>Any</option>
                              <option>1+</option>
                              <option>2+</option>
                              <option>3+</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 text-sm">Parking</label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#012169] focus:border-transparent transition-colors text-gray-700">
                              <option>Any</option>
                              <option>1+</option>
                              <option>2+</option>
                            </select>
                          </div>
                        </div>

                        <button className="w-full bg-[#FF6B00] hover:bg-[#ff8642] text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
                          <FiSearch /> Search Properties
                        </button>
                      </div>
                    </div>
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
                      className="bg-white p-6 rounded-xl shadow-sm text-center"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-[#012169]/10 text-[#012169] rounded-full">
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-3xl font-bold text-[#012169]">{stat.value}</h3>
                      <p className="text-gray-600">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Properties Section */}
            <section className="py-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#012169] mb-4">Featured Properties</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover our handpicked selection of premium properties across Adelaide's most sought-after
                    locations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={property.image || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          {property.tags.map((tag, i) => (
                            <span key={i} className="bg-[#FF6B00] text-white text-xs px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="absolute bottom-4 right-4 bg-[#012169] text-white font-bold px-4 py-2 rounded-lg">
                          {property.price}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[#012169] mb-2">{property.title}</h3>
                        <div className="flex items-center text-gray-600 mb-4">
                          <FiMapPin className="mr-2" />
                          <span>{property.address}</span>
                        </div>

                        <div className="flex justify-between border-t border-gray-100 pt-4">
                          <div className="text-center">
                            <span className="block text-gray-500 text-sm">Bedrooms</span>
                            <span className="font-bold text-gray-700">{property.bedrooms}</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-gray-500 text-sm">Bathrooms</span>
                            <span className="font-bold text-gray-700">{property.bathrooms}</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-gray-500 text-sm">Area</span>
                            <span className="font-bold text-gray-700">{property.area}</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-6">
                        <button className="w-full bg-[#012169] hover:bg-[#1a3a7e] text-white py-3 rounded-lg transition-colors">
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <button className="bg-white border-2 border-[#012169] text-[#012169] hover:bg-[#012169] hover:text-white px-6 py-3 rounded-lg transition-colors font-medium">
                    View All Properties
                  </button>
                </div>
              </div>
            </section>

            {/* Services Section */}
            <section className="py-16 bg-gradient-to-r from-[#012169] to-[#1a3a7e] text-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
                  <p className="text-white/80 max-w-2xl mx-auto">
                    Comprehensive real estate solutions tailored to your needs
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20"
                  >
                    <div className="bg-[#FF6B00] w-14 h-14 rounded-full flex items-center justify-center mb-6">
                      <FiHome className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Property Sales</h3>
                    <p className="text-white/80 mb-6">
                      Expert guidance through every step of selling your property, from valuation to settlement.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#FF6B00]" /> Market analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#FF6B00]" /> Property staging
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#FF6B00]" /> Marketing strategy
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#FF6B00]" /> Negotiation support
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20"
                  >
                    <div className="bg-[#FF6B00] w-14 h-14 rounded-full flex items-center justify-center mb-6">
                      <FiUsers className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Property Management</h3>
                    <p className="text-white/80 mb-6">
                      Comprehensive management services to maximize your investment returns and minimize stress.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#FF6B00]" /> Tenant screening
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#FF6B00]" /> Rent collection
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#FF6B00]" /> Property maintenance
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#FF6B00]" /> Regular inspections
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20"
                  >
                    <div className="bg-[#FF6B00] w-14 h-14 rounded-full flex items-center justify-center mb-6">
                      <FiStar className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Investment Advisory</h3>
                    <p className="text-white/80 mb-6">
                      Strategic advice to help you build and optimize your property investment portfolio.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#FF6B00]" /> Market research
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#FF6B00]" /> Investment strategy
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#FF6B00]" /> Portfolio analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#FF6B00]" /> Growth opportunities
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#012169] mb-4">What Our Clients Say</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Don't just take our word for it. Here's what our clients have to say about their experience with A
                    One Real Estate.
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 text-[#012169] opacity-10">
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11 7V11H9.8C9.8 11.5 10 12 10.4 12.4C10.8 12.8 11.3 13 11.8 13H12C12.6 13 13 13.4 13 14V18C13 18.6 12.6 19 12 19H8C7.4 19 7 18.6 7 18V14C7 12.9 7.4 11.9 8.2 11.1C9 10.3 10 10 11 10V7C11 6.4 11.4 6 12 6C12.6 6 13 6.4 13 7H11ZM21 7V11H19.8C19.8 11.5 20 12 20.4 12.4C20.8 12.8 21.3 13 21.8 13H22C22.6 13 23 13.4 23 14V18C23 18.6 22.6 19 22 19H18C17.4 19 17 18.6 17 18V14C17 12.9 17.4 11.9 18.2 11.1C19 10.3 20 10 21 10V7C21 6.4 21.4 6 22 6C22.6 6 23 6.4 23 7H21Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTestimonial}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col md:flex-row items-center gap-8"
                      >
                        <div className="md:w-1/4 flex-shrink-0">
                          <img
                            src={testimonials[activeTestimonial].image || "/placeholder.svg"}
                            alt={testimonials[activeTestimonial].name}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mx-auto border-4 border-[#012169]"
                          />
                        </div>
                        <div className="md:w-3/4">
                          <p className="text-gray-700 text-lg md:text-xl italic mb-6">
                            "{testimonials[activeTestimonial].quote}"
                          </p>
                          <div>
                            <h4 className="text-[#012169] font-bold text-lg">{testimonials[activeTestimonial].name}</h4>
                            <p className="text-[#FF6B00]">{testimonials[activeTestimonial].role}</p>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-center mt-8 gap-2">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveTestimonial(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            activeTestimonial === index ? "bg-[#FF6B00]" : "bg-gray-300"
                          }`}
                          aria-label={`View testimonial ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <FiHome className="text-[#FF6B00] text-2xl" />
                      <h3 className="text-xl font-bold">A One Real Estate</h3>
                    </div>
                    <p className="text-gray-400 mb-4">Your trusted partner in Adelaide real estate since 2008.</p>
                    <div className="flex gap-4">
                      <a href="#" className="text-white hover:text-[#FF6B00] transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-[#FF6B00] transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-[#FF6B00] transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-[#FF6B00] transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
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
                          Properties
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          Services
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          About Us
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          Contact
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4">Services</h3>
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          Property Sales
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          Property Management
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          Investment Advisory
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          Market Analysis
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          Property Valuation
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <FiMapPin className="text-[#FF6B00] mt-1" />
                        <span className="text-gray-400">123 King William St, Adelaide SA 5000, Australia</span>
                      </li>
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
