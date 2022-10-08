import axios from 'axios';

const service = axios.create({
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        return config;
    },
    error => {

        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {

        return Promise.reject();
    }
);

export default service;
