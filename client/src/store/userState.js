import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../config/axios_config";


export const editUserDetails = createAsyncThunk('editUserDetails', async ({updatedDetails},thunkApi)=>{
    try{
        const response = await axiosInstance.post(`/api/users/edit-user-details`,
            {updatedDetails},
            {withCredentials:true}
        );
        if(response.status === 200) return response.data;
    }catch(err){
        return thunkApi.rejectWithValue(err);
    }
})

export const editProfileImage = createAsyncThunk('editProfileImage', async ({image},thunkApi)=>{
    try {
        if (!image) return;
  
        const formData = new FormData();
  
        formData.append("profileImage", image);
        // console.log(formData);
        const response = await axiosInstance.post(
          "/api/users/edit-profile-image",
          formData,
          { withCredentials: true }
        );
        if (response.status == 200) {
          return response.data;
        }
        else return thunkApi.rejectWithValue(response.data.error);
      } catch (err) {
        return thunkApi.rejectWithValue(err);
      }
})

export const fetchUserHistory = createAsyncThunk('fetchUserHistory', async (thunkApi)=>{
    try{
        const response = await axiosInstance.get(`/api/users/fetch-history/?userId`,{withCredentials:true});
        if(response.status === 200) return response.data;
    }catch(err){
        return thunkApi.rejectWithValue(err);
    }
})





const userSlice  = createSlice({
    name : 'user',
    initialState : 
    {
        user : null,
        unseenNotifications :[],
        seenNotifications : [],
        userHistory : [],
        loading : false,
        error : null,
    },
    reducers:{
        setUser : (state,actions)=>{
            state.user = actions.payload.user;
        },
        unsetUser : (state)=>{
            state.user = null;
        },
        setUnseenNotification : (state,actions)=>{
            state.unseenNotifications = actions.payload.unseenNotifications;
        },
        setSeenNotification : (state,actions)=>{
            state.seenNotifications = actions.payload.seenNotifications;
        },
        unsetOneSeenNotification : (state,actions)=>{
            state.seenNotifications = state.seenNotifications.filter((notification)=>notification._id !== actions.payload.notificationId);
        },
        unsetAllSeenNotifications : (state)=>{
            state.seenNotifications = [];
        },
        setOneNotificationAsSeen : (state,actions)=>{
            state.unseenNotifications = state.unseenNotifications.filter((notification)=>notification._id !== actions.payload.notificationId);
            state.seenNotifications = [...state.seenNotifications,actions.payload.notification];
        },
        changeNotificationType : (state,actions)=>{
            // find the respective notification using the notification Id and change the type of notification to the new type present in the payload
            let notification = state.unseenNotifications.find((notification)=>notification._id == actions.payload.notificationId);
            if(!notification) notification = state.seenNotifications.find((notification)=>notification._id == actions.payload.notificationId);
            if(!notification) return;
            notification.type = actions.payload.newType;
        },
        editUserDetails : (state,actions)=>{
            state.user = {...user,...actions.payload.updatedDetails};
        }

    },
    extraReducers:
        async(builder)=>{
            builder.addCase(editUserDetails.fulfilled,(state,action)=>{
                state.user = action.payload.user;
            }),
            builder.addCase(editUserDetails.rejected,(state,action)=>{
                state.error = action.payload;
            }),
            builder.addCase(editUserDetails.pending,(state,action)=>{
                state.loading = true;
            })


            builder.addCase(editProfileImage.fulfilled,(state,action)=>{
                state.user = {...state.user,profileImage:action.payload?.image_url};
            }),
            builder.addCase(editProfileImage.rejected,(state,action)=>{
                state.error = action.payload;
            }),
            builder.addCase(editProfileImage.pending,(state,action)=>{
                state.loading = true;
            })


            // for fetching user history
            builder.addCase(fetchUserHistory.pending,(state,action)=>{
                state.loading = true;
            })
            builder.addCase(fetchUserHistory.fulfilled,(state,action)=>{
                state.userHistory = action.payload.historyArray;
                state.loading = false;
            })
            builder.addCase(fetchUserHistory.rejected,(state,action)=>{
                state.error = action.payload;
                state.loading = false;
            })
            
        }
    
})


export default userSlice;
export const userActions = userSlice.actions;


