import React,{useState} from 'react'
import {Button,Icon} from 'antd'

function UserCardBlock(props) {
    console.log('cardprops',props)
   
    
    
   
   const renderCartImages = (images) => {
       if(images.length > 0) {
           let image = images[0]
           return `http://localhost:5000/${image}`
       } 
   }

    

    const renderItems=()=>(
      props.products && props.products.map(product=>(
        <tr key={product._id}>
        <td>
        <img style={{width:'70px'}} alt="product"
         src={renderCartImages(product.images)}/>
        </td>
        <td>{product.quantity} EA</td>
        <td>${product.price}</td>
      
        <td><Button onClick={()=>props.removeItem(product._id)}>Remove</Button></td>
        <td> <Button onClick={()=>props.addQty(product._id)}><Icon type="plus"/></Button></td>
       <td><Button onClick={()=>props.decreaseItem(product._id)}><Icon type="minus"/></Button></td>
        
        
        </tr>
    ))
    )
  
   
    return (
        <div>
            <table>
            <thead>
            <tr>
            <th>Product Image</th>
            <th>Product Quantity</th>
            <th>Product Price</th>
            <th>Remove Items</th>
            <th>Increase</th>
           
            <th>Decrease</th>
            </tr>
            </thead>
            
            <tbody>
            {renderItems()}
            </tbody>
            
            
            
            
            
            
            
            
            
            
            </table>
        </div>
    )
}

export default UserCardBlock
