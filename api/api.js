import axios from "axios"

// Create an axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://eventnow.mockapi.io/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("authToken")

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear localStorage
      localStorage.removeItem("authToken")

      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

// API functions for events
export const fetchEvents = async () => {
  // For demo purposes, directly return mock data without making an API call
  console.log("Fetching all events")
  return mockEvents
}

export const fetchFeaturedEvent = async () => {
  // For demo purposes, directly return mock data without making an API call
  console.log("Fetching featured event")
  return mockEvents[0]
}

export const fetchEventById = async (id) => {
  // For demo purposes, directly return mock data without making an API call
  console.log(`Fetching event with id: ${id}`)
  // Convert id to string for comparison
  const idStr = id.toString()
  const event = mockEvents.find((event) => event.id.toString() === idStr)

  if (!event) {
    console.warn(`No event found with id: ${id}`)
  }

  return event || null
}

export const fetchRelatedEvents = async (category, currentEventId) => {
  // For demo purposes, directly return mock data without making an API call
  console.log(`Fetching related events for category: ${category}, excluding event: ${currentEventId}`)

  // Convert currentEventId to string for comparison
  const currentIdStr = currentEventId.toString()

  // Filter events by category and exclude the current event
  const relatedEvents = mockEvents
    .filter((event) => event.category === category && event.id.toString() !== currentIdStr)
    .slice(0, 4)

  return relatedEvents
}

// Mock data for development and demo purposes
const mockEvents = [
  {
    id: 1,
    title: "Tech Conference 2023",
    description:
      "Join us for the biggest tech conference of the year. Learn from industry experts, network with professionals, and discover the latest innovations in technology.",
    date: "May 15, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "Tech Convention Center",
    address: "123 Innovation St, San Francisco, CA",
    category: "Academic",
    participants: 1500,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    organizer: {
      name: "TechEvents Inc.",
      role: "Event Organizer",
      description: "Leading technology event organizer with over 10 years of experience.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    id: 2,
    title: "Annual Music Festival",
    description:
      "Experience three days of amazing music performances from top artists across multiple genres. Food, camping, and unforgettable memories included!",
    date: "June 10-12, 2023",
    time: "12:00 PM - 11:00 PM",
    location: "Riverside Park",
    address: "456 River Rd, Austin, TX",
    category: "Festival",
    participants: 5000,
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    organizer: {
      name: "SoundWave Productions",
      role: "Festival Organizer",
      description: "Creating memorable music experiences since 2010.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  },
  {
    id: 3,
    title: "Startup Networking Mixer",
    description:
      "Connect with fellow entrepreneurs, investors, and industry experts in this casual networking event designed for the startup community.",
    date: "April 28, 2023",
    time: "6:30 PM - 9:00 PM",
    location: "Innovation Hub",
    address: "789 Startup Ave, New York, NY",
    category: "Social",
    participants: 150,
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    organizer: {
      name: "Founders Network",
      role: "Community Organizer",
      description: "Building bridges in the startup ecosystem.",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
    },
  },
  {
    id: 4,
    title: "International Food Festival",
    description:
      "Taste cuisines from around the world at this international food festival featuring over 50 vendors, cooking demonstrations, and cultural performances.",
    date: "July 8-9, 2023",
    time: "11:00 AM - 8:00 PM",
    location: "City Center Plaza",
    address: "101 Main St, Chicago, IL",
    category: "Festival",
    participants: 3000,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    organizer: {
      name: "Global Tastes",
      role: "Event Organizer",
      description: "Bringing global cuisines to local communities.",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
    },
  },
  {
    id: 5,
    title: "Artificial Intelligence Workshop",
    description:
      "Learn practical AI skills in this hands-on workshop led by industry experts. Perfect for developers, data scientists, and tech enthusiasts.",
    date: "May 20, 2023",
    time: "10:00 AM - 4:00 PM",
    location: "Digital Learning Center",
    address: "555 Tech Blvd, Seattle, WA",
    category: "Academic",
    participants: 75,
    image:
      "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    organizer: {
      name: "AI Academy",
      role: "Education Provider",
      description: "Making AI education accessible to everyone.",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
    },
  },
  {
    id: 6,
    title: "Charity 5K Run",
    description:
      "Run for a cause! Join us for our annual 5K run to raise funds for local children's hospitals. All fitness levels welcome.",
    date: "June 3, 2023",
    time: "8:00 AM - 11:00 AM",
    location: "Lakeside Park",
    address: "222 Park Lane, Boston, MA",
    category: "Sports",
    participants: 500,
    image:
      "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
    organizer: {
      name: "RunForGood Foundation",
      role: "Non-profit Organization",
      description: "Organizing athletic events for charitable causes since 2015.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  },
  {
    id: 7,
    title: "Photography Exhibition",
    description:
      "Explore stunning photography from emerging and established artists at our annual exhibition featuring over 100 works from around the world.",
    date: "April 15-30, 2023",
    time: "10:00 AM - 6:00 PM",
    location: "Modern Art Gallery",
    address: "333 Arts District, Los Angeles, CA",
    category: "Academic",
    participants: 1200,
    image:
      "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    organizer: {
      name: "Visual Arts Collective",
      role: "Arts Organization",
      description: "Promoting photography and visual arts in the community.",
      image: "https://randomuser.me/api/portraits/men/91.jpg",
    },
  },
  {
    id: 8,
    title: "Business Leadership Conference",
    description:
      "Develop your leadership skills at this premier conference featuring keynote speakers, workshops, and networking opportunities for professionals at all levels.",
    date: "May 25-26, 2023",
    time: "9:00 AM - 4:00 PM",
    location: "Grand Hotel Conference Center",
    address: "444 Business Plaza, Miami, FL",
    category: "Academic",
    participants: 350,
    image:
      "https://images.unsplash.com/photo-1560523159-4a9692d222f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    organizer: {
      name: "Leadership Institute",
      role: "Professional Development Organization",
      description: "Empowering the next generation of business leaders.",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
    },
  },
]
