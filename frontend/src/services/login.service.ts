import api from '../utils/api';

export const login = async (credentials: { email: string; password: string }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        const { token, user } = response.data;

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userType', user.userType);
        sessionStorage.setItem('userCommon', user.id);
        return token;
    } catch (error) {
        throw error;
    }
};
