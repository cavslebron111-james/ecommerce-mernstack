import React,{useState} from 'react';
import {Typography,Button,Form,message,Input,Icon} from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';
import {useDispatch} from 'react-redux'

import { PRODUCT_SERVER } from '../../Config';
//import {uploadProduct} from './../../../_actions/product_action'
//import { response } from 'express'
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
  
// const category = [
//     {key:1,value:'Television'},
//     {key:2,value:'CellPhone'},
//     {key:3,value:'Tablet'},
//     {key:4,value:'Computer'},
//     {key:5,value:'Clothes'},
//     {key:6,value:'Shoes'},
//     {key:7,value:'Sports Wear'},
//     {key:8,value:'HouseHold Gadgets'},
//     {key:9,value:'Bike'},
//     {key:10,value:'Rides'},
//     {key:11,value:'Foods'},
//     {key:12,value:'Drinks'}

// ]

function UploadProductPage(props) {
console.log('the propsuddser',props)
    const [TitleValue,setTitleValue] = useState('')
    const [DescriptionValue,setDescriptionValue] = useState('')
    const [PriceValue,setPriceValue] = useState ('')
    const [CategoryValue,setCategoryValue] = useState(1)
    const [images,setImages]=useState([])
    const dispatch = useDispatch();
    
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

    const updateImages = newImages =>{
        console.log('newimage is',newImages)
        setImages(newImages)
    }


    const onSubmit = (event) =>{
        event.preventDefault();
        if (!TitleValue || !DescriptionValue || !PriceValue || !images || !CategoryValue){
           return alert('Please Enter all Information')
        }
       
   const variables = {
   write:props.user.userData._id,
   title:TitleValue,
   description:DescriptionValue,
   price:PriceValue,
   images:images,
   Prod_Cat:CategoryValue,
}
       

       const request = Axios.post(`${PRODUCT_SERVER}/uploadProduct`,variables)
        .then(response => {
            if(response.data.success){
             alert('product successfully upload')
              props.history.push('/');

            }else {
                alert('failed to upload product');
            }
        })
  
    return {
        type: UPLOAD_PRODUCT,
        payload: request
    }
}
    

     
    

    return (
        <div style={{maxWidth:'700px',margin:'2rem auto'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
        <Title level={2}>Upload Product</Title>
        
        
        </div>
        <Form onSubmit={onSubmit} >
    {/*dropzone*/}
    <FileUpload refreshFunction={updateImages}/>

        <br />
        <br />
       <label>Title</label>
        <Input onChange ={onTitleChange}
               value={TitleValue}
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
                  <select onChange={onCategoryChange}> {category.map(item=> (
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

export default UploadProductPage

