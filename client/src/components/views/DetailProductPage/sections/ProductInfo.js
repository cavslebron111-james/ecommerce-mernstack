import React,{useEffect,useState} from 'react'
import {Button,Descriptions,Icon} from 'antd'
import LoginPage from '../../LoginPage/LoginPage';
import { useSelector } from "react-redux";
import {withRouter} from 'react-router-dom';
import {Link} from 'react-router-dom'


function ProductInfo(props) {
  let Id = props.match.params.productId;
  
  console.log('propsidis',Id)
  const [InCart,SetInCart]=useState(false);
  const [Admin,SetAdmin]= useState(false)
   const [Product,SetProduct] = useState({})
  const user = useSelector(state => state.user)
    console.log('user',user)
    console.log('infoprops',props)
  
 
     useEffect(()=>{
      if(user.userData && user.userData.isAuth === true){
        SetAdmin(true)
      } else{
        SetAdmin(false)
      }
       },[user.userData && user.userData.isAuth])
  
      useEffect(() => {
          SetProduct(props.detail)
      }, [props.detail])
    
      useEffect(() => {
        if(user.userData && user.userData.cart){
        
         
          checkId(user.userData.cart)
          
          
        }
         },[user.userData && user.userData.cart])


const checkId = (id)=>{
  let Id = props.match.params.productId;
    console.log('propsidis',Id)
   id.find(ids=>{
     if(ids.id === Id)
       SetInCart(true)
    })
     
   
  }






      const addToCartHandler=()=>{
          if(!Admin){
          props.history.push('/login')
          }else{
          props.addToCart(props.detail._id)
          console.log('whatid',props)
          props.history.push('/user/cart')
          
          
          }
      }
      return (
        <div>
        <Descriptions title="Product Info">
          <Descriptions.Item label="Price">{Product.price}</Descriptions.Item>
          <Descriptions.Item label="Sold">{Product.sold}</Descriptions.Item>
          <Descriptions.Item label="View">{Product.views}</Descriptions.Item>
          <Descriptions.Item label="Description">{Product.description}</Descriptions.Item>
          </Descriptions>
          <br/>
          <br/>
          <br/>
          <div style={{display:'flex',justifyContent:'center'}}>
               <Button  size='large' shape='round' type='danger'
               onClick={addToCartHandler}>
               Add to Cart</Button>
          </div>
          <br/>

          <div style={{display:'flex',justifyContent:'center'}}>
          <Button  size='large' shape='round' type='danger'
          onClick={()=>props.history.push('/')}>
          Back To Products</Button>
     </div>
         
         
   
        
        
        
        
        
        </div>
    )
}

export default withRouter(ProductInfo)
