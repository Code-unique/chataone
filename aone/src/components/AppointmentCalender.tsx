"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiX,
  FiCalendar,
  FiClock,
  FiUser,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiInfo,
  FiLoader,
  FiDownload,
  FiLink,
} from "react-icons/fi"
import { FaGoogle } from "react-icons/fa"
import AuthModal from "./AuthModal"

// Types
interface StaffMember {
  id: number
  name: string
  role: string
  email: string
  phone: string
  image: string
  location: string
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

interface Appointment {
  id: string
  staffId: number
  date: Date
  timeSlot: string
  name: string
  email: string
  phone: string
  message: string
}

// Mock data for staff members (using the same structure as StaffDirectory)
const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: "Sarah Thompson",
    role: "Senior Property Manager",
    email: "sarah@aonerealestate.com.au",
    phone: "0412 345 678",
    image: "https://placehold.co/400x400/012169/FFF?text=ST",
    location: "Adelaide CBD Office",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Sales Director",
    email: "michael@aonerealestate.com.au",
    phone: "0423 456 789",
    image: "https://placehold.co/400x400/012169/FFF?text=MC",
    location: "North Adelaide Office",
  },
  {
    id: 3,
    name: "Jessica Patel",
    role: "Property Investment Advisor",
    email: "jessica@aonerealestate.com.au",
    phone: "0434 567 890",
    image: "https://placehold.co/400x400/012169/FFF?text=JP",
    location: "Adelaide CBD Office",
  },
]

