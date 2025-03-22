import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../config/axios_config"


export const fetchAllDoctors = createAsyncThunk(
    'fetchAllDoctors',
    async ({page = 1,limit = 6,filters = {}},thunkApi) => {
      try {
        const params = {page,limit,...filters};
        const response = await axiosInstance.get('/api/doctors/get-eligible-doctors-with-filter',{params,withCredentials:true},)
        if(response.status === 200) return response.data;
        // console.log("Redux store  doctorList data: ",response);
      } catch (err) {
        return thunkApi.rejectWithValue(err);
      }
    },
  )



  export const getAllAppointmentsToday = createAsyncThunk(
    'getAllAppointmentsToday',
    async({doctorId},thunkApi)=>{
      try{
        const response = await axiosInstance.get(`/api/doctors/get-all-appointments-today/?doctorId=${doctorId}`,{withCredentials:true});
        if(response.status === 200) return response.data;
      }catch(err){
        return thunkApi.rejectWithValue(err);
      }
    }
  )

  export const addPrescription = createAsyncThunk(
    'addPrescription',
    async({appointmentId,prescriptionBlob},thunkApi)=>{
      try{
        
        // console.log(prescription);
        const formData = new FormData();
        formData.append('prescriptionPDF',prescriptionBlob,"prescription.pdf");
        formData.append('appointmentId',appointmentId);

        const response = await axiosInstance.post(`/api/appointments/add-prescription`,formData,{withCredentials:true});
        if(response.status === 200) return response.data;
      }catch(err){
        return thunkApi.rejectWithValue(err);
      }
    }
  )

  export const completeAppointment = createAsyncThunk(
    'completeAppointment',
    async({appointmentId,doctorId,patientId,prescriptionBlob},thunkApi)=>{
      try{
        const formData = new FormData();
        if(prescriptionBlob){
          formData.append('prescriptionPDF',prescriptionBlob,"prescription.pdf");
        }
        formData.append('appointmentId',appointmentId);
        formData.append('patientId',patientId);
        formData.append('doctorId',doctorId);
        const response = await axiosInstance.post(`/api/appointments/complete-appointment`,formData,{withCredentials:true});
        if(response.status === 200) return response.data;
      }catch(err){
        return thunkApi.rejectWithValue(err);
      }
    }
  )

  export const cancelAppointment = createAsyncThunk(
    'cancelAppointment',
    async({appointmentId},thunkApi)=>{
      try{
        const response = await axiosInstance.post(`/api/appointments/cancel-appointment`,{appointmentId},{withCredentials:true});
        if(response.status === 200) return response.data;
      }catch(err){
        return thunkApi.rejectWithValue(err);
      }
    }
  )

  export const fetchDoctorHistory = createAsyncThunk(
    'fetchDoctorHistory',
    async({doctorId},thunkApi)=>{
      try{
        const response = await axiosInstance.get(`/api/doctors/fetch-history/?doctorId=${doctorId}`,{withCredentials:true});
        if(response.status === 200) return response.data;
      }catch(err){
        return thunkApi.rejectWithValue(err);
      }
    }
  )

  export const fetchAllChambers = createAsyncThunk( 
    'fetchAllChambers',
    async({doctorId},thunkApi)=>{
      try{
        const response = await axiosInstance.get(`/api/doctors/get-all-chambers/?doctorId=${doctorId}`,{withCredentials:true});
        if(response.status === 200) return response.data;
      }catch(err){
        return thunkApi.rejectWithValue(err);
      }
    }
  )

  export const fetchDoctorInfo = createAsyncThunk(
    'fetchDoctorInfo',
    async({doctorId},thunkApi)=>{
      try{
        const response = await axiosInstance.get(`/api/doctors/get-doctor-info/?doctorId=${doctorId}`,{withCredentials:true});
        if(response.status === 200) return response.data;
      }catch(err){
        return thunkApi.rejectWithValue(err);
      }
    }
  )




