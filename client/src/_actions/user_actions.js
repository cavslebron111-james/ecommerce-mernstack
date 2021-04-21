import axios from 'axios';
//import { response } from 'express';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART_USER,
    GET_CART_ITEMS_USER,
    REMOVE_CART_ITEM,
    ON_SUCCESS_BUY,
    INCREASE_CART_USER,
    DECREASE_CART_USER,
    
} from './types';
import { USER_SERVER } from '../components/Config.js';


export function registerUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/register`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/login`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function addToCart(_id){
    
    const request = axios.post(`${USER_SERVER}/addToCart?productId=${_id}`)
    .then(response => response.data);

    return {
        type: ADD_TO_CART_USER,
        payload: request
    }
}


export function addToQty(_id){
    console.log('this id',_id)
    const request = axios.post(`${USER_SERVER}/addCart?productId=${_id}`)
    .then(response => response.data);

    return {
        type: INCREASE_CART_USER,
        payload: request
    }
}

export function subtractToQty(_id){

    const request = axios.post(`${USER_SERVER}/subtractCart?productId=${_id}`)
    .then(response => response.data);
 
      


    return {
        type: DECREASE_CART_USER,
        payload: request
    }
}







export function getCartItems(cartItems,userCart){
    console.log('cartItems',cartItems)
    const request = axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`)
    .then(response => {
      userCart.forEach(cartItem =>{
           response.data.forEach((productDetail,i)=>{
               if(cartItem.id === productDetail._id){
                   response.data[i].quantity = cartItem.quantity;
               }
           })
         })
           console.log('resdata',response.data);
      return response.data;
       })

    return {
        type: GET_CART_ITEMS_USER,
        payload: request
    }
}


export function removeCartItem(id){
    const request = axios.get(`/api/users1/removeFromCart?_id=${id}`)
    .then(response => {
     console.log('responsedatacartdetail',response.data.cartDetail)
        response.data.cart.forEach(item=>{
          response.data.cartDetail.forEach((k,i)=>{
              if(item.id === k._id){
                  response.data.cartDetail[i].quantity = item.quantity
              }
          })
      })


      return response.data;
       })

    return {
        type: REMOVE_CART_ITEM,
        payload: request
    }
}

export function onSuccessBuy(data){
        
    return {
              type: ON_SUCCESS_BUY,
              payload:data
          }
}


