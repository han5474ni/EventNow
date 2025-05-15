import Link from "next/link"
import { Calendar, MapPin, Users } from "lucide-react"

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || "/placeholder.svg?height=200&width=400"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
          {event.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{event.title}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <Users className="w-4 h-4 mr-1" />
          <span>{event.participants} participants</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        <Link
          href={`/event/${event.id}`}
          className="block w-full text-center bg-primary hover:bg-primary/90 text-white py-2 rounded-md transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default EventCard
