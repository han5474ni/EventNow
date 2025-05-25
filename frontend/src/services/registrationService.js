import { API_ENDPOINTS } from '../config';
import useApi from '../hooks/useApi';

export const useRegistrationService = () => {
  const api = useApi();

  const registerForEvent = async (eventId) => {
    return await api.post(API_ENDPOINTS.REGISTRATIONS.BASE, { event_id: eventId });
  };

  const getMyRegistrations = async (params = {}) => {
    const { page = 1, limit = 10 } = params;
    const url = `${API_ENDPOINTS.REGISTRATIONS.MY_REGISTRATIONS}?page=${page}&limit=${limit}`;
    return await api.get(url);
  };

  const cancelRegistration = async (registrationId) => {
    return await api.delete(API_ENDPOINTS.REGISTRATIONS.BY_ID(registrationId));
  };

  const getRegistration = async (registrationId) => {
    return await api.get(API_ENDPOINTS.REGISTRATIONS.BY_ID(registrationId));
  };

  return {
    registerForEvent,
    getMyRegistrations,
    cancelRegistration,
    getRegistration,
  };
};

export default useRegistrationService;
