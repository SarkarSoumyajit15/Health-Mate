import { useEffect, useState } from "react";
import {  Popover } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./config/axios_config";
import { userActions } from "./store/userState";
import toast from "react-hot-toast";
import Card from "./components/profileCard";
import ProfileCard from "./components/profileCard";

function Layout({ children }) {
  console.log(" At Layout");

  const [collapsed, setCollapsed] = useState(false);

  const { user, unseenNotifications } = useSelector((state) => ({
    user: state.user.user,
    unseenNotifications: state.user.unseenNotifications,
  }));

  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: <i className="ri-home-line"></i>,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <i className="ri-calendar-schedule-line"></i>,
    },
    {
      name: "Apply Doctors",
      path: "/apply-doctor",
      icon: <i className="ri-hospital-line"></i>,
    },
    {
      name: "History",
      path: "/user-appointment-history",
      icon: <i className="ri-history-line"></i>,
    },
    // {
    //   name:"Logout",
    //   path:"/logout",
    //   icon:<i className="ri-logout-circle-line"></i>,
    // },
  ];

  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: <i className="ri-home-line"></i>,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <i className="ri-calendar-schedule-line"></i>,
    },
    {
      name: "History",
      path: "/doctor-appointment-history",
      icon: <i className="ri-history-line"></i>,
    },
    {
      name: "Edit Doctor Info",
      path: "/edit-doctor-info",
      icon: <i className="ri-edit-box-line"></i>,
    },
    // {
    //   name:"Logout",
    //   path:"/logout",
    //   icon:<i className="ri-logout-circle-line"></i>,
    // },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menu, setMenu] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const toggleProfileCard = () => {
    setIsVisible(!isVisible); // Toggle the visibility state
  };

  const handleLogout = async (event) => {
    try {
      event.preventDefault();
      const response = await axiosInstance.post(
        "/api/users/logout",
        {},
        { withCredentials: true }
      );
      if (response?.data?.success) dispatch(userActions.unsetUser());
      navigate("/login");
      toast.success("Logged Out successfully");
    } catch (error) {
      toast.error(`Could not log out ${error}`);
    }
  };

  const fetchUnseenNotifications = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/users/fetchUnseenNotifications",
        { withCredentials: true }
      );

      if (response?.data?.success) {
        dispatch(
          userActions.setUnseenNotification({
            unseenNotifications: response?.data?.unSeenNotifications,
          })
        );
      }
    } catch (error) {
      toast.error(`Error while fetching unseen notifications : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  };

  const fetchSeenNotifications = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/users/fetchSeenNotifications",
        { withCredentials: true }
      );
      if (response?.data?.success) {
        dispatch(
          userActions.setSeenNotification({
            seenNotifications: response?.data?.seenNotifications,
          })
        );
      }
    } catch (error) {
      toast.error(`Error while fetching seen notifications : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnseenNotifications();
      fetchSeenNotifications();
    }
    if (user?.isDoctor) setMenu(doctorMenu);
    else setMenu(userMenu);
  }, [user]);

  const toggleCollapseHandler = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <div
        className={`fixed right-3 top-32 min-h-max w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          isVisible
            ? "translate-x-0"
            : "translate-x-full transform transition-opacity duration-300 opacity-0"
        }`}
      >
        <ProfileCard user={user} />
      </div>
      <div className="z-10 bg-violet-100 w-screen overflow-x-hidden">
        <div className=" m-1 p-1 flex min-h-dvh min-w-full">
          <div className="  p-2 mb-5  bg-blue-100 min-w-max rounded-md">
            <div className="flex justify-center mb-14">
              <h1 className=" font-serif font-semibold text-lg text-blue-700">
                HM
              </h1>
            </div>

            <div className="">
              <div
                className="m-2 p-2 cursor-pointer rounded-sm hover:bg-blue-200 duration-300 ease-in-out "
                onClick={toggleCollapseHandler}
              >
                {collapsed ? (
                  <i className="ri-menu-unfold-line"></i>
                ) : (
                  <i className="ri-menu-fold-line"></i>
                )}
              </div>

              {menu &&
                menu.map((icons, index) => (
                  <Link
                    key={index}
                    to={icons.path}
                    className=" flex m-2 p-2 rounded-md hover:bg-blue-200 duration-150 ease-in-out"
                  >
                    <div className="m-1">{icons.icon}</div>
                    {!collapsed && (
                      <div className=" m-1 ml-3">{icons.name}</div>
                    )}
                  </Link>
                ))}

              <div
                className="m-2 p-2 cursor-pointer rounded-sm hover:bg-blue-200 duration-300 ease-in-out flex "
                onClick={handleLogout}
              >
                <div className="m-1">
                  <i className="ri-logout-circle-line"></i>
                </div>
                {!collapsed && <div className=" m-1 ml-3">Logout</div>}
              </div>
            </div>
          </div>

          <div
            className={` ml-1 mb-4 min-w-full min-h-screen ${
              !collapsed ? "pr-56" : "pr-24"
            }`}
          >
            <div className=" ml-1 flex justify-between  items-center bg-blue-600 min-h-10 rounded-md px-4 py-3">
              <div className="">
                {user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User"}
              </div>
              <div className="flex justify-between">
                <div
                  className="flex px-2 py-1 pr-4"
                  onClick={() => {
                    navigate("/notifications");
                  }}
                >
                  <div className=" cursor-pointer text-xl hover:text-gray-200 duration-300 ease-in-out ">
                    <i className="ri-notification-4-line"></i>
                  </div>
                  {unseenNotifications?.length > 0 && (
                    <span className="relative flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-red-900"></span>
                    </span>
                  )}
                </div>

                <Popper user={user} />

              </div>
            </div>

            <div className="min-h-screen p-1  m-1 border-2  bg-blue-50 border-slate-200 rounded-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Popper = ({ user }) => {
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  return (
    <Popover
      content={
        <div>
          <div className="flex justify-end">
            <a onClick={hide}>Close</a>
          </div>
          <div className="">
            <ProfileCard user={user} />
          </div>
        </div>
      }
      // title="Title"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div
        className="px-2 py-1 cursor-pointer text-xl hover:text-gray-200 duration-300 ease-in-out"
      >
        <i className="ri-account-circle-line"></i>
      </div>
    </Popover>
  );
};

export default Layout;

                // <div
                //   className="px-2 py-1 cursor-pointer text-xl hover:text-gray-200 duration-300 ease-in-out"
                //   onClick={toggleProfileCard}
                // >
                //   <i className="ri-account-circle-line"></i>
                // </div>