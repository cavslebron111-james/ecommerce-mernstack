import React,{useState,useEffect} from 'react';
import {Typography,Button,Form,message,Input,Icon} from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';
import {useDispatch} from 'react-redux'
import Dropzone from 'react-dropzone';



import { PRODUCT_SERVER } from '../../Config';

import {
    
    UPLOAD_PRODUCT
} from '../../../_actions/types';



const {Title} = Typography;
const {TextArea} = Input;

const category = [
    {key:1,value:'Television'},
    {key:2,value:'CellPhone'},
    {key:3,value:'Tablet'},
    {key:4,value:'Computer'},
    {key:5,value:'Clothes'},
    {key:6,value:'Shoes'},
    {key:7,value:'Sports Wear'},
    {key:8,value:'HouseHold Gadgets'},
    {key:9,value:'Bike'},
    {key:10,value:'Rides'},
    {key:11,value:'Foods'},
    {key:12,value:'Drinks'}

]
  


function EditProduct(props) {
      let productIds = props.match.params.PostId
    console.log('editproduct',props)
    const [TitleValue,setTitleValue] = useState('')
    const [DescriptionValue,setDescriptionValue] = useState('')
    const [PriceValue,setPriceValue] = useState ('')
    const [CategoryValue,setCategoryValue] = useState(1)
    const [images,setImages]=useState([])
    const [Product,SetProduct] = useState([])
    const dispatch = useDispatch();
    
   
   useEffect(() => {
       
    Axios.get(`/api/product/products_by_id?id=${productIds}&type=single`)
    .then(response =>{
        
        SetProduct(response.data[0])
       console.log('responseimageis',response.data[0].images)
          // const refreshFunction = ([...images,response.data[0].image])
         // setImages([...images,response.data[0].image])
         setImages(response.data[0].images)
         setTitleValue(response.data[0].title)
         setDescriptionValue(response.data[0].description)
         setPriceValue(response.data[0].price)
         setCategoryValue(response.data[0].Prod_Cat)

         
     
     
     
       
       
    
        
    })
   
    
       
   }, [  ])

  // ondrop
  
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
          //  props.refreshFunction([...images,response.data.image])
            
        }else
        {
            alert('failed to save the image in server')
        }
    })
}
   //delete
const onDelete = (image) => {
    console.log('theimageis',image)
    Axios.post(`/api/product/deleteImage?imagefile=${image}`)
    .then(response =>{
            if(response.data.success){
               setImages([...images,response.data.image])
              //  props.refreshFunction([...images,response.data.image])
                
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
//props.refreshFunction(newImages)

}
   
   
   
    const onTitleChange=(event)=>{
        setTitleValue(event.currentTarget.value);
    }
    const onDescriptionChange=(event)=>{
        setDescriptionValue(event.currentTarget.value);
    }
    const onPriceChange=(event)=>{
        setPriceValue(event.currentTarget.value);
    }
    const onCategoryChange=(event)=>{
        setCategoryValue(event.currentTarget.value);
    }

    const updateImages = (newImages) =>{
        console.log('newimage issss',newImages)
      
        setImages(newImages)
    }


    const onSubmit = (event) =>{
        event.preventDefault();
      console.log('imagesare',images)
      console.log('category',props.user.userData._id)
        //if (!TitleValue || !DescriptionValue || !PriceValue || !images || !CategoryValue){
         //  return alert('Please Enter all Information')
       // }
       
   const variables = {
   write:props.user.userData._id,
   title:TitleValue,
   description:DescriptionValue,
   price:PriceValue,
   images:images,
   Prod_Cat:CategoryValue

}
       
   console.log('variables',variables)
       const request = Axios.post(`/api/product/editProduct?productId=${Product._id}`,variables)
        .then(response => {
            if(response.data.success){
             alert('product successfully upload')
              props.history.push('/');

            }else {
                alert('failed to upload product');
            }
        })
  
    // return {
    //     type: EDIT_PRODUCT,
    //     payload: request
    // }
}
    

     
    

    return (
        <div style={{maxWidth:'700px',margin:'2rem auto'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
        <Title level={2}>Upload Product</Title>
    </div> 
  
    
    
    
    
    <Form onSubmit={onSubmit} >
    {/*dropzone*/}
   
  {/*  <FileUpload refreshFunction={updateImages} />*/}
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
  
  
  <br />
        <br />
       <label>Title</label>
        <Input onChange ={onTitleChange}
               value={TitleValue}
               type="text"
        />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange}
                  value={DescriptionValue}
                  />
        <br />
         <br />
         <label>Price</label>
         <Input onChange={onPriceChange}
                value={PriceValue}
                type="number"
                  />
                  <select onChange={onCategoryChange}><option value="none" selected disabled hidden> 
                  {CategoryValue}
              </option>
                  {category.map(item=> (
                   
                
                    <option key ={item.value} value={item.value}>{item.value} </option>
                  ))}
                  </select>
                  <br />
                  <br />
                  <Button onClick={onSubmit}>submit</Button>
                     
        
        </Form>
            
        </div>
    )
}

export default EditProduct

