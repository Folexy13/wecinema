import axios, { AxiosResponse, AxiosError, Method } from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "https://wecinema.onrender.com"; //"https://wecinema.onrender.com/";//http://localhost:3000/

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to add the JWT token to the headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

interface ApiResponse {
    message?: string;
    error?: string;
}

const handleSuccess = <T extends ApiResponse>(
    response: AxiosResponse<T>,
    method: Method,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    message?: string
): T => {
    setLoading(false);
    if (method === "post" || method === "put" || method === "patch" || method === "delete") {
        toast.success(response.data.message || message || "Successful");
    }
    return response.data;
};

const handleError = (
    error: AxiosError<ApiResponse>,
    method: Method,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<string> => {
    setLoading(false);

    if (error.response) {
        const errorMessage =
            error.response.data.message ||
            error.response.data?.error ||
            "Something went wrong on the server.";

        if (method === "post" || method === "put" || method === "patch" || method === "delete") {
            toast.error(errorMessage);
        }
        return Promise.reject(errorMessage);
    } else if (error.request) {
        toast.error("No response received from the server.");
        return Promise.reject("No response received from the server.");
    } else {
        toast.error(error.message || "An unexpected error occurred.");
        return Promise.reject(error.message || "An unexpected error occurred.");
    }
};

export const postRequest = <T>(
    url: string,
    data: any,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    message?: string
): Promise<T> =>
    api
        .post(url, data)
        .then((response) => handleSuccess(response, "post", setLoading, message))
        .catch((error) => handleError(error, "post", setLoading));

export const getRequest = <T>(
    url: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<T> =>
    api
        .get(url)
        .then((response) => handleSuccess(response, "get", setLoading))
        .catch((error) => handleError(error, "get", setLoading));

export const putRequest = <T>(
    url: string,
    data: any,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    message?: string
): Promise<T> =>
    api
        .put(url, data)
        .then((response) => handleSuccess(response, "put", setLoading, message))
        .catch((error) => handleError(error, "put", setLoading));

export const patchRequest = <T>(
    url: string,
    data: any,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    message?: string
): Promise<T> =>
    api
        .patch(url, data)
        .then((response) => handleSuccess(response, "patch", setLoading, message))
        .catch((error) => handleError(error, "patch", setLoading));

export const deleteRequest = <T>(
    url: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    message?: string
): Promise<T> =>
    api
        .delete(url)
        .then((response) => handleSuccess(response, "delete", setLoading, message))
        .catch((error) => handleError(error, "delete", setLoading));

		

		// Function to add a video to bookmarks
		export const addBookmark = async (videoId:any) => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.post(`/bookmarks/${videoId}`, {}, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				return response.data;
			} catch (error) {
				console.error("Error adding bookmark:", error);
				throw error;
			}
		};
		
		// Function to remove a video from bookmarks
		export const removeBookmark = async (videoId:any) => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.delete(`/bookmarks/${videoId}`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				return response.data;
			} catch (error) {
				console.error("Error removing bookmark:", error);
				throw error;
			}
		};
		
		// Function to get all bookmarks
		export const getBookmarks = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get('/bookmarks', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				return response.data;
			} catch (error) {
				console.error("Error getting bookmarks:", error);
				throw error;
			}
		};
		