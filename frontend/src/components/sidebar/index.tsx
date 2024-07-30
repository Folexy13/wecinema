import React, { useEffect, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { RiMovie2Line } from "react-icons/ri";
import { LiaSignInAltSolid } from "react-icons/lia";
import { HiUserAdd } from "react-icons/hi";
import { FaMoon } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
import { BiCameraMovie } from "react-icons/bi";
import { IoSunnyOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { TbVideoPlus } from "react-icons/tb";
import { decodeToken } from "../../utilities/helperfFunction";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { RiCustomerService2Line } from "react-icons/ri";
import axios from 'axios';

interface SidebarProps {
  expand: boolean;
  darkMode: boolean;
  toggleSigninModal?: any;
  toggleSignupModal?: any;
  toggleUploadScriptModal?: any;
  toggleUploadModal?: any;
  setDarkMode: any;
  isLoggedIn: any;
  toggleSignoutModal?: any;
  setLightMode: any;
}

const Sidebar: React.FC<SidebarProps> = ({
  expand,
  toggleSigninModal,
  toggleSignupModal,
  toggleSignoutModal,
  setLightMode,
  setDarkMode,
  darkMode,
  isLoggedIn,
  toggleUploadScriptModal,
  toggleUploadModal,
}) => {
  const token = localStorage.getItem("token") || null;
  const tokenData = decodeToken(token);
  const [hasPaid, setHasPaid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenData) {
      fetchPaymentStatus(tokenData.userId);
    }
  }, [tokenData]);

 

  const fetchPaymentStatus = async (userId: any) => {
    try {
      const response = await axios.get(`https://wecinema.onrender.com/user/payment-status/${userId}`);
      setHasPaid(response.data.hasPaid);
    } catch (error) {
      console.error('Payment status error:', error);
    }
  };

  const handleHypemodeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasPaid) {
      event.preventDefault();
      toast.info("You are already subscribed to Hypemode!");
    } else if (!hasPaid) {
        navigate("/hypemode");

    } 
  };

  return (
    <section
      className={`text-blue inset-0 desktop-sidebar overflow-auto mt-16 fixed border-r border-gray-200 ${
        expand ? "w-1/6" : "w-1/12 attach"
      } ${darkMode ? "bg-dark" : "bg-light"} ${
        darkMode ? "text-dark" : "text-light"
      }`}
    >
      <nav className="flex items-center justify-between p-2 my-3 pb-6">
        <ul className="border-b w-full border-gray-200 pb-4">
          <Link
            to="/"
            className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
              expand ? "" : "flex-col justify-center text-xs gap-1 specific"
            } ${window.location.pathname === "/" ? "active-button" : ""}`}
            style={{ marginTop: "30px" }}
          >
            <IoMdHome size="20" />
            <span className="text-sm">Home</span>
          </Link>
          <Link
            to="/hypemode"
            onClick={handleHypemodeClick}
            className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
              expand ? "" : "flex-col justify-center text-xs gap-1 specific"
            } ${
              window.location.pathname === "/hypemode" ? "active-button" : ""
            }`}
          >
            <RiMovie2Line size="20" />
            <span className="text-sm">Hype mode</span>
          </Link>
          <Link
            to="/videoeditor"
            className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
              expand ? "" : "flex-col justify-center text-xs gap-1 specific"
            } ${
              window.location.pathname === "/videoeditor" ? "active-button" : ""
            }`}
          >
            <TbVideoPlus size="20" />
            <span className="text-sm">Video Editor</span>
          </Link>
          <div
            className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
              expand ? "" : "flex-col justify-center text-xs gap-1 specific"
            } ${window.location.pathname === "/upload" ? "active-button" : ""}`}
            onClick={toggleUploadModal}
          >
            <BiCameraMovie size="20" />
            <span className="text-sm">{`Upload ${
              expand ? "Movie" : ""
            }`}</span>
          </div>
          <div
            className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
              expand ? "" : "flex-col justify-center text-xs gap-1 specific"
            } ${
              window.location.pathname === "/uploadscripts"
                ? "active-button"
                : ""
            }`}
            onClick={toggleUploadScriptModal}
          >
            <MdOutlineDescription size="20" />
            <span className="text-sm">{`${
              expand ? "Upload scripts" : "Add Scripts"
            }`}</span>
          </div>
          <Link
            to={tokenData ? `/user/${tokenData.userId}` : "#"}
            onClick={(event) => {
              if (!tokenData) {
                toast.error("Please login!!");
                event.preventDefault();
              }
            }}
            className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
              expand ? "" : "flex-col justify-center text-xs gap-1 specific"
            } ${
              window.location.pathname === `/user/${tokenData?.userId}`
                ? "active-button"
                : ""
            }`}
          >
            <CgProfile size="20" />
            <span className="text-sm">Profile</span>
          </Link>
        </ul>
      </nav>

      <nav className="container mx-auto items-center justify-between p-2 my-3">
        <h2 className={`font-bold ${expand ? "ml-4" : "text-sm text-center"}`}>
          Theme
        </h2>
        <ul className="border-b w-full border-gray-200 pb-4">
          <div
            className={`flex gap-4 mx-4 my-2 cursor-pointer items-center ${
              darkMode ? "text-active" : ""
            } ${expand ? "" : "flex-col justify-center text-xs gap-1 specific"} ${
              darkMode ? "active-button" : ""
            }`}
            onClick={setDarkMode}
          >
            <FaMoon size="15" />
            <span className={`cursor-pointer text-sm ${expand ?? "w-full"}`}>
              Dark mode
            </span>
          </div>
          <div
            className={`flex gap-4 mx-4 my-2 cursor-pointer items-center ${
              !darkMode ? "text-active" : ""
            } ${expand ? "" : "flex-col justify-center text-xs gap-1 specific"} ${
              !darkMode ? "active-button" : ""
            }`}
            onClick={setLightMode}
          >
            <IoSunnyOutline size="15" />
            <span className={`text-sm ${expand ?? "w-full"}`}>Light mode</span>
          </div>

          {isLoggedIn ? (
            <>
              <Link
                to="/"
                className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
                  expand ? "" : "flex-col justify-center text-xs gap-1 specific"
                } ${window.location.pathname === "/user" ? "active-button" : ""}`}
              >
                <FaUser size="20" />
                <span className="text-sm">{isLoggedIn.username}</span>
              </Link>
              <div
                className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
                  expand ? "" : "flex-col justify-center text-xs gap-1 specific"
                } ${
                  window.location.pathname === "/signout" ? "active-button" : ""
                }`}
                onClick={toggleSignoutModal}
              >
                <FaSignOutAlt size="20" />
                <span className="text-sm">{`${
                  expand ? "Sign out" : "Sign out"
                }`}</span>
              </div>
            </>
          ) : (
            <>
              <div
                className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
                  expand ? "" : "flex-col justify-center text-xs gap-1 specific"
                } ${
                  window.location.pathname === "/signin" ? "active-button" : ""
                }`}
                onClick={toggleSigninModal}
              >
                <LiaSignInAltSolid size="20" />
                <span className="text-sm">{`${
                  expand ? "Sign in" : "Sign in"
                }`}</span>
              </div>
              <div
                className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
                  expand ? "" : "flex-col justify-center text-xs gap-1 specific"
                } ${
                  window.location.pathname === "/signup" ? "active-button" : ""
                }`}
                onClick={toggleSignupModal}
              >
                <HiUserAdd size="20" />
                <span className="text-sm">{`${
                  expand ? "Sign up" : "Sign up"
                }`}</span>
              </div>
              
            </>
            
          )}
          <Link
                to="/customersupport"
                className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
                  expand ? "" : "flex-col justify-center text-xs gap-1 specific"
                } ${
                  window.location.pathname === "/customersupport"
                    ? "active-button"
                    : ""
                }`}
              >
                <RiCustomerService2Line size="20" />
                <span className="text-sm">Support</span>
              </Link>
        </ul>
      </nav>
    </section>
  );
};

export default Sidebar;
