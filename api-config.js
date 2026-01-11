// API Configuration
const API_BASE_URL = 'https://newsmind-ai.onrender.com/api';

// API Endpoints
const API = {
    baseURL: API_BASE_URL,
    
    // Auth endpoints
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    verifyToken: `${API_BASE_URL}/auth/verify`,
    
    // Summary endpoints
    summarizeURL: `${API_BASE_URL}/summary/url`,
    summarizeText: `${API_BASE_URL}/summary/text`,
    summarizeFile: `${API_BASE_URL}/summary/file`,
    getSummary: (id) => `${API_BASE_URL}/summary/${id}`,
    
    // Debate endpoints
    createDebate: `${API_BASE_URL}/debate/create`,
    joinDebate: `${API_BASE_URL}/debate/join`,
    sendMessage: `${API_BASE_URL}/debate/message`,
    getDebate: (roomId) => `${API_BASE_URL}/debate/${roomId}`,
    moderateDebate: `${API_BASE_URL}/debate/moderate`,
    
    // History endpoints
    getSummaries: `${API_BASE_URL}/history/summaries`,
    getDebates: `${API_BASE_URL}/history/debates`,
    getStats: `${API_BASE_URL}/history/stats`,
    deleteSummary: (id) => `${API_BASE_URL}/history/summary/${id}`
};

// Helper function to make API calls with retry logic
async function apiCall(url, options = {}) {
    const maxRetries = 2;
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            lastError = error;
            console.error(`API Error (attempt ${i + 1}):`, error);
            
            // Wait before retry (backend might be waking up)
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    
    throw lastError;
}

// Helper for file uploads
async function uploadFile(url, formData) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
            // Don't set Content-Type header - browser will set it with boundary
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'File upload failed');
        }
        
        return data;
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
}
