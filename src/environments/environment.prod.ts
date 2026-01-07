export const environment = {
    production: true,
    // Placeholders for Render Backend and Neon DB
    // apiUrl: 'https://your-render-backend-url.onrender.com', 
    // dbUrl: 'postgres://user:password@endpoint.neon.tech/neondb',
    lmStudioUrl: 'http://localhost:1234/v1/chat/completions', // Update if hosting LLM
    featureFlags: {
        useMockData: true // Set to false when backend is ready
    }
};
