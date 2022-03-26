import {update, getMyOrders} from '../api'
import {setUserInfo, getUserInfo, clearUser} from '../localStorage'
import { hideLoading, showLoading, showMessage, changeDateFormat } from '../utils'

const ProfileScreen = {
  after_render: () => {
    document.getElementById('signout-button') // 로그아웃
    .addEventListener('click', (e) => {
      clearUser() // 로컬스토리지에 있는 사용자 정보 삭제
      document.location.hash = '/'
    })
    document.getElementById('profile-form')
    .addEventListener("submit", async (e) => { // 사용자 정보 업데이트
      e.preventDefault() // 새로고침 방지
      showLoading()
      const data = await update({
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
      hideLoading()
      if(data.error){
        showMessage(data.error)
      }else{
        setUserInfo(data) // 업데이트된 사용자 정보를 로컬스토리지에 저장해두기
        document.location.hash = '/'
      }
    })
  },
  render: async () => {
    const {name, email} = getUserInfo() // 로컬스토리지에서 사용자 정보 조회
    if(!name){
      document.location.hash = '/' // 사용자 정보가 없는 경우 프로필 페이지는 보여주지 않고 홈으로 이동
    }
    const orders = await getMyOrders() // 나의 주문목록 가져오기

    return `
      <div class="content profile">
        <div class="profile-info">
        <div class="form-container">
        <form id="profile-form">
          <ul class="form-items">
            <li>
              <h1>User Profile</h1>
            </li>
            <li>
              <label for="name">Name</label>
              <input type="name" name="name" id="name" value="${name}"/>
            </li>
            <li>
              <label for="email">Email</label>
              <input type="email" name="email" id="email" value="${email}"/>
            </li>
            <li>
              <label for="password">Password</label>
              <input type="password" name="password" id="password"/>
            </li>
            <li>
              <button type="submit" class="primary">Update</button>
            </li>
            <li>
              <button type="button" id="signout-button">Sign Out</button>
            </li>
          </ul>
        </form>
      </div>
        </div>
        <div class="profile-orders">
          <h2>Order History</h2>
          <table>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELEVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              ${orders.length === 0 ? `<tr><td colspan="6">No Order Found.</td></tr>` : 
              orders.map(order => `
                <tr>
                  <td>${order._id}</td>
                  <td>${changeDateFormat(order.createdAt)}</td>
                  <td>${order.totalPrice}</td>
                  <td>${order.paidAt || 'No' }</td>
                  <td>${order.deliveredAt || 'No'}</td>
                  <td><a href="/#/order/${order._id}">DETAILS</a></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
  }
}
export default ProfileScreen