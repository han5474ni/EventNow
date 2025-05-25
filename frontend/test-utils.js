import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Custom theme for testing
const theme = {
  colors: {
    primary: '#2563eb',
    secondary: '#4f46e5',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    light: '#f9fafb',
    dark: '#111827',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  // Add other theme properties as needed
};

// Mock router
const mockRouter = {
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
};

// Custom render function that wraps components with all necessary providers
const render = (
  ui,
  {
    route = '/',
    pathname = '/',
    query = {},
    user = null,
    isAuthenticated = false,
    isLoading = false,
    ...renderOptions
  } = {}
) => {
  // Update the mock router with the provided route and pathname
  mockRouter.route = route;
  mockRouter.pathname = pathname;
  mockRouter.query = query;

  // Mock the useRouter hook
  jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => mockRouter);

  // Mock the useAuth hook
  jest.spyOn(require('@/context/AuthContext'), 'useAuth').mockImplementation(() => ({
    user,
    isAuthenticated,
    isLoading,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  }));

  // Wrapper component that includes all necessary providers
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );

  // Return the rendered component with all providers
  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    router: mockRouter,
  };
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override the render method with our custom render
// This allows us to use the same import for all our tests
export { render };

// Custom test utilities
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  avatar: 'https://example.com/avatar.jpg',
  ...overrides,
});

export const createMockEvent = (overrides = {}) => ({
  id: '1',
  title: 'Test Event',
  description: 'This is a test event',
  location: 'Test Location',
  startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  endDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
  capacity: 100,
  availableSeats: 50,
  price: 0,
  category: 'test',
  image: 'https://example.com/event.jpg',
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Helper to wait for a specific time (useful for testing async operations)
export const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to flush promises
export const flushPromises = () => new Promise(setImmediate);

// Helper to generate test data
export const generateTestData = (count, generator) => 
  Array.from({ length: count }, (_, i) => generator(i));

// Helper to mock API responses
export const mockApiResponse = (data, status = 200, ok = true) => ({
  ok,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
  clone: function() {
    return mockApiResponse(data, status, ok);
  },
});

// Helper to mock fetch with a response
export const mockFetchResponse = (data, status = 200, ok = true) => {
  global.fetch = jest.fn().mockResolvedValueOnce(mockApiResponse(data, status, ok));
};

// Helper to mock fetch with an error
export const mockFetchError = (error = 'Failed to fetch') => {
  global.fetch = jest.fn().mockRejectedValueOnce(new Error(error));
};

// Helper to test form validation
export const testFormValidation = async (
  formComponent,
  { submitButton, fields, errorMessages },
  { submitForm, waitForElement } 
) => {
  // Test each field for validation
  for (const field of fields) {
    const { name, value } = field;
    const input = formComponent.getByLabelText(name);
    
    // Change input value
    fireEvent.change(input, { target: { value } });
    
    // Blur the input to trigger validation
    fireEvent.blur(input);
    
    // Check if error message is displayed
    const errorMessage = errorMessages[name];
    if (errorMessage) {
      await waitForElement(() => 
        formComponent.getByText(errorMessage)
      );
    }
  }
  
  // Test form submission
  if (submitForm) {
    const submitBtn = formComponent.getByRole('button', { name: submitButton });
    fireEvent.click(submitBtn);
    
    // Wait for any async validation
    await wait();
  }
};

// Helper to test protected routes
export const testProtectedRoute = async (
  component,
  { isAuthenticated, redirectPath },
  { getByText, queryByText, history }
) => {
  // If user is not authenticated, should redirect
  if (!isAuthenticated) {
    expect(queryByText('Protected Content')).not.toBeInTheDocument();
    expect(history.location.pathname).toBe(redirectPath);
  } else {
    // If user is authenticated, should show protected content
    expect(getByText('Protected Content')).toBeInTheDocument();
  }
};
