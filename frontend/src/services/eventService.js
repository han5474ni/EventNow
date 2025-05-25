import { API_ENDPOINTS } from '../config';
import useApi from '../hooks/useApi';

export const useEventService = () => {
  const api = useApi();

  const getEvents = async (params = {}) => {
    const { category, upcomingOnly = true, page = 1, limit = 10 } = params;
    let url = `${API_ENDPOINTS.EVENTS.BASE}?page=${page}&limit=${limit}`;
    
    if (category) {
      url += `&category=${category}`;
    }
    
    if (upcomingOnly) {
      url += '&upcoming_only=true';
    }

    return await api.get(url);
  };

  const getEventById = async (id) => {
    return await api.get(API_ENDPOINTS.EVENTS.BY_ID(id));
  };

  const createEvent = async (eventData) => {
    const formData = new FormData();
    
    // Append all fields to formData
    Object.keys(eventData).forEach(key => {
      if (key === 'image' && eventData[key]) {
        formData.append('image', eventData[key]);
      } else if (eventData[key] !== undefined && eventData[key] !== null) {
        formData.append(key, eventData[key]);
      }
    });

    return await api.post(API_ENDPOINTS.EVENTS.BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const updateEvent = async (id, eventData) => {
    const formData = new FormData();
    
    // Append all fields to formData
    Object.keys(eventData).forEach(key => {
      if (key === 'image' && eventData[key]) {
        formData.append('image', eventData[key]);
      } else if (eventData[key] !== undefined && eventData[key] !== null) {
        formData.append(key, eventData[key]);
      }
    });

    return await api.put(API_ENDPOINTS.EVENTS.BY_ID(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const deleteEvent = async (id) => {
    return await api.delete(API_ENDPOINTS.EVENTS.BY_ID(id));
  };

  const getEventRegistrations = async (eventId) => {
    return await api.get(`${API_ENDPOINTS.EVENTS.BY_ID(eventId)}/registrations`);
  };

  return {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventRegistrations,
  };
};

export default useEventService;