const doctorSlice  = createSlice({
    name : 'doctor',
    initialState :{
    currentDoctor:null,
    doctorInfos : null,
    currentChambers:[],
    appointments:[],
    doctorHistory:[], // to be used only if the doctor wants to see his history [ of appointments ]
    doctorDetailsPage:false,
    doctorlist: [],
    loading: false,
    error: null,
    filters: {
      name:'',
      specialization: '',
      location: '',
      // Add more filters as needed
    },
    pagination: {
      currentPage: 1,
      totalPages: 0,
      limit: 6,
      totalDoctors: 0,
    },
  },
    reducers:{
      setPage: (state, action) => {
        state.pagination.currentPage = action.payload;
      },
      setFilters: (state, action) => {
        state.filters = { ...state.filters, ...action.payload };
        state.pagination.currentPage = 1; // Reset page to 1 when filters change
      },
      setPageLimit: (state, action) => {    
        state.pagination.limit = action.payload;
        state.pagination.currentPage = 1; // Reset page to 1 when filters change
      },
      setDoctorDetailsPage:(state,action)=>{
        state.doctorDetailsPage = true
      },
      unsetDoctorDetailsPage:(state,action)=>{
        state.doctorDetailsPage = false
      },
      setCurrentDoctor:(state,action)=>{
        state.currentDoctor = action.payload
      },
      unsetCurrentDoctor:(state,action)=>{
        state.currentDoctor = null
      },
      removeAppointment:(state,action)=>{
        state.appointments = state.appointments.filter(appointment=>appointment._id !== action.payload.appointmentId)
      } 

    },
    extraReducers:
      async(builder)=>{

        // for getting all doctors
        builder.addCase(fetchAllDoctors.pending,(state,action)=>{
          state.loading = true;
        })
        builder.addCase(fetchAllDoctors.fulfilled,(state,action)=>{
          state.doctorlist = action.payload.doctors;
          state.pagination.totalPages = action.payload.pageCount;
          state.loading = false;
        })
        builder.addCase(fetchAllDoctors.rejected,(state,action)=>{
          state.error = action.payload;
          state.pagination.totalPages = 1;
          state.loading = false;
        })


        // for getting all appointments today
        builder.addCase(getAllAppointmentsToday.pending,(state,action)=>{
          state.loading = true;
        })
        builder.addCase(getAllAppointmentsToday.fulfilled,(state,action)=>{
          state.appointments = action.payload.appointments;
          state.loading = false;
        })
        builder.addCase(getAllAppointmentsToday.rejected,(state,action)=>{
          state.error = action.payload;
          state.loading = false;
        })

        // for adding prescription
        builder.addCase(addPrescription.pending,(state,action)=>{
          state.loading = true;
        })
        builder.addCase(addPrescription.fulfilled,(state,action)=>{
          state.loading = false;
        })
        builder.addCase(addPrescription.rejected,(state,action)=>{
          state.error = action.payload;
          state.loading = false;
        })

        // for completing the appointment by adding the appointment ids in the history of the doctor and the patient
        builder.addCase(completeAppointment.pending,(state,action)=>{
          state.loading = true;
        })
        builder.addCase(completeAppointment.fulfilled,(state,action)=>{
          state.loading = false;
        })
        builder.addCase(completeAppointment.rejected,(state,action)=>{
          state.error = action.payload;
          state.loading = false;  
        })

        // for cancelling the appointment
        builder.addCase(cancelAppointment.pending,(state,action)=>{
          state.loading = true;
        })
        builder.addCase(cancelAppointment.fulfilled,(state,action)=>{
          state.loading = false;
        })
        builder.addCase(cancelAppointment.rejected,(state,action)=>{
          state.error = action.payload;
          state.loading = false;
        })
        


        // for getting doctor history
        builder.addCase(fetchDoctorHistory.pending,(state,action)=>{
          state.loading = true;
        })
        builder.addCase(fetchDoctorHistory.fulfilled,(state,action)=>{
          state.doctorHistory = action.payload.historyArray;
          state.loading = false;
        })
        builder.addCase(fetchDoctorHistory.rejected,(state,action)=>{
          state.error = action.payload;
          state.loading = false;
        })

        // fetching all chambers for the current doctor
        builder.addCase(fetchAllChambers.pending,(state,action)=>{
          state.loading = true;
        })
        builder.addCase(fetchAllChambers.fulfilled,(state,action)=>{
          state.loading = false;
          state.currentChambers = action.payload.chambers;
        })
        builder.addCase(fetchAllChambers.rejected,(state,action)=>{
          state.error = action.payload;
          state.loading = false;
        })

        // fetch doctor info for editing the doctor info
        builder.addCase(fetchDoctorInfo.pending,(state,action)=>{
          state.loading = true;
        })
        builder.addCase(fetchDoctorInfo.fulfilled,(state,action)=>{
          state.loading = false;
          state.doctorInfos = action.payload.doctorInfos;
        })
        builder.addCase(fetchDoctorInfo.rejected,(state,action)=>{
          state.error = action.payload;
          state.loading = false;
        })



    }
  }
)


export default doctorSlice;
export const doctorActions = doctorSlice.actions;


