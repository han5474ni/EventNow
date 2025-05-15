import Link from "next/link"

const EventBanner = ({ featuredEvent }) => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl mb-8">
      <img
        src={featuredEvent?.image || "/placeholder.svg?height=500&width=1200"}
        alt={featuredEvent?.title || "Featured Event"}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-10">
        <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">
          {featuredEvent?.category || "Featured"}
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
          {featuredEvent?.title || "Upcoming Featured Event"}
        </h1>
        <p className="text-white/90 mb-4 max-w-2xl line-clamp-2">
          {featuredEvent?.description || "Join us for this amazing event that you won't want to miss!"}
        </p>
        <div className="flex flex-wrap gap-4 mb-2">
          <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {featuredEvent?.date || "Coming Soon"}
          </div>
          <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {featuredEvent?.location || "TBA"}
          </div>
        </div>
        <Link
          href={`/event/${featuredEvent?.id || 1}`}
          className="bg-white hover:bg-white/90 text-primary font-medium px-6 py-2 rounded-md w-fit mt-4 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default EventBanner
