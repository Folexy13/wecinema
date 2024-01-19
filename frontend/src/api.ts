import axios, { AxiosResponse, AxiosError, Method } from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "https://wecinema.onrender.com/";//;"http://localhost:3000/"

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

interface ApiResponse {
	message: string;
}

const handleSuccess = <T extends ApiResponse>(
	response: AxiosResponse<T>,
	method: Method,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): T => {
	setLoading(false);
	if (method === "post" || method === "put") {
		toast.success(response.data.message || "Successful");
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
			(error.response?.data && error.response.data.message) ||
			"Something went wrong on the server.";

		if (method === "post" || method === "put") {
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
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<T> =>
	api
		.post(url, data)
		.then((response) => handleSuccess(response, "post", setLoading))
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
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<T> =>
	api
		.put(url, data)
		.then((response) => handleSuccess(response, "put", setLoading))
		.catch((error) => handleError(error, "put", setLoading));
