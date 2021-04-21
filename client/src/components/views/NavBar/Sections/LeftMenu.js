import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
    <Menu.Item key="mail">
      <a href="/">Home</a>
    </Menu.Item>
    <SubMenu title={<span>Settings</span>}>
      <MenuItemGroup title="List">
        <Menu.Item key="setting:1">Users List</Menu.Item>
        <Menu.Item key="setting:2"><a href="/ProductLIst">Products List</a></Menu.Item>
      </MenuItemGroup>
      <MenuItemGroup title="FileSize">
        <Menu.Item key="setting:3">User FileSize</Menu.Item>
        <Menu.Item key="setting:4">Products FileSize</Menu.Item>
      </MenuItemGroup>
    </SubMenu>
  </Menu>
  )
}

export default LeftMenu