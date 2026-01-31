// helpers/apiClient.js
import axios from "axios";

// создаём instance
const apiClient = axios.create({
    baseURL: "/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

// флаги и очередь для refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// подставляем access-токен в каждый запрос
apiClient.interceptors.request.use(
    (config) => {
        const tokens = JSON.parse(localStorage.getItem("authTokens"));
        if (tokens?.access) {
            config.headers.Authorization = `Bearer ${tokens.access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ловим 401 и обновляем токен
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const tokens = JSON.parse(localStorage.getItem("authTokens"));

            if (!tokens?.refresh) {
                localStorage.removeItem("authTokens");
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (newAccess) => {
                            originalRequest.headers.Authorization =
                                `Bearer ${newAccess}`;
                            resolve(apiClient(originalRequest));
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                // обращаемся к эндпоинту refresh SimpleJWT
                const res = await axios.post("/api/accounts/token/refresh/", {
                    refresh: tokens.refresh,
                });

                const newTokens = {
                    access: res.data.access,
                    refresh: tokens.refresh,
                };

                localStorage.setItem(
                    "authTokens",
                    JSON.stringify(newTokens)
                );

                apiClient.defaults.headers.Authorization =
                    `Bearer ${res.data.access}`;

                processQueue(null, res.data.access);

                originalRequest.headers.Authorization =
                    `Bearer ${res.data.access}`;

                return apiClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem("authTokens");
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
