// Popup.tsx
import React, { ReactNode } from "react";

interface IPopupProps {
	show: boolean | undefined;
	children: ReactNode;
	width?: string;
	height?: string;
	className?: string;
}
const Popup: React.FC<IPopupProps> = ({
	show,
	children,
	className,
}) => {
	return (
		<div
			className={`fixed  sm:top-0 z-50 left-0 sm:h-screen w-full flex justify-center items-center ${
				show ? "visible" : "invisible"
			} ${className}`}
		>
			<div className="fixed top-0 left-0 h-full w-full  bg-black bg-opacity-90 backdrop-filter backdrop-blur-15 flex items-center justify-center transition-opacity ease-in-out duration-300">
				<div
					className={`sm:w-2/6 modal min-h-2/6 w-5/6 bg-white rounded-md p-6
					} transition-transform transform translate-y-0 ease-in-out relative cursor-pointer shadow-md
					}`}
				>
					{children}
				</div>
			</div>
		</div>
	);
};

Popup.defaultProps = {
	show: true,
};

export default Popup;
