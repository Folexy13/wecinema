import React from "react";
import { truncateText } from "../utilities/helperfFunction";

interface HTMLRendererProps {
	htmlString: string;
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({ htmlString }) => {
	const result = truncateText(htmlString, 12000);
	return <div dangerouslySetInnerHTML={{ __html: result }} />;
};

export default HTMLRenderer;
