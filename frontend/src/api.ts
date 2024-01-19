import axios, { AxiosResponse, AxiosError } from "axios";
// import { useState } from "react";
import { toast } from "react-toastify";

const API_BASE_URL = "https://wecinema.onrender.com" //"http://localhost:3000/";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
		// Add any additional headers as needed
	},
});

interface ApiResponse {
	message: string;
}

const handleSuccess = <T extends ApiResponse>(
	response: AxiosResponse<T>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): T => {
	setLoading(false); // Set loading to false on success
	toast.success(response.data.message || "successful ");
	return response.data;
};

const handleError = (
	error: AxiosError<ApiResponse>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<string> => {
	setLoading(false); // Set loading to false on error

	if (error.response) {
		// The request was made, and the server responded with a status code that falls out of the range of 2xx
		const errorMessage =
			(error.response?.data && error.response.data.message) ||
			"Something went wrong on the server.";

		toast.error(errorMessage);
		return Promise.reject(errorMessage);
	} else if (error.request) {
		// The request was made but no response was received
		toast.error("No response received from the server.");
		return Promise.reject("No response received from the server.");
	} else {
		// Something happened in setting up the request that triggered an Error
		toast.error(error.message || "An unexpected error occurred.");

		return Promise.reject(error.message || "An unexpected error occurred.");
	}
};

// POST request
export const postRequest = <T>(
	url: string,
	data: any,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<T> =>
	api
		.post(url, data)
		.then((response) => handleSuccess(response, setLoading))
		.catch((error) => handleError(error, setLoading));

// GET request
export const getRequest = <T>(
	url: string,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<T> =>
	api
		.get(url)
		.then((response) => handleSuccess(response, setLoading))
		.catch((error) => handleError(error, setLoading));

// PUT request
export const putRequest = <T>(
	url: string,
	data: any,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<T> =>
	api
		.put(url, data)
		.then((response) => handleSuccess(response, setLoading))
		.catch((error) => handleError(error, setLoading));
