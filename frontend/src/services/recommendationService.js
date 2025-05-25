import { API_ENDPOINTS } from '../config';
import useApi from '../hooks/useApi';

export const useRecommendationService = () => {
  const api = useApi();

  const getRecommendedEvents = async (params = {}) => {
    const { limit = 5 } = params;
    const url = `${API_ENDPOINTS.RECOMMENDATIONS.EVENTS}?limit=${limit}`;
    return await api.get(url);
  };

  const getSimilarEvents = async (eventId, params = {}) => {
    const { limit = 5 } = params;
    const url = `${API_ENDPOINTS.RECOMMENDATIONS.SIMILAR_EVENTS(eventId)}?limit=${limit}`;
    return await api.get(url);
  };

  return {
    getRecommendedEvents,
    getSimilarEvents,
  };
};

export default useRecommendationService;
