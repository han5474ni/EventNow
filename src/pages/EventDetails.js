"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, Clock, MapPin, Users, ArrowLeft, ExternalLink } from "lucide-react"
import EventCard from "../components/EventCard"
import { fetchEventById, fetchRelatedEvents } from "../api/api"

const EventDetails = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [relatedEvents, setRelatedEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEventData = async () => {
      try {
        setLoading(true)
        const eventData = await fetchEventById(id)
        setEvent(eventData)

        // Fetch related events based on the same category
        const related = await fetchRelatedEvents(eventData.category, id)
        setRelatedEvents(related)
      } catch (error) {
        console.error("Error loading event data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEventData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Link to="/" className="text-primary hover:underline">
          Return to homepage
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Image */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
        <img
          src={event.image || "/placeholder.svg?height=500&width=1200"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        <div className="absolute top-4 left-4">
          <Link
            to="/"
            className="flex items-center text-white bg-black/30 hover:bg-black/50 px-3 py-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Event Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 -mt-20 relative z-10 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">
                {event.category}
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">{event.title}</h1>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-md transition-colors w-full md:w-auto">
              Register Now
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="font-medium">{event.participants} people</p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">About This Event</h2>
              <div className="prose max-w-none">
                <p>{event.description}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Venue</h2>
              <div className="flex items-start mb-4">
                <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">{event.location}</p>
                  <p className="text-sm text-gray-500">{event.address}</p>
                </div>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:underline"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Organizer</h2>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                  <img
                    src={event.organizer?.image || "/placeholder.svg?height=50&width=50"}
                    alt={event.organizer?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{event.organizer?.name}</p>
                  <p className="text-sm text-gray-500">{event.organizer?.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{event.organizer?.description}</p>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <EventCard key={relatedEvent.id} event={relatedEvent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetails
