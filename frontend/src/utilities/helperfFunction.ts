
import { jwtDecode } from "jwt-decode";
export interface DecodedToken {
	userId: string;
	// Add other payload properties as needed
}

export const generateSlug = (text: string): string => {
	return text
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "");
};

export const truncateText = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength - 3) + "...";
};

export const decodeToken = (token: any) => {
	console.log(token)
	if (!token) return null;
	try {
		const decodeToken:any =  jwtDecode(token) as DecodedToken;
		// Check if the token has expired
		const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
		if (decodeToken.exp && decodeToken.exp < currentTime) {
			console.error("Token has expired");
			localStorage.removeItem("token");
			return null;
		}
		return decodeToken;
	} catch (error) {}
};
