import axios from "axios";

const api = axios.create({
    baseURL: "https://multi-sensor-monitoring-system-with-python-production.up.railway.app/api"
});

const refreshApi = axios.create({
    baseURL: "https://multi-sensor-monitoring-system-with-python-production.up.railway.app/api"
});

// 1. Request Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Response Interceptor: 
api.interceptors.response.use(
    (response) => response, // Agar sab sahi hai toh wapas response de diya
    async (error) => {
        const originalRequest = error.config;


        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");

                if (refreshToken) {
                    // Naya Access Token mang rahe hain
                    const response = await refreshApi.post("/token/refresh/", {
                        refresh: refreshToken
                    });
                    const newAccessToken = response.data.access;

                    // Naya token save karo LocalStorage mein
                    localStorage.setItem("access_token", newAccessToken);

                    // Original request ke headers mein naya token laga diya
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Original request wapas bheji
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // if refresh token expired
                console.error("Refresh Token Expired:", refreshError);
                localStorage.clear(); // Sab clear karo
                window.location.href = "/login"; // Login page par redirect
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// 3. Login Function
export const login = async (username, password) => {
    try {
        const response = await api.post("/login/", {
            username: username,
            password: password
        });

        // defining variables:
        const { access, refresh, role } = response.data; // Check keys from backend response

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("role", role);

        return response.data;

    } catch (error) {
        throw error;
    }
};

// 4. Get Report Function (Ab yeh apne aap interceptors use karega)
export const getReport = async () => {
    const response = await api.get("/reports/");
    return response.data;
};

// ye saari devices ko list kre gi
export const getDevices = async () => {
    const response = await api.get("/devices/");
    return response.data;
};

// ye specific device ki details return kre giiii
export const getDeviceDetails = async (id) => {
    const res = await api.get(`/devices/${id}`);
    console.log(res.data)
    return res.data

};

// ye specific device ke sensors returne kre gii
export const getDeviceSensors = async (id) => {
    const res = await api.get(`/devices/${id}/sensors/`);
    return res.data

};

export const getDeviceAlerts = async (id) => {
    const res = await api.get(`/device_alerts/${id}/`);
    return res.data

};

// ye specific device ke --> spcific sensor ki ---> details (name, id, etc) return kre gi. (is me device_id filteration purposes ke liye dali he.) 
export const getSensorDetails = async (dev_id, sens_id) => {
    const res = await api.get(`/devices/${dev_id}/sensors/${sens_id}/`);
    console.log(res)
    return res.data

};


// ye specific device ke --> spcific sensor ka ---> data return kre gi. (is me device_id filteration purposes ke liye dali he.) 
export const getSensorData = async (dev_id, sens_id) => {
    const res = await api.get(`/devices/${dev_id}/sensors/${sens_id}/data`);
    console.log(res)
    return res.data

};

export const getDebugLog = async (page = 1) => {
    const res = await api.get(`/debug/?page=${page}`);
    return res.data

};

// Alerts fieldsl

// filterset_fields = {
//     'created_at': ['gte', 'lte'],
//     'sensor_id': ['exact'],
//     'sensor_id__device_id': ['exact'],
//     'status' : ['exact'],
// }

export const getAlerts = async (current_status, device, sensor) => {
    const res = await api.get(`/alerts/?status=${current_status}&sensor_id__device_id=${device}&sensor_id=${sensor}`);
    return res.data

};


export const getFilteredData = async (start_date, end_date, device, sensor) => {
    const res = await api.get(`/filterData/?created_at__gte=${start_date}&created_at__lte=${end_date}&sensor_id__device_id=${device}&sensor_id=${sensor}`);
    return res.data

};






export default api; // Default export instance ki