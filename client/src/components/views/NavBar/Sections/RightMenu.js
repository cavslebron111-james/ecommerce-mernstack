/* eslint-disable jsx-a11y/anchor-is-valid */
import React,{useEffect,useState,Fragment} from 'react'
import { Menu,Icon,Badge} from 'antd';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function RightMenu(props) {
 
  
  const [Admin,SetAdmin]= useState(false)
   
  const user = useSelector(state => state.user)
  
  
 
  console.log('rightmenuuserprops',user)
  const logoutHandler = () => {
  axios.get(`${USER_SERVER}/logout`).then(response => {
  if (response.status === 200) {
   props.history.push("/login");
  } else {
   alert('Log Out Failed')
 }
});

  

};

useEffect(()=>{
  if(user.userData && user.userData.isAdmin === true){
    SetAdmin(true)
  } else
  SetAdmin(false)
  
},[user.userData && user.userData.isAdmin])




 
   
  
  
  if (user.userData && !user.userData.isAuth) {
    console.log('userpropsdata',user.userData)
    return(
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    )
  }  else {
    
    return (
      
      <Menu mode={props.mode}>
     
      {Admin ?
        <Menu.Item key="camera">
        <a href='/Cam'><AddAPhotoIcon></AddAPhotoIcon></a>
        </Menu.Item>: ""}
        {!Admin ?
        <Menu.Item key="history">
        <a href='/history'>History</a>
        </Menu.Item> : "" }
        {Admin ?
        <Menu.Item key="upload">
          <a href='/product/upload'>Upload</a>
          </Menu.Item>: "" }

         
         
          
         
        
         
        
         <Menu.Item key="cart">
        <Badge count={0}>
        <a href='/user/cart' style={{marginRight:-22,color:'#667777'}}>
          <Icon type='shopping-cart' style={{fontSize:30,marginBottom:4}} />
        </a>
        </Badge>
        </Menu.Item>
     
        <SubMenu title={<span>{user.userData && user.userData.name}</span>}>
        <MenuItemGroup title="E-commerce101">
            <Menu.Item key="logout">
            <a onClick={logoutHandler}>Upload Your Photo</a>
            </Menu.Item>
            <Menu.Item key="logout">
            <a onClick={logoutHandler}>Logout</a>
            </Menu.Item>
        
          
        </MenuItemGroup>
        </SubMenu>
     
        
     
     
      </Menu>
    )
  }

}




export default withRouter(RightMenu);

