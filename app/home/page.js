"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import EventBanner from "@/components/EventBanner"
import CategoryFilter from "@/components/CategoryFilter"
import EventCard from "@/components/EventCard"
import { fetchEvents, fetchFeaturedEvent } from "@/api/api"

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [events, setEvents] = useState([])
  const [featuredEvent, setFeaturedEvent] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const eventsData = await fetchEvents()
        const featured = await fetchFeaturedEvent()

        setEvents(eventsData)
        setFeaturedEvent(featured)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredEvents = events.filter((event) => {
    const matchesCategory = activeCategory === "all" || event.category.toLowerCase() === activeCategory
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Group events by category for display
  const groupedEvents = {}
  filteredEvents.forEach((event) => {
    if (!groupedEvents[event.category]) {
      groupedEvents[event.category] = []
    }
    groupedEvents[event.category].push(event)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">EventNow</h1>
          </div>

          <div className="relative max-w-md w-full mx-4 hidden md:block">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="md:hidden container mx-auto px-4 pb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Banner */}
        <EventBanner featuredEvent={featuredEvent} />

        {/* Category Filter */}
        <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-600">No events found</h3>
            <p className="text-gray-500 mt-2">Try changing your search or filter criteria</p>
          </div>
        )}

        {/* Event Listings by Category */}
        {!loading &&
          Object.keys(groupedEvents).map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{category} Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groupedEvents[category].map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          ))}
      </main>
    </div>
  )
}
