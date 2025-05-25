import { useState, useEffect, useRef, useCallback } from 'react';

const useInfiniteScroll = (fetchMore, options = {}) => {
  const { threshold = 100, hasMore = true, initialLoading = false } = options;
  const [isFetching, setIsFetching] = useState(initialLoading);
  const [error, setError] = useState(null);
  const observerRef = useRef();
  const lastElementRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching && hasMore) {
        setIsFetching(true);
      }
    },
    [isFetching, hasMore]
  );

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    return () => {
      if (lastElementRef.current) {
        observer.unobserve(lastElementRef.current);
      }
    };
  }, [handleObserver]);

  // Fetch more data when isFetching changes
  useEffect(() => {
    if (!isFetching) return;
    
    const fetchData = async () => {
      try {
        await fetchMore();
        setError(null);
      } catch (err) {
        console.error('Error fetching more data:', err);
        setError('Failed to load more data. Please try again.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [isFetching, fetchMore]);

  return {
    isFetching,
    error,
    lastElementRef,
    setIsFetching,
  };
};

export default useInfiniteScroll;
