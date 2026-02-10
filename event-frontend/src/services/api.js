import axios from 'axios';

const instance = axios.create({
    baseURL: "http://localhost:8080/api",
});

instance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            // Attach JWT token to headers
            config.headers["Authorization"] = 'Bearer ' + user.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;