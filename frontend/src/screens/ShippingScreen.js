import {update} from '../api'
import CheckoutSteps from '../components/CheckoutSteps'
import {setUserInfo, getUserInfo, clearUser, getShipping, setShipping} from '../localStorage'
import { hideLoading, showLoading, showMessage } from '../utils'

const ShippingSceen = {
  after_render: () => {
    document.getElementById('shipping-form')
    .addEventListener("submit", async (e) => { // 결제 진행하기
      e.preventDefault() // 새로고침 방지
      setShipping({
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value,
        country: document.getElementById('country').value,
      })
      document.location.hash = '/payment'
    })
  },
  render: () => {
    const {name} = getUserInfo() // 로컬스토리지에서 사용자 정보 조회
    if(!name){
      document.location.hash = '/' // 사용자 정보가 없는 경우 결제 페이지는 보여주지 않고 홈으로 이동
    }
    const { address, city, postalCode, country } = getShipping()
    return `
      ${CheckoutSteps.render({ step1: true, step2: true })}
      <div class="form-container">
        <form id="shipping-form">
          <ul class="form-items">
            <li>
              <h1>Shpping</h1>
            </li>
            <li>
              <label for="address">Address</label>
              <input type="text" name="address" id="address" value="${address}"/>
            </li>
            <li>
              <label for="city">City</label>
              <input type="text" name="city" id="city" value="${city}"/>
            </li>
            <li>
              <label for="postalCode">Postal Code</label>
              <input type="text" name="postalCode" id="postalCode" value="${postalCode}"/>
            </li>
            <li>
              <label for="country">Country</label>
              <input type="text" name="country" id="country" value="${country}"/>
            </li>
            
            <li>
              <button type="submit" class="primary">Continue</button>
            </li>
          </ul>
        </form>
      </div>
    `
  }
}
export default ShippingSceen