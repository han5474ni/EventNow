# EventNow Frontend

Welcome to the EventNow frontend application! This React-based frontend is designed to work seamlessly with the EventNow backend API, providing a modern and responsive user interface for managing and discovering events.

## Features

- **User Authentication**: Secure login, registration, and password management
- **Event Management**: Create, view, update, and delete events
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI/UX**: Built with a focus on user experience
- **Real-time Updates**: Live updates for event changes and notifications
- **Accessibility**: Built with accessibility in mind

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or yarn
- EventNow Backend API (running on http://localhost:8000 by default)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/eventnow-frontend.git
cd eventnow-frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add the following variables:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id
```

### 4. Start the development server

```bash
npm start
# or
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Available Scripts

In the project directory, you can run:

### `npm start` or `yarn start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test` or `yarn test`

Launches the test runner in interactive watch mode.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint` or `yarn lint`

Runs ESLint to check for code quality issues.

### `npm run format` or `yarn format`

Formats all JavaScript and CSS files using Prettier.

## Project Structure

```
src/
├── assets/               # Static assets (images, icons, etc.)
├── components/           # Reusable UI components
│   ├── common/           # Common components used throughout the app
│   ├── events/           # Event-related components
│   ├── auth/             # Authentication components
│   └── user/             # User profile components
├── config/               # Application configuration
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── layouts/              # Layout components
├── pages/                # Page components
├── services/             # API services
├── styles/               # Global styles and themes
├── utils/                # Utility functions
├── App.js                # Main App component
└── index.js              # Application entry point
```

## Styling

This project uses a combination of:
- CSS Modules for component-scoped styles
- CSS Variables for theming
- Utility-first CSS framework (e.g., Tailwind CSS)

## State Management

- React Context API for global state
- Custom hooks for reusable stateful logic
- React Query for server state management

## API Integration

API requests are handled through the `services` directory, with each service corresponding to a specific API resource. The `api.js` utility provides a configured Axios instance with request/response interceptors for handling authentication and errors.

## Testing

- Unit tests: Jest + React Testing Library
- Component tests: @testing-library/react
- E2E tests: Cypress (coming soon)

Run tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run coverage report
npm test -- --coverage
```

## Deployment

### Build for Production

```bash
npm run build
```

This will create an optimized production build in the `build` directory.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Feventnow-frontend)

### Environment Variables

For production, make sure to set the following environment variables in your hosting platform:

- `REACT_APP_API_BASE_URL`: Your backend API URL
- `REACT_APP_GOOGLE_MAPS_API_KEY`: Google Maps API key (if using maps)
- `REACT_APP_GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID (optional)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Create React App](https://create-react-app.dev/)
- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- And all the amazing open-source libraries we use!

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
