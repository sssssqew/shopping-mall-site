import axios from "axios"
import { apiUrl } from "./config"
import { getUserInfo } from "./localStorage"

export const getProduct = async (id) => {
  try{
    const response = await axios({
      url: `${apiUrl}/api/products/${id}`,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    })
    if(response.statusText !== 'OK'){ // response state 가 404 인 경우
      throw new Error(response.data.message) // response.data.message : 'Product Not Found!' // 에러 발생시 catch 구문이 실행됨
    }
    return response.data
  }catch(err){
    console.log(err)
    return {error: err.response.data.message || err.message}
  }
}
export const getProducts = async () => { // 전체 상품목록 가져오기
  try{
    const response = await axios({
      url: `${apiUrl}/api/products`,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    })
    if(response.statusText !== 'OK'){ // response state 가 404 인 경우
      throw new Error(response.data.message) // response.data.message : 'Product Not Found!' // 에러 발생시 catch 구문이 실행됨
    }
    return response.data
  }catch(err){
    console.log(err)
    return {error: err.response.data.message || err.message}
  }
}
export const signin =  async ({email, password}) => {
  try{
    const response = await axios({
      url: `${apiUrl}/api/users/signin`,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email,
        password
      }
    })
    if(response.statusText !== 'OK'){ // response state 가 404 인 경우
      throw new Error(response.data.message) // response.data.message : 'Product Not Found!' // 에러 발생시 catch 구문이 실행됨
    }
    return response.data
  }catch(err){
    console.log(err)
    return { error: err.response.data.message || err.message}
  }
}
export const register =  async ({name, email, password}) => {
  try{
    const response = await axios({
      url: `${apiUrl}/api/users/register`,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name,
        email,
        password
      }
    })
    if(response.statusText !== 'OK'){ // response state 가 404 인 경우
      throw new Error(response.data.message) // response.data.message : 'Product Not Found!' // 에러 발생시 catch 구문이 실행됨
    }
    return response.data
  }catch(err){
    console.log(err)
    return { error: err.response.data.message || err.message}
  }
}
export const update =  async ({name, email, password}) => {
  try{
    const {_id, token} = getUserInfo()
    const response = await axios({
      url: `${apiUrl}/api/users/${_id}`,
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // 사용자 정보 업데이트시 jwt 토큰을 Authorization 헤더에 실어서 전송함
      },
      data: {
        name,
        email,
        password
      }
    })
    if(response.statusText !== 'OK'){ // response state 가 404 인 경우
      throw new Error(response.data.message) // response.data.message : 'Product Not Found!' // 에러 발생시 catch 구문이 실행됨
    }
    return response.data
  }catch(err){
    console.log(err)
    return { error: err.response.data.message || err.message}
  }
}
export const createOrder = async (order) => {
  try{
    const {token} = getUserInfo()
    const response = await axios({
      url: `${apiUrl}/api/orders/`,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      data: order
    })
    if(response.statusText !== 'Created'){
      throw new Error(response.data.message)
    }
    return response.data
  }catch(err){
    return { error: err.response ? err.response.data.message : err.message }
  }
}
export const getOrder = async (id) => {
  try{
    const { token } = getUserInfo()
    const response = await axios({
      url: `${apiUrl}/api/orders/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    })
    if(response.statusText !== 'OK'){ // response state 가 404 인 경우
      throw new Error(response.data.message) // response.data.message : 'Product Not Found!' // 에러 발생시 catch 구문이 실행됨
    }
    return response.data
  }catch(err){
    return { error: err.message }
  }
}
export const getPaypalClientId = async () => {
  const response = await axios({
    url: `${apiUrl}/api/paypal/clientId`,
    headers: {
      "Content-Type": "application/json",
    },
  })
  if(response.statusText !== 'OK'){ // response state 가 404 인 경우
    throw new Error(response.data.message) // response.data.message : 'Product Not Found!' // 에러 발생시 catch 구문이 실행됨
  }
  return response.data.clientId
}
export const payOrder = async (orderId, paymentResult) => {
  try{
    const {token} = getUserInfo()
    const response = await axios({
      url: `${apiUrl}/api/orders/${orderId}/pay`,
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      data: paymentResult
    })
    if(response.statusText !== 'OK'){ // response state 가 404 인 경우
      throw new Error(response.data.message) // response.data.message : 'Product Not Found!' // 에러 발생시 catch 구문이 실행됨
    }
    return response.data
  }catch(err){
    return { error: err.response ? err.response.data.message : err.message }
  }
}
export const getMyOrders = async () => {
  try{
    const {token} = getUserInfo()
    const response = await axios({
      url: `${apiUrl}/api/orders/mine`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    })
    if(response.statusText !== 'OK'){ // response state 가 404 인 경우
      throw new Error(response.data.message) // response.data.message : 'Product Not Found!' // 에러 발생시 catch 구문이 실행됨
    }
    return response.data
  }catch(err){
    return { error: err.response ? err.response.data.message : err.message }
  }
}
export const getOrders = async () => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
};
export const getSummary = async () => {
  try {
    const { token } = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/summary`,
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    });
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    } else {
      return response.data;
    }
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
  }
};