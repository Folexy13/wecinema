import React from "react";
// import { truncateText } from "../utilities/helperfFunction";

interface HTMLRendererProps {
	htmlString: string;
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({ htmlString }) => {
	return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

export default HTMLRenderer;
