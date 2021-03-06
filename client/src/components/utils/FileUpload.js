import React,{useState} from 'react';
import Dropzone from 'react-dropzone';
import {Icon} from 'antd';
import Axios from 'axios'



function FileUpload(props) {
    const [images,setImages]=useState([])

const onDrop = (files)=>{
    let formData = new FormData();
    const config = {
        header:{'content-type':'multipart/form-data'}
    }
   
   
    formData.append('file',files[0])
    //when we click an image then save the image we chose inside node server
    console.log('formdata',files[0])
    Axios.post('/api/product/uploadImage',formData,config)
    
    .then(response =>{
        if(response.data.success){
            setImages([...images,response.data.image])
            props.refreshFunction([...images,response.data.image])
            
        }else
        {
            alert('failed to save the image in server')
        }
    })
}

    const onDelete = (image) => {
    console.log('theimageis',image)
    Axios.post(`/api/product/deleteImage?imagefile=${image}`)
    .then(response =>{
            if(response.data.success){
               setImages([...images,response.data.image])
                props.refreshFunction([...images,response.data.image])
                
           }else
         {
                 alert('failed to delete the image in server')
            }
         })
    const currentIndex = images.indexOf(image)
    console.log('currentindex',currentIndex)
   let newImages = [...images]
   newImages.splice(currentIndex,1)

setImages(newImages)
props.refreshFunction(newImages)

}

    return (
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <Dropzone 
          onDrop={onDrop}
          multiple={false}
          maxSize={800000000} >
          {({getRootProps, getInputProps})=> (
              <div style={{width:'300px',height:'240px',border:'1px solid lightGray',display:'flex'
            ,alignItems:'center',justifyContent:'center'}}
               {...getRootProps()}>
               <input {...getInputProps()} />
               <Icon type="plus" style={{fontSize:'3rem'}} />
              </div>
          )}
          
          
          </Dropzone>
        <div style={{display:'flex',width:'350px',height:'240px',overFlowX:'scroll'}}>
        
        {images.map((image,index)=>(
            <div onClick = {() => onDelete(image)}>
            <img style={{minWidth:'300px',width:'300px',height:'240px'}} src={`http://localhost:5000/${image}`} alt={`productImg-${index}`} />
            </div>
        ))}
        
        </div>
        
        
        
        
        
          </div>
    )
}

export default FileUpload