// Generate time slots from 9 AM to 5 PM
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  for (let hour = 9; hour < 17; hour++) {
    const hourString = hour.toString().padStart(2, "0")

    // Add :00 slot
    slots.push({
      id: `${hourString}:00`,
      time: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`,
      available: Math.random() > 0.3, // Randomly make some slots unavailable
    })

    // Add :30 slot
    slots.push({
      id: `${hourString}:30`,
      time: `${hour > 12 ? hour - 12 : hour}:30 ${hour >= 12 ? "PM" : "AM"}`,
      available: Math.random() > 0.3, // Randomly make some slots unavailable
    })
  }
  return slots
}

export default function AppointmentCalendar({
  isOpen,
  onClose,
  initialStaffId = null,
  isAuthenticated = false,
  onAuthRequired,
}: {
  isOpen: boolean
  onClose: () => void
  initialStaffId?: number | null
  isAuthenticated?: boolean
  onAuthRequired?: () => void
}) {
  // State
  const [selectedStaff, setSelectedStaff] = useState<number | null>(initialStaffId)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots())
  const [step, setStep] = useState<"staff" | "date" | "details" | "confirmation">(initialStaffId ? "date" : "staff")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [calendarSynced, setCalendarSynced] = useState(false)
  const [showCalendarOptions, setShowCalendarOptions] = useState(false)

  // Reset time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots())
      setSelectedTimeSlot(null)
    }
  }, [selectedDate])

  // Calendar functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(newDate)
  }

  const handleTimeSlotClick = (slotId: string) => {
    setSelectedTimeSlot(slotId)
  }

  const handleStaffSelect = (staffId: number) => {
    setSelectedStaff(staffId)
    setStep("date")
  }

  const handleBackClick = () => {
    if (step === "date") {
      if (initialStaffId === null) {
        setStep("staff")
        setSelectedStaff(null)
      }
    } else if (step === "details") {
      setStep("date")
      setSelectedTimeSlot(null)
    } else if (step === "confirmation") {
      resetForm()
    }
  }

  const handleContinueClick = () => {
    if (step === "date" && selectedDate && selectedTimeSlot) {
      if (isAuthenticated) {
        setStep("details")
      } else if (onAuthRequired) {
        onAuthRequired()
      } else {
        setShowAuthModal(true)
      }
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    setStep("details")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (selectedStaff && selectedDate && selectedTimeSlot) {
        const newAppointment: Appointment = {
          id: crypto.randomUUID(),
          staffId: selectedStaff,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }

        setAppointments((prev) => [...prev, newAppointment])
        setStep("confirmation")
        setBookingComplete(true)
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      setFormErrors({ submit: "Failed to book appointment. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedStaff(initialStaffId)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    })
    setFormErrors({})
    setStep(initialStaffId ? "date" : "staff")
    setBookingComplete(false)
    setCalendarSynced(false)
    setShowCalendarOptions(false)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleSyncCalendar = async (type: string) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setCalendarSynced(true)
      setShowCalendarOptions(false)
    } catch (error) {
      console.error("Error syncing calendar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadICS = () => {
    // In a real implementation, this would generate and download an .ics file
    alert("ICS file would be downloaded here")
  }

  const handleCopyLink = () => {
    // In a real implementation, this would copy a link to the appointment
    alert("Appointment link copied to clipboard")
  }

  // Render calendar
  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Add days of the month
    const today = new Date()
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year

      const isPast = date < new Date(today.setHours(0, 0, 0, 0))
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year

      days.push(
        <motion.div
          key={`day-${day}`}
          whileHover={!isPast ? { scale: 1.1 } : {}}
          whileTap={!isPast ? { scale: 0.95 } : {}}
          className={`calendar-day ${isToday ? "today" : ""} ${isPast ? "past" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => !isPast && handleDateClick(day)}
        >
          {day}
        </motion.div>,
      )
    }

    return days
  }

  // Get selected staff member
  const getSelectedStaffMember = () => {
    return staffMembers.find((staff) => staff.id === selectedStaff)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 md:p-8 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <motion.h2
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#012169] to-[#1a3a7e] bg-clip-text text-transparent"
              >
                {step === "staff" && "Schedule an Appointment"}
                {step === "date" && "Select Date & Time"}
                {step === "details" && "Your Details"}
                {step === "confirmation" && "Appointment Confirmed"}
              </motion.h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6 md:mb-8">
              <div className="flex items-center justify-between max-w-md mx-auto relative">
                {["staff", "date", "details", "confirmation"].map((s, index) => (
                  <div key={s} className="flex flex-col items-center z-10">
                    <div
                      className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                        ["staff", "date", "details", "confirmation"].indexOf(step) >= index
                          ? "bg-[#012169] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs mt-1 text-gray-500 hidden md:block">
                      {s === "staff" && "Staff"}
                      {s === "date" && "Date"}
                      {s === "details" && "Details"}
                      {s === "confirmation" && "Confirm"}
                    </span>
                  </div>
                ))}
                <div className="absolute left-0 right-0 flex justify-center h-0.5 bg-gray-200 -z-0"></div>
              </div>
            </div>

            {/* Step 1: Select Staff */}
            {step === "staff" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-gray-600 text-lg mb-6 text-center">
                  Select a team member to schedule an appointment with:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {staffMembers.map((staff) => (
                    <motion.div
                      key={staff.id}
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="bg-white rounded-xl p-4 md:p-6 cursor-pointer hover:shadow-xl transition-all border border-gray-100 relative overflow-hidden"
                      onClick={() => handleStaffSelect(staff.id)}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#012169]/10 to-transparent rounded-bl-full" />

                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[#012169] shadow-md">
                            <img
                              src={staff.image || "/placeholder.svg"}
                              alt={staff.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-[#FF6B00] text-white p-1 rounded-full shadow-md">
                            <FiCalendar className="w-4 h-4" />
                          </div>
                        </div>

                        <h3 className="font-bold text-xl text-gray-800 hover:text-[#012169] transition-colors">
                          {staff.name}
                        </h3>
                        <p className="text-[#FF6B00] font-medium">{staff.role}</p>

                        <div className="flex items-center gap-1 mt-3 text-sm text-gray-600">
                          <FiMapPin className="w-4 h-4" />
                          <span>{staff.location}</span>
                        </div>

                        <button className="mt-4 bg-[#012169] text-white px-4 py-2 rounded-lg hover:bg-[#1a3a7e] transition-colors flex items-center gap-2 text-sm">
                          <FiCalendar />
                          Schedule Appointment
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Date and Time */}
            {step === "date" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {selectedStaff && (
                  <div className="mb-6 flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                    <img
                      src={getSelectedStaffMember()?.image || "/placeholder.svg"}
                      alt={getSelectedStaffMember()?.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#012169]"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{getSelectedStaffMember()?.name}</h3>
                      <p className="text-[#FF6B00]">{getSelectedStaffMember()?.role}</p>
                    </div>
                    {initialStaffId === null && (
                      <button onClick={handleBackClick} className="ml-auto text-sm text-[#012169] hover:underline">
                        Change
                      </button>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Calendar */}
                  <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100">
                        <FiChevronLeft />
                      </button>
                      <h3 className="font-bold text-lg">
                        {currentDate.toLocaleDateString("en-AU", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                      <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100">
                        <FiChevronRight />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    {selectedDate ? (
                      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4">Available Times for {formatDate(selectedDate)}</h3>

                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((slot) => (
                            <motion.button
                              key={slot.id}
                              whileHover={slot.available ? { scale: 1.05 } : {}}
                              whileTap={slot.available ? { scale: 0.95 } : {}}
                              className={`p-3 rounded-lg text-center ${
                                selectedTimeSlot === slot.id
                                  ? "bg-[#012169] text-white"
                                  : slot.available
                                    ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                              disabled={!slot.available}
                              onClick={() => slot.available && handleTimeSlotClick(slot.id)}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <FiClock className="w-4 h-4" />
                                {slot.time}
                              </div>
                            </motion.button>
                          ))}
                        </div>

                        {timeSlots.every((slot) => !slot.available) && (
                          <p className="text-center text-gray-500 mt-4">
                            No available time slots for this date. Please select another date.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center h-full">
                        <FiCalendar className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-center">
                          Please select a date from the calendar to view available time slots.
                        </p>
                      </div>
                    )}

                    {selectedDate && selectedTimeSlot && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 bg-[#FF6B00] text-white w-full py-3 rounded-lg hover:bg-[#ff8642] transition-colors flex items-center justify-center gap-2 font-medium"
                        onClick={handleContinueClick}
                      >
                        Continue to Details
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Enter Details */}
            {step === "details" && selectedStaff && selectedDate && selectedTimeSlot && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-2">Appointment Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <FiUser className="text-[#012169] w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Staff Member</p>
                        <p className="font-medium">{getSelectedStaffMember()?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <FiCalendar className="text-[#012169] w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {selectedDate.toLocaleDateString("en-AU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <FiClock className="text-[#012169] w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleBackClick}
                    className="mt-4 text-sm text-[#012169] hover:underline flex items-center gap-1"
                  >
                    <FiChevronLeft className="w-4 h-4" /> Change date/time
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-4">Your Contact Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${
                          formErrors.name ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012169] focus:border-transparent`}
                        placeholder="Enter your full name"
                      />
                      {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${
                          formErrors.email ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012169] focus:border-transparent`}
                        placeholder="Enter your email"
                      />
                      {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full p-3 border ${
                        formErrors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012169] focus:border-transparent`}
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012169] focus:border-transparent"
                      placeholder="Tell us about your inquiry or any specific requirements"
                    ></textarea>
                  </div>

                  {formErrors.submit && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
                      <FiInfo className="w-5 h-5" />
                      {formErrors.submit}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={handleBackClick}
                      className="py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-[#012169] text-white py-3 px-6 rounded-lg hover:bg-[#1a3a7e] transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="w-5 h-5 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          Book Appointment <FiCalendar className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {step === "confirmation" && bookingComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <FiCheck className="w-12 h-12 text-green-600" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-2">Appointment Confirmed!</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Your appointment has been scheduled successfully. We've sent a confirmation email with all the
                    details.
                  </p>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-md w-full">
                    <h4 className="font-bold text-lg mb-4 text-left">Appointment Details</h4>

                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                      <img
                        src={getSelectedStaffMember()?.image || "/placeholder.svg"}
                        alt={getSelectedStaffMember()?.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#012169]"
                      />
                      <div className="text-left">
                        <p className="font-medium text-lg">{getSelectedStaffMember()?.name}</p>
                        <p className="text-[#FF6B00]">{getSelectedStaffMember()?.role}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <FiCalendar className="text-[#012169] w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">
                            {selectedDate?.toLocaleDateString("en-AU", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <FiClock className="text-[#012169] w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-medium">{timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <FiMapPin className="text-[#012169] w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{getSelectedStaffMember()?.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Sync Options */}
                  {!calendarSynced ? (
                    <div className="mb-6">
                      <button
                        onClick={() => setShowCalendarOptions(!showCalendarOptions)}
                        className="bg-[#012169] text-white px-6 py-3 rounded-lg hover:bg-[#1a3a7e] transition-colors flex items-center gap-2 mx-auto"
                      >
                        <FiCalendar /> Sync with Calendar
                      </button>

                      <AnimatePresence>
                        {showCalendarOptions && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 bg-white p-4 rounded-xl border border-gray-200 overflow-hidden"
                          >
                            <p className="text-gray-600 mb-4 text-sm">Choose your calendar service:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <button
                                onClick={() => handleSyncCalendar("google")}
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                {isSubmitting ? (
                                  <FiLoader className="animate-spin" />
                                ) : (
                                  <FaGoogle className="text-[#4285F4]" />
                                )}
                                <span>Google Calendar</span>
                              </button>
                              <button
                                onClick={() => handleSyncCalendar("outlook")}
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                {isSubmitting ? (
                                  <FiLoader className="animate-spin" />
                                ) : (
                                  <FiCalendar className="text-[#0078D4]" />
                                )}
                                <span>Outlook Calendar</span>
                              </button>
                              <button
                                onClick={handleDownloadICS}
                                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <FiDownload />
                                <span>Download .ics File</span>
                              </button>
                              <button
                                onClick={handleCopyLink}
                                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <FiLink />
                                <span>Copy Calendar Link</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="mb-6 bg-green-50 p-4 rounded-xl border border-green-200 flex items-center gap-3 max-w-md mx-auto">
                      <div className="bg-green-100 p-2 rounded-full">
                        <FiCheck className="text-green-600 w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-green-800">Calendar Synced Successfully</p>
                        <p className="text-green-600 text-sm">Your appointment has been added to your calendar</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetForm}
                      className="bg-white border border-[#012169] text-[#012169] py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiCalendar /> Book Another Appointment
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="bg-[#FF6B00] text-white py-3 px-6 rounded-lg hover:bg-[#ff8642] transition-colors flex items-center justify-center gap-2"
                    >
                      <FiCheck /> Done
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
    </AnimatePresence>
  )
}
