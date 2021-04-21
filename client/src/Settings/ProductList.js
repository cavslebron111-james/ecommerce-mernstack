import React,{useState,useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {deleteItemProduct} from '../_actions/product_action';
import {EditOutlined,DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {Button,Row,Col,Input,Icon, Modal} from 'antd';
import Axios from 'axios'
import {price,Prod_Cat} from './../components/views/LandingPage/sections/datas';
import SearchFeature from './../components/views/LandingPage/sections/SearchFeature';
import CheckBox from './../components/views/LandingPage/sections/CheckBox';
import RadioBox from './../components/views/LandingPage/sections/RadioBox';
import ImageSlider from '../../../client/src/components/utils/ImageSlider';



const {TextArea} = Input;
const { confirm } = Modal;
let born = false
function ProductList(props)
 {
    console.log('productlistprops',props)
    const dispatch = useDispatch();
  
    console.log('ProductListprops',props)
   const [Products,SetProducts] = useState([])
   const [Skip,SetSkip] = useState(0)
   const [Limit,SetLimit]= useState(4)
   const [PostSize,SetPostSize] = useState(0)
   const [SearchTerms,SetSearchTerms] = useState("")
   const [Filters,SetFilters] = useState({
    Prod_Cat:[],
    price:[]
})
const [CategoryValue,setCategoryValue] = useState(1)
const [CatValue,SetCatValue] = useState(0)

useEffect(() => {
   
    const variables = {
        skip:Skip,
        limit:Limit,
    }
   
      getProductsList(variables)
},[ ])


const getProductsList=(variables)=>{
        Axios.post('/api/product/getProductsList',variables)
    .then(response=>{
        if(response.data.success){
           // if(variables.loadMore){
              //  SetProducts([...Products,...response.data.products])
           // } else {
                SetProducts(response.data.products)
            //}
    
    SetPostSize(response.data.PostSize)
    console.log('the Products all is',[...response.data.products])
        }else {
            alert('failed to fetch product data')
        }
    })
  }
   

  const renderCartImages = (images) => {
    if(images.length > 0) {
        let image = images[0]
        return `http://localhost:5000/${image}`
    } 
}

const onCategoryChange=(event)=>{
    setCategoryValue(event.currentTarget.value);
}

const editProduct=(id)=>{
   //let ids = props.match.params.PostId
    props.history.push(`/EditProduct/${id}`)
}
    
   
     const renderItems= Products.map(product=>(
    <tr key={product._id}>
     <td>
     <img style={{width:'70px'}} alt="product"
      src={renderCartImages(product.images)}/>
     </td>
     <td>{product.title} </td>
     <td>{product.description} </td>
     
     <td>{product.Prod_Cat} </td>
         <td>{product.price}</td>
    
         <td><Button onClick={()=>editProduct(product._id)}><EditOutlined twoToneColor="#eb2f96"/></Button></td>
         <td><Button onClick={()=>deleteProduct(product._id)}><DeleteOutlined twoToneColor="#eb2f96" /></Button></td>
     </tr>
       ))
     











   
    
   
    
    
    
   
 
    

    

  

  
   
       
     
        





  
    const onLoadMore = ()=>{
        let skip = Skip + Limit
        const variables = {
            skip:skip,
            limit:Limit,
            loadMore:true
        }
        getProductsList(variables);
        SetSkip(skip);
      }

      const showFilteredResults=(filters)=>{
        const variables = {
            skip:0,
            limit:Limit,
            filters:filters
        }
        getProductsList(variables)
        SetSkip(0)
    
       }
         const handlePrice=(value)=>{
            const data = price;
            let array=[];
            for(let key in data){
                console.log('key is',key)
                console.log('value is',value)
                if(data[key]._id === parseInt(value,10)){
                    array=data[key].array
                }
            }
            console.log('array',array)
            return array
        }
    
       const handleFilters=(filters,category)=>{
            console.log('filter is ' ,filters)
            const newFilters = {...Filters}
            newFilters[category] = filters
            if(category === 'price'){
                let priceValues=handlePrice(filters)
                newFilters[category] = priceValues
                console.log('newfilterscagetoryis',newFilters['Prod_Cat'])
            }
            console.log('newfilteris',newFilters)
            console.log('categoryis',category)
            showFilteredResults(newFilters)
            SetFilters(newFilters)
           
       }
    
       const updateSearchTerm=(newSearchTerm)=>{
           
           console.log('newsearch',newSearchTerm)
           const variables = {
            skip:0,
            limit:Limit,
            filters:Filters,
            searchTerm:newSearchTerm
        }
       
        SetSearchTerms(newSearchTerm)
        getProductsList(variables)
            SetSkip(0)
          
        
    }

    const deleteProduct=(id)=> {
        console.log('deleteid',id)
        confirm({
          title: 'Do you Want to delete these items?',
          icon: <ExclamationCircleOutlined />,
          content: 'Are you Sure',
          onOk() {
           dispatch(deleteItemProduct(id))
           const remainProduct = Products.filter(todo => {
            return todo._id !== id
           })
           SetProducts(remainProduct)
           
           
            
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }
      



    return (
        <div style={{width:'75%',margin:'2rem auto'}}>
        <div style={{textAlign:'center'}}>
        <h2>Products List<Icon type='robot' /> </h2>
        </div>

        <Row gutter={[16,16]}>
       <Col lg={12} xs={24}>
       {/* Filter  */}
       <CheckBox list={Prod_Cat}
       handleFilters={filters=>
        handleFilters(filters,'Prod_Cat')}/>
       </Col >
       <Col lg={12} xs={24}>
       
        <RadioBox list={price}
        handleFilters={filters=>
            handleFilters(filters,'price')}/>
       </Col>
       </Row>
        {/* Search */}
        <div style={{display:'flex',justifyContent:'flex-end',margin:'1rem auto'}}>
        <SearchFeature refreshFunction={updateSearchTerm} />
        </div>

        {Products.length === 0 ?
            <div style={{display:'flex',height:'300px',justifyContent:'center',alignItems:'center'}}>
            <h2>No Post Yet</h2>
            </div> :
        
        
            <table>
            <thead>
            <tr>
            <th>Product Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Product Category</th>
          
        
            <th>Product Price</th>
            <th>Edit</th>
            <th>delete</th>
           
           
           
           
            </tr>
            </thead>
            
            <tbody>
            {renderItems}
            </tbody>
            
            
            
            
            
            
            
            
            
            
            </table>}
        
       
       
            </div>
    )
}

export default ProductList