import React from "react";
import styled, { keyframes } from "styled-components";

// Skeleton styles
const skeletonAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const SkeletonContainer = styled.div`
	margin-bottom: 2em;
`;

const SkeletonImage = styled.div<any>`
	height: 200px;
	width:230px;
	border-radius: 6px;
	background: #94856799;
	margin-top: 10px;
	animation: ${skeletonAnimation} 1.5s infinite;
`;


const SkeletonLoader: React.FC<any> = ({ width }) => {
	return (
		<SkeletonContainer className="gallery">
			{/* <SkeletonAvatar /> */}
			<SkeletonImage width={width} className="llle" />
			{/* <SkeletonAuthor /> */}

			{/* <SkeletonFooter /> */}
		</SkeletonContainer>
	);
};

SkeletonLoader.defaultProps ={
    width: 200,
    
}
export default SkeletonLoader;
