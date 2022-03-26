import {update} from '../api'
import CheckoutSteps from '../components/CheckoutSteps'
import {setUserInfo, getUserInfo, clearUser, setPayment} from '../localStorage'
import { hideLoading, showLoading, showMessage } from '../utils'

const PaymentScreen = {
  after_render: () => {
    document.getElementById('payment-form')
    .addEventListener("submit", async (e) => { // 결제 진행하기
      e.preventDefault() // 새로고침 방지
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value 
      setPayment({ paymentMethod })
      document.location.hash = '/placeorder'
    })
  },
  render: () => {
    const {name} = getUserInfo() // 로컬스토리지에서 사용자 정보 조회
    if(!name){
      document.location.hash = '/' // 사용자 정보가 없는 경우 결제 페이지는 보여주지 않고 홈으로 이동
    }
    return `
      ${CheckoutSteps.render({ step1: true, step2: true, step3: true })}
      <div class="form-container">
        <form id="payment-form">
          <ul class="form-items">
            <li>
              <h1>Payment</h1>
            </li>
            <li>
              <div>
                <input type="radio" name="payment-method" id="paypal" value="Paypal" checked/>
                <label for="paypal">PayPal</label>
              </div>
            </li>
            <li>
              <div>
                <input type="radio" name="payment-method" id="stripe" value="Stripe"/>
                <label for="stripe">Stripe</label>
              </div>
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
export default PaymentScreen