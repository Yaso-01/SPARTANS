import api from './api';

export const postService = {
    getAllPosts: async () => {
        const response = await api.get('/posts');
        return response.data;
    },

    getPostsBySportType: async (sportType) => {
        const response = await api.get(`/posts/sport/${sportType}`);
        return response.data;
    },

    createPost: async (postData) => {
        const response = await api.post('/posts', postData);
        return response.data;
    },

    toggleLike: async (postId) => {
        const response = await api.post(`/posts/${postId}/like`);
        return response.data;
    },

    deletePost: async (postId) => {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    },
};