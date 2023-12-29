import api from '../utils/api';

export const getUserList = async () => {
    const response = await api.get('/user');
    return response.data;
};

export const getUserById = async (id: number) => {
    const response = await api.get(`/user/${id}`);
    return response.data;
};

export const addUser = async (user: any) => {
    const response = await api.post("/user", user);
    return response.data;
};

export const deleteUser = async (id: number) => {
    const response = await api.delete(`/user/${id}`);
    return response.data;
};

export const updateUser = async (id: number, user: any) => {
    const response = await api.put(`user/${id}`, user);
    return response.data;
};