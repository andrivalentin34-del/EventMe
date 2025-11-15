const API_BASE_URL = 'http://localhost:5000';

export const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) {
        return null;
    }
    if (imageUrl.startsWith('http')) {
        return imageUrl; // It's already a full URL
    }
    // It's a relative path, prepend the backend base URL
    return `${API_BASE_URL}${imageUrl}`;
};
