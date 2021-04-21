import {
    DELETE_ITEM_PRODUCT,
    UPLOAD_PRODUCT
              

} from '../_actions/types';


export default function(state={},action){
    //const user = useSelector(state => state.user)
  
    switch(action.type){
       

                        case DELETE_ITEM_PRODUCT:
                            return {
                                ...state, 
                                productDetail:{
                                    ...state.productDetail}
                              
                            }

                            case UPLOAD_PRODUCT:
                                return {
                                    ...state.product, 
                                    product:action.payload
                                    
                                  
                                }
                        
        default:
            return state;
    }
}