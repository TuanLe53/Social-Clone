import axios from "axios";

export const publicAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

export const privateAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});