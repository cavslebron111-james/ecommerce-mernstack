import React,{useEffect,useState} from 'react'
import Axios from 'axios';
//import {response} from 'express'

function HistoryPage() {
   
   const [History,SetHistory]= useState([])
   useEffect(() => {
       Axios.get('/api/users1/getHistory')
           .then(response =>{
               if(response.data.success){
                 SetHistory(response.data.history)
               }else {
                   alert('failed to get history items')
               }
           })
       
       
   }, [])
   
    return (
        <div style={{width:'80%',margin:'3rem auto'}}>
        <div style={{textAlign:'center'}}>
        <h1>History</h1>
        </div>
<br />
<table>
<thead>
<tr>
   <th>Payment Id</th>
   <th>Price</th>
   <th>Quantity</th>
   <th>Date of Purchase</th>
</tr>

</thead>
<tbody>
{History.map(item =>(
   <tr key={item._id}>
    <td>{item.paymentId}</td>
    <td>{item.price}</td>
    <td>{item.quantity}</td>
    <td>{item.dateofPurchase}</td>
    </tr>
    ))}

</tbody>

</table>

            
        </div>
    )
}

export default HistoryPage
