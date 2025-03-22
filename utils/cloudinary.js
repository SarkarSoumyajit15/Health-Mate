import cloudinary from "../config/CloudinaryConfig.js";
import fs from "fs"




const uploadOnCloudinary = async (localFilePath,folderName,resourceType) => {

  try {
    if (!localFilePath) {
      return null;
    }
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType,
            folder: folderName,
        },
        function(error,result){
          console.log("result",result);
          console.log("error",error)
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);

        // fs.unlinkSync(localFilePath)

        console.log(response);
        return response;


  } catch (error) {
      fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
      return null;
  }
}



export {uploadOnCloudinary}