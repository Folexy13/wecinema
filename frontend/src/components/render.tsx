import React from "react";

interface HTMLRendererProps {
	htmlString: string;
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({ htmlString }) => {
	return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

export default HTMLRenderer;
