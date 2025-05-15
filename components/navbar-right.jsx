"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, Check, ChevronRight, Settings, LogOut, UserCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for notifications
const notifications = [
  {
    id: 1,
    title: "Event Baru Tersedia",
    message: "Workshop UI/UX Design telah ditambahkan ke daftar event.",
    time: "5 menit lalu",
    read: false,
  },
  {
    id: 2,
    title: "Pengingat Event",
    message: "Event 'Tech Talk: AI in Education' akan dimulai dalam 1 jam.",
    time: "30 menit lalu",
    read: false,
  },
  {
    id: 3,
    title: "Pendaftaran Berhasil",
    message: "Anda telah berhasil mendaftar untuk event 'Seminar Teknologi Blockchain'.",
    time: "2 jam lalu",
    read: true,
  },
  {
    id: 4,
    title: "Pembayaran Diterima",
    message: "Pembayaran untuk event 'Workshop Data Science' telah dikonfirmasi.",
    time: "1 hari lalu",
    read: true,
  },
  {
    id: 5,
    title: "Event Dibatalkan",
    message: "Event 'Meetup Developer' telah dibatalkan oleh penyelenggara.",
    time: "2 hari lalu",
    read: true,
  },
]

// Mock user data
const userData = {
  name: "Ahmad Fauzi",
  email: "ahmad.fauzi@student.itera.ac.id",
  profileImage: "/placeholder.svg?height=100&width=100", // Placeholder image
}

export default function NavbarRight() {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(notifications.filter((notification) => !notification.read).length)

  const notificationRef = useRef(null)
  const accountRef = useRef(null)

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target) && notificationOpen) {
        setNotificationOpen(false)
      }

      if (accountRef.current && !accountRef.current.contains(event.target) && accountOpen) {
        setAccountOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [notificationOpen, accountOpen])

  // Mark all notifications as read
  const markAllAsRead = () => {
    setUnreadCount(0)
    // In a real app, you would update the notification state and send to backend
  }

  // Toggle notification dropdown
  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen)
    if (accountOpen) setAccountOpen(false)
  }

  // Toggle account dropdown
  const toggleAccount = () => {
    setAccountOpen(!accountOpen)
    if (notificationOpen) setNotificationOpen(false)
  }

  return (
    <div className="flex items-center gap-2 md:gap-4">
      {/* Notification Icon */}
      <div className="relative" ref={notificationRef}>
        <button
          onClick={toggleNotification}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Notifications"
        >
          <Bell className="h-6 w-6 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        <div
          className={`absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50 transition-all duration-300 origin-top ${
            notificationOpen ? "transform scale-100 opacity-100" : "transform scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Notifikasi</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Tandai semua terbaca
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          📩
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
                            )}
                          </p>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">Tidak ada notifikasi</div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <Link
              href="/notifications"
              className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-1"
            >
              Lihat semua notifikasi
              <ChevronRight className="inline-block h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Account Icon */}
      <div className="relative" ref={accountRef}>
        <button
          onClick={toggleAccount}
          className="flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Account"
        >
          <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200">
            <Image
              src={userData.profileImage || "/placeholder.svg"}
              alt="Profile"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
        </button>

        {/* Account Dropdown */}
        <div
          className={`absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-50 transition-all duration-200 ${
            accountOpen ? "transform scale-100 opacity-100" : "transform scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200">
                  <Image
                    src={userData.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userData.name}</p>
                <p className="text-xs text-gray-500 truncate">{userData.email}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <UserCircle className="h-5 w-5 mr-3 text-gray-500" />
              Profil Saya
            </Link>
            <Link
              href="/settings"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Settings className="h-5 w-5 mr-3 text-gray-500" />
              Pengaturan
            </Link>
            <hr className="my-1 border-gray-200" />
            <button
              onClick={() => console.log("Logout clicked")}
              className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3 text-red-500" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
