import { Button } from 'antd';
import React, { useState } from 'react'
import { IoFileTrayOutline } from "react-icons/io5";
import { MdAttachment } from "react-icons/md";



function MyFileDragger({files,setFiles}) {

    
    
    
    
    // i want to create the use case where the user can upload multiple files at once
    // and the files will be displayed in the UI
    // i want to keep the file names clickable and open a modal to show the file
    // and the user can remove the files from the UI
    // and the user can submit the files to the server



    
    
    // const [files,setFiles] = useState([]);

    // if(files.length>0){
    //     console.log(files[0]);
    // }
    
    const handleFileChange = (e) =>{
        console.log(e.target.files[0]);

        if(e.target.files.length>0)
        setFiles([...files,e.target.files[0]]);
    }

    const fileClickHandler = (e) =>{
        // i want to open the file in another tab
        



    }

    


  return (
    <div  className='  w-96 justify-center items-center bg-gray-50 '>
        <label  className=' flex flex-col items-center justify-center w-full h-48 hover:bg-white hover:border-blue-500 border-[1px] border-dashed duration-300 ease-in-out rounded-sm'>
            <div className=' flex flex-col items-center'>
                <IoFileTrayOutline className=' text-3xl m-6 text-blue-500 font-bold'/>
                <p className=' font-normal font-serif  '>Click  or  drag  file  to  this  area  to  Upload</p>
                <p className=' font-sans text-gray-400'> Support for a single or bulk upload. </p>
            </div>  
            <input type='file' className=' hidden' onChange={handleFileChange}/>
        </label>
        {/* Now i will create a div to show to files chosen and a delete to remove from the chosen list */}
        <div>
            {files.map((file,index)=>(
                <div className='flex items-center'>
                    <MdAttachment className='text-2xl text-blue-500'/>
                    <div key={index} className=' flex justify-between items-center w-96 bg-white m-2 p-2 rounded-sm'>
                        <p onClick={fileClickHandler}>{file?.name}</p>
                        <button className=' shadow-lg hover:shadow-inner p-1 ' onClick={()=>setFiles(files.filter((f,i)=>i!==index))}><i className="ri-delete-bin-line"></i></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default MyFileDragger

