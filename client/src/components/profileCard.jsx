import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../config/axios_config";
import { Button, Popover } from 'antd';
import { editProfileImage, editUserDetails } from "../store/userState";


function ProfileCard({ user }) {
  // const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {}, [user]);

  const [image, setImage] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);

  const dispatch = useDispatch()

  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });



  // const [isMouseOverPic , setIsMouseOverPic] = useState(false);

  const onChangeHandler = (e) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const imageSubmitHandler = async () => {
    try {
      if (!image) return;

      const formData = new FormData();

      formData.append("profileImage", image);
      // console.log(formData);
      const response = await axiosInstance.post(
        "/api/users/upload-profile-image",
        formData,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error("Error while uploading image", err);
      console.log(err);
    }
  };

  // console.log(user);

  // ProfileCard.js

  const handleEditClick = () => setIsEditMode(true);
  const handleClose = () => setIsEditMode(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSave = () => {
    
    setIsEditMode(false);

    dispatch(
      editUserDetails(profile,{signal:null})
    )

    dispatch(
      editProfileImage({image},{signal:null})
    )

  
  }

  return (
    <div className="md:min-w-72 mx-auto bg-white  rounded-lg overflow-hidden">
      <div className="flex justify-center mt-1 bg-slate-300 mx-24 rounded-full">
        <img
          className="w-24 h-24 rounded-full object-cover"
          src={`${user?.profileImage}`}
          alt="Profile"
        />
      </div>
      <div className="text-center mt-2">
        <h2 className="text-lg font-semibold">{profile.name}</h2>
        <p className="text-gray-600">{profile.email}</p>
      </div>
      <div className="flex justify-center mt-4 mb-4">
        <button
          onClick={handleEditClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>

      {isEditMode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <div className="flex justify-center mt-4">
              {/* <img
                className="w-24 h-24 rounded-full object-cover"
                src="https://via.placeholder.com/100"
                alt="Profile"
              />
              <ChangeImagePopOver setProfile = {setProfile}/> */}
              <ImageUpload  setImage={setImage}/>
            </div>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full mb-3 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full mb-3 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileCard;



import ImageUpload from "./imageUpload";


const ChangeImagePopOver = ({setProfile}) => {
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  return (
    <Popover
      content={<ImageUpload setProfile={setProfile} />}
      title="Title"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div className="px-2 py-1" ><i class="ri-pencil-line"></i></div>
    </Popover>
  );
};



// <div className="bg-white rounded-lg p-6 min-w-72 ">
//   <div className="flex flex-col items-center">
//     <img
//       className="w-32 h-32 rounded-full object-cover"
//       src={user?.profileImage}
//       alt="User Avatar"
//     />

//     <div className="flex flex-col items-center pt-4">
//       <h2 className="text-xl font-semibold">{user?.username}</h2>
//       <p className="text-gray-800">{user?.email}</p>
//     </div>
//   </div>

//   <div className="flex  justify-center align-middle">
//     <div className=" flex  justify-center  flex-col ">
//       <lebel> upload Profile Image</lebel>
//       <input type="file" name="profileImage" onChange={onChangeHandler} />
//       <div>
//         <button
//           className="px-4 py-2 my-3 bg-blue-500 hover:bg-blue-600 rounded-md"
//           onClick={OnSubmitHandler}
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   </div>

//   {/* <div className="mt-6 flex justify-center">
//         <button className=" min-w-24 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300">
//           Logout
//         </button>
//       </div> */}
// </div>
