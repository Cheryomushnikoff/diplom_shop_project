import axios from "axios";

const API_URL = "api/accounts/";

// Логин пользователя
export const login = (email, password) => {
  return axios.post(API_URL + "token/", { email, password });
};

// Обновление access-токена через refresh
export const refreshToken = (refresh) => {
  return axios.post(API_URL + "token/refresh/", { refresh });
};

// Получение данных текущего пользователя
export const getCurrentUser = (access) => {
  return axios.get(API_URL + "user", {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
};

export default function parseJwt(token) {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }
