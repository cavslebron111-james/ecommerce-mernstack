import axios from 'axios';
import {
    DELETE_ITEM_PRODUCT,
    UPLOAD_PRODUCT
} from './types';


import { PRODUCT_SERVER } from '../components/Config';







export function deleteItemProduct(_id){

    const request = axios.post(`${PRODUCT_SERVER}/deleteproduct?productId=${_id}`)
    .then(response => response.data);
 
      


    return {
        type: DELETE_ITEM_PRODUCT,
        payload: request
    }
}


//  export function uploadProduct(variable){
//     let history = useHistory()

//       console.log('variable',variable)
//       const request = axios.post(`${PRODUCT_SERVER}/uploadProduct`,variable)
//     // const request = axios.post('/api/product/uploadProduct',variable)
//         .then(response => {
//             if(response.data.success){
//              alert('product successfully upload')
//               history.push('/');

//             }else {
//                 alert('failed to upload product');
//             }
//         })
  
//     return {
//         type: UPLOAD_PRODUCT,
//         payload: request
//     }
// }

