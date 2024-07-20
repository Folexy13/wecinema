import { jwtDecode } from "jwt-decode";
import moment from "moment";
export interface Itoken {
	userId: string;
	avatar: string;
	hasPaid: boolean;
	username?: string;
	// Add other payload properties as needed
}
type MongooseId = string;
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
	console.log(token);
	if (!token) return null;
	try {
		const decodeToken: any = jwtDecode(token) as Itoken;
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

export function isObjectEmpty(obj: Record<string, any>): boolean {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
}

export const formatDateAgo = (dateTime: string): string => {
	const now = moment();
	const then = moment(dateTime);

	const secondsDiff = now.diff(then, "seconds");
	const minutesDiff = now.diff(then, "minutes");
	const hoursDiff = now.diff(then, "hours");
	const daysDiff = now.diff(then, "days");

	if (secondsDiff < 60) {
		return "just now";
	} else if (minutesDiff < 60) {
		return `${minutesDiff} minute${minutesDiff !== 1 ? "s" : ""} ago`;
	} else if (hoursDiff < 24) {
		return `${hoursDiff} hour${hoursDiff !== 1 ? "s" : ""} ago`;
	} else if (daysDiff === 1) {
		return "yesterday";
	} else if (daysDiff < 365) {
		return `${daysDiff} day${daysDiff !== 1 ? "s" : ""} ago`;
	} else {
		return moment(dateTime).format("MMM D, YYYY [at] h:mm A");
	}
};

export function isUserIdInArray(
	userId: MongooseId,
	idArray: MongooseId[]
): boolean {
	return idArray?.includes(userId);
}

export const capitalizeFirstLetter = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getCapitalizedFirstLetter = (str: string): string => {
	return str?.charAt(0).toUpperCase();
};

export const toggleItemInArray = <T>(array: T[], item: T): T[] => {
	const index = array.indexOf(item);
	if (index === -1) {
		// If item is not in array, add it
		return [...array, item];
	} else {
		// If item is in array, remove it
		return array.filter((_, i) => i !== index);
	}
};
