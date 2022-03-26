import {getCartItems} from './localStorage'

export const parseRequestUrl = () => {
  const url = document.location.hash.toLowerCase()
  const request = url.split('/')
  return {
    resource: request[1],
    id: request[2],
    action: request[3]
  }
}
export const rerender = async (component) => {
  document.getElementById('main-container').innerHTML = await component.render() // 화면 업데이트
  if(component.after_render) component.after_render() // 이벤트핸들러 연결
}
export const showLoading = () => {
  document.getElementById('loading-overlay').classList.add('active')
}
export const hideLoading = () => {
  document.getElementById('loading-overlay').classList.remove('active')
}
export const showMessage = (message, callback) => {
  document.getElementById('message-overlay').innerHTML = `
    <div>
      <div id="message-overlay-content">${message}</div>
      <button id="message-overlay-close-button">OK</button>
    </div>
  `
  document.getElementById('message-overlay').classList.add('active') // 메세지창 보이기
  document.getElementById('message-overlay-close-button')
  .addEventListener('click', (e) => {
    document.getElementById('message-overlay').classList.remove('active') // 메세지창 닫기
    if(callback) {
      callback()
    }
  })
}
export const redirectUser = () => {
  if(getCartItems().length !== 0){
    document.location.hash = '/shipping'
  }else{
    document.location.hash = '/'
  }
}
const addZero = (num) => {
  return num < 10 ? `0${num}` : num 
}
export const changeDateFormat = (date) => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return `${year}년 ${addZero(month)}월 ${addZero(day)}일 ${addZero(hours)}시 ${addZero(minutes)}분 ${addZero(seconds)}초`
} 