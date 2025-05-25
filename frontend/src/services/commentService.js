import { API_ENDPOINTS } from '../config';
import useApi from '../hooks/useApi';

export const useCommentService = () => {
  const api = useApi();

  const getEventComments = async (eventId, params = {}) => {
    const { page = 1, limit = 10 } = params;
    const url = `${API_ENDPOINTS.COMMENTS.BY_EVENT(eventId)}?page=${page}&limit=${limit}`;
    return await api.get(url);
  };

  const addComment = async (eventId, content, rating = null) => {
    return await api.post(API_ENDPOINTS.COMMENTS.BASE, {
      event_id: eventId,
      content,
      rating,
    });
  };

  const updateComment = async (commentId, content, rating = null) => {
    return await api.put(API_ENDPOINTS.COMMENTS.BY_ID(commentId), {
      content,
      rating,
    });
  };

  const deleteComment = async (commentId) => {
    return await api.delete(API_ENDPOINTS.COMMENTS.BY_ID(commentId));
  };

  return {
    getEventComments,
    addComment,
    updateComment,
    deleteComment,
  };
};

export default useCommentService;
