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
    DELETE_ITEM_PRODUCT
              

} from '../_actions/types';

//import {useSelector} from 'react-redux';
 

export default function(state={},action){
    //const user = useSelector(state => state.user)
  
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return {...state, userData: action.payload }
        case LOGOUT_USER:
            return {...state }
            // case ADD_TO_CART_USER:
            //     return {
            //         ...state, userData:
            //         {...state.userData,
            //         cart:action.payload
            //         }
            //  }
            case ADD_TO_CART_USER:
                return {
                    ...state, 
                    userData: {...state.userData,cart: action.payload  }
                  
                  
             }
           
             case INCREASE_CART_USER:
                return {
                    ...state, 
                    userData: {...state.userData,cart:action.payload  }
                  
                  
             }

             case DECREASE_CART_USER:
             return {
                        ...state, 
                       userData: {...state.userData,cart:action.payload  }
                      
             }  
                 
                   
                
               
                  
                 
             
           
           
           
           
           
           
           
            case GET_CART_ITEMS_USER:
                return {
                    ...state, 
                    cartDetail:action.payload
                }

                case REMOVE_CART_ITEM:
                    return {
                        ...state, 
                        cartDetail:action.payload.cartDetail,
                        userData:{
                            ...state.userData,
                            cart:action.payload.cart
                        }
                    }
                    case ON_SUCCESS_BUY:
                        return {
                            ...state,
                            userData:{
                                ...state.userData,
                                cart:action.payload.cart
                            },
                            cartDetail:action.payload.cartDetail
                        }


                
        default:
            return state;
    }
}