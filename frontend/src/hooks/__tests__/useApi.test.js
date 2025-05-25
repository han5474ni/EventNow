const { renderHook, act } = require('@testing-library/react-hooks');
const { useApi } = require('../useApi');

// Mock the global fetch
beforeEach(() => {
  global.fetch = jest.fn();
  jest.clearAllMocks();
});

// Helper functions for mocking API responses
const mockApiResponse = (data, status = 200, ok = true) => {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(data),
    })
  );
};

const mockFetchError = (error) => {
  global.fetch.mockImplementationOnce(() => Promise.reject(error));
};

// Mock the global fetch
beforeEach(() => {
  global.fetch = jest.fn();
  jest.clearAllMocks();
});

describe('useApi', () => {
  const mockData = { id: 1, name: 'Test Data' };
  const mockError = { message: 'Test error' };
  const url = '/api/test';
  const options = { method: 'GET' };

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useApi());

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.fetchData).toBe('function');
  });

  it('should set loading to true when fetch is called', async () => {
    mockApiResponse(mockData);
    
    const { result, waitForNextUpdate } = renderHook(() => useApi());
    
    act(() => {
      result.current.fetchData(url, options);
    });
    
    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
  });

  it('should set data when fetch is successful', async () => {
    mockApiResponse(mockData);
    
    const { result, waitForNextUpdate } = renderHook(() => useApi());
    
    await act(async () => {
      await result.current.fetchData(url, options);
      await waitForNextUpdate();
    });
    
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should set error when fetch fails', async () => {
    mockFetchError('Network error');
    
    const { result, waitForNextUpdate } = renderHook(() => useApi());
    
    await act(async () => {
      await result.current.fetchData(url, options);
      await waitForNextUpdate();
    });
    
    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle 4xx and 5xx responses', async () => {
    const errorResponse = { message: 'Not found' };
    mockApiResponse(errorResponse, 404, false);
    
    const { result, waitForNextUpdate } = renderHook(() => useApi());
    
    await act(async () => {
      await result.current.fetchData(url, options);
      await waitForNextUpdate();
    });
    
    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeNull();
  });

  it('should abort fetch on unmount', async () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');
    
    // Mock a fetch that never resolves
    global.fetch.mockImplementation(() => new Promise(() => {}));
    
    const { result, unmount } = renderHook(() => useApi());
    
    act(() => {
      result.current.fetchData(url, options);
    });
    
    unmount();
    
    expect(abortSpy).toHaveBeenCalledTimes(1);
    abortSpy.mockRestore();
  });

  it('should use initial data when provided', () => {
    const initialData = { id: 'initial' };
    const { result } = renderHook(() => useApi(initialData));
    
    expect(result.current.data).toBe(initialData);
  });

  it('should reset state when reset function is called', async () => {
    const { result } = renderHook(() => useApi());
    
    // Set some state
    act(() => {
      result.current.setData(mockData);
      result.current.setError(new Error('Test error'));
    });
    
    // Reset state
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
