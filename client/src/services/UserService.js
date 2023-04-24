import axios from "axios";
const baseURL = "http://127.0.0.1:8080";

export const registerUser = async (newUser) => {
    const response = await axios.post(`${baseURL}/api/users/register`, newUser);
    return response.data;
};

export const loginUser = async (user) => {
    const response = await axios.post(`${baseURL}/api/users/login`, user);
    return response.data;
};