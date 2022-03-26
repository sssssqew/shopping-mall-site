// npm i webpack@4.43.0 webpack-cli@3.3.12 webpack-dev-server@3.11.0

import HomeScreen from "./screens/HomeScreen.js"
import ProductScreen from "./screens/ProductScreen.js"
import CartScreen from "./screens/CartScreen.js"
import SigninScreen from "./screens/SigninScreen.js"
import RegisterScreen from "./screens/RegisterScreen.js"
import ProfileScreen from "./screens/ProfileScreen.js"
import ShippingSceen from "./screens/ShippingScreen.js"
import PaymentScreen from "./screens/PaymentScreen.js"
import PlaceOrderScreen from "./screens/PlaceOrderScreen.js"
import OrderScreen from "./screens/OrderScreen"
import DashboardScreen from "./screens/DashBoardScreen.js"
import Error404Screen from "./screens/Error404Screen.js"
import ProductListScreen from "./screens/ProductListScreen.js"
import OrderListScreen from "./screens/OrderListScreen.js"
import Header from "./components/Header.js"

import { hideLoading, parseRequestUrl, showLoading } from "./utils.js"

const routes = {
  "/": HomeScreen,
  "/product/:id": ProductScreen,
  "/order/:id": OrderScreen,
  "/cart/:id": CartScreen,
  "/cart": CartScreen,
  "/signin": SigninScreen,
  "/register": RegisterScreen,
  "/profile": ProfileScreen,
  "/shipping": ShippingSceen,
  "/payment": PaymentScreen,
  "/placeorder": PlaceOrderScreen,
  "/dashboard": DashboardScreen,
  "/productlist": ProductListScreen,
  "/orderlist": OrderListScreen
}

// #/product/12345 => /product/:id (parseUrl)
const router = async () => {
  showLoading()
  const request = parseRequestUrl()
  const parseUrl = (request.resource ? `/${request.resource}` : '/') + 
  (request.id ? '/:id' : '') + 
  (request.verb ? `/${request.verb}` : '')
  const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen

  const header = document.getElementById('header-container')
  header.innerHTML = await Header.render()
  if(Header.after_render) Header.after_render()

  const main = document.getElementById('main-container')
  main.innerHTML = await screen.render()
  if(screen.after_render) screen.after_render() 
  hideLoading()
}
window.addEventListener('load', router)
window.addEventListener('hashchange', router) // 해쉬태그 변경시 실행되는 이벤트