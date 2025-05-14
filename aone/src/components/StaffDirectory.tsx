"use client"

import { AnimatePresence, motion } from "framer-motion"
import { FiX, FiMail, FiPhone, FiLinkedin, FiMapPin, FiAward, FiMessageCircle, FiCalendar } from "react-icons/fi"
import { useState } from "react"
import AppointmentCalendar from "./AppointmentCalender"

// Expanded staff data with more details
const staffMembers = [
  {
    id: 1,
    name: "Sarah Thompson",
    role: "Senior Property Manager",
    email: "sarah@aonerealestate.com.au",
    phone: "0412 345 678",
    experience: "10+ years in property management",
    specialties: ["Residential Leasing", "Property Maintenance", "Tenant Relations"],
    location: "Adelaide CBD Office",
    linkedin: "https://linkedin.com/in/sarah-thompson",
    image: "https://placehold.co/400x400/012169/FFF?text=ST",
    bio: "Sarah has extensive experience in Adelaide's property market and specializes in helping property owners maximize their investment returns while ensuring tenant satisfaction.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Sales Director",
    email: "michael@aonerealestate.com.au",
    phone: "0423 456 789",
    experience: "Adelaide property specialist since 2012",
    specialties: ["Luxury Properties", "Investment Properties", "First Home Buyers"],
    location: "North Adelaide Office",
    linkedin: "https://linkedin.com/in/michael-chen",
    image: "https://placehold.co/400x400/012169/FFF?text=MC",
    bio: "Michael has consistently ranked among Adelaide's top 1% of real estate agents, with particular expertise in the eastern and northern suburbs luxury market.",
  },
  {
    id: 3,
    name: "Jessica Patel",
    role: "Property Investment Advisor",
    email: "jessica@aonerealestate.com.au",
    phone: "0434 567 890",
    experience: "8 years in property investment",
    specialties: ["Investment Strategy", "Portfolio Management", "Market Analysis"],
    location: "Adelaide CBD Office",
    linkedin: "https://linkedin.com/in/jessica-patel",
    image: "https://placehold.co/400x400/012169/FFF?text=JP",
    bio: "Jessica helps investors build and optimize their property portfolios with a data-driven approach to market analysis and investment strategy.",
  },
]

export default function StaffDirectory({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [showAppointment, setShowAppointment] = useState(false)
  const [appointmentStaffId, setAppointmentStaffId] = useState<number | null>(null)

  const filteredStaff =
    filter === "all"
      ? staffMembers
      : staffMembers.filter(
          (member) =>
            member.role.toLowerCase().includes(filter) ||
            member.specialties.some((s) => s.toLowerCase().includes(filter)),
        )

  const handleStaffClick = (id: number) => {
    setSelectedStaff(id)
  }

  const handleBackClick = () => {
    setSelectedStaff(null)
  }

  const handleBookAppointment = (staffId: number) => {
    setAppointmentStaffId(staffId)
    setShowAppointment(true)
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
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100"
          >
            <div className="flex justify-between items-center mb-8">
              <motion.h2
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-3xl font-bold bg-gradient-to-r from-[#012169] to-[#1a3a7e] bg-clip-text text-transparent"
              >
                {selectedStaff === null ? "Our Dedicated Team" : "Team Member Profile"}
              </motion.h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {selectedStaff === null ? (
              <>
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === "all"
                          ? "bg-gradient-to-r from-[#012169] to-[#1a3a7e] text-white shadow-md"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      All Team
                    </button>
                    <button
                      onClick={() => setFilter("property")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === "property"
                          ? "bg-gradient-to-r from-[#012169] to-[#1a3a7e] text-white shadow-md"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      Property Management
                    </button>
                    <button
                      onClick={() => setFilter("sales")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === "sales"
                          ? "bg-gradient-to-r from-[#012169] to-[#1a3a7e] text-white shadow-md"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      Sales
                    </button>
                    <button
                      onClick={() => setFilter("investment")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === "investment"
                          ? "bg-gradient-to-r from-[#012169] to-[#1a3a7e] text-white shadow-md"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      Investment
                    </button>
                  </div>

                  <p className="text-gray-600 text-lg">
                    Connect with our specialists to get personalized assistance with your real estate needs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredStaff.map((member) => (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all border border-gray-100 relative overflow-hidden group"
                      onClick={() => handleStaffClick(member.id)}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#012169]/10 to-transparent rounded-bl-full" />

                      <div className="flex gap-5">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#012169] shadow-md">
                            <img
                              src={member.image || "/placeholder.svg"}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-[#FF6B00] text-white p-1 rounded-full shadow-md">
                            <FiMessageCircle className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-800 group-hover:text-[#012169] transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-[#FF6B00] font-medium">{member.role}</p>
                          <p className="text-gray-600 text-sm mt-1">{member.experience}</p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {member.specialties.slice(0, 2).map((specialty, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                {specialty}
                              </span>
                            ))}
                            {member.specialties.length > 2 && (
                              <span className="text-xs text-gray-500">+{member.specialties.length - 2} more</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 mt-3 text-sm text-[#012169]">
                            <FiMail className="w-4 h-4" />
                            <a
                              href={`mailto:${member.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="hover:underline"
                            >
                              {member.email}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#012169] to-[#FF6B00] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div>
                {staffMembers
                  .filter((s) => s.id === selectedStaff)
                  .map((staff) => (
                    <motion.div
                      key={staff.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="animate-fadeIn"
                    >
                      <button
                        onClick={handleBackClick}
                        className="mb-6 flex items-center gap-2 text-[#012169] hover:underline bg-gray-50 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100"
                      >
                        ← Back to team
                      </button>

                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#012169]/20 to-transparent rounded-xl" />
                            <img
                              src={staff.image || "/placeholder.svg"}
                              alt={staff.name}
                              className="w-full aspect-square object-cover rounded-xl shadow-lg"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-[#012169] shadow-md">
                              {staff.role.split(" ")[0]}
                            </div>
                          </div>

                          <div className="mt-6 space-y-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-100 p-2 rounded-full">
                                <FiMapPin className="text-[#012169] w-5 h-5" />
                              </div>
                              <span className="text-gray-700">{staff.location}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-100 p-2 rounded-full">
                                <FiPhone className="text-[#012169] w-5 h-5" />
                              </div>
                              <a href={`tel:${staff.phone}`} className="text-[#012169] hover:underline">
                                {staff.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-100 p-2 rounded-full">
                                <FiMail className="text-[#012169] w-5 h-5" />
                              </div>
                              <a href={`mailto:${staff.email}`} className="text-[#012169] hover:underline">
                                {staff.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-100 p-2 rounded-full">
                                <FiLinkedin className="text-[#012169] w-5 h-5" />
                              </div>
                              <a
                                href={staff.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#012169] hover:underline"
                              >
                                LinkedIn Profile
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="md:w-2/3">
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#012169] to-[#1a3a7e] bg-clip-text text-transparent">
                            {staff.name}
                          </h2>
                          <p className="text-[#FF6B00] font-medium text-xl">{staff.role}</p>

                          <div className="flex items-center gap-2 mt-3">
                            <FiAward className="text-[#FF6B00] w-5 h-5" />
                            <span className="text-gray-700 font-medium">{staff.experience}</span>
                          </div>

                          <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-xl mb-3 text-[#012169]">About</h3>
                            <p className="text-gray-700 leading-relaxed">{staff.bio}</p>
                          </div>

                          <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-xl mb-3 text-[#012169]">Specialties</h3>
                            <div className="flex flex-wrap gap-2">
                              {staff.specialties.map((specialty, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-8 flex gap-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-gradient-to-r from-[#FF6B00] to-[#ff8642] text-white px-6 py-3 rounded-lg shadow-md transition-all flex items-center gap-2 font-medium"
                              onClick={() => (window.location.href = `mailto:${staff.email}`)}
                            >
                              <FiMail />
                              Email {staff.name.split(" ")[0]}
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white text-[#012169] border border-[#012169] px-6 py-3 rounded-lg shadow-sm transition-all flex items-center gap-2 font-medium hover:bg-[#012169] hover:text-white"
                              onClick={() => handleBookAppointment(staff.id)}
                            >
                              <FiCalendar />
                              Book Appointment
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
      <AppointmentCalendar
        isOpen={showAppointment}
        onClose={() => setShowAppointment(false)}
        initialStaffId={appointmentStaffId}
      />
    </AnimatePresence>
  )
}
