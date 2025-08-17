// API Configuration File
export const API_CONFIG = {
  // Unsplash API Configuration
  UNSPLASH: {
    // Method 1: Use environment variable (recommended)
    // Create .env file in project root: VITE_UNSPLASH_API_KEY=your_actual_key
    
    // Method 2: Direct configuration (not recommended for production)
    API_KEY: 'KXAsMXCrmoYKrA_ktmdVoCrAvq8_4PvUMVK4IxPAnsM',
    
    BASE_URL: 'https://api.unsplash.com',
    SEARCH_ENDPOINT: '/search/photos',
    DEFAULT_PER_PAGE: 20,
    DEFAULT_ORIENTATION: 'landscape'
  }
}

// Environment variable validation
export function validateApiConfig() {
  if (!API_CONFIG.UNSPLASH.API_KEY || API_CONFIG.UNSPLASH.API_KEY === 'YOUR_UNSPLASH_API_KEY_HERE') {
    console.warn('Warning: Please set VITE_UNSPLASH_API_KEY environment variable or configure API key in config/api.ts')
    return false
  }
  return true
}
