import {signin} from '../api'
import {setUserInfo, getUserInfo} from '../localStorage'
import { hideLoading, showLoading, showMessage, redirectUser } from '../utils'

const SigninScreen = {
  after_render: () => {
    document.getElementById('signin-form')
    .addEventListener("submit", async (e) => { // 로그인 과정
      e.preventDefault() // 새로고침 방지
      showLoading()
      const data = await signin({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
      hideLoading()
      if(data.error){
        showMessage(data.error)
      }else{
        setUserInfo(data) // 사용자 정보 로컬스토리지에 저장해두기
        redirectUser() // 로그인할때 쇼핑카트에 담겨진 상품이 있으면 proceed to checkout 버튼을 클릭해서 로그인 페이지로 온 것이므로 shipping 페이지로 감
        // 쇼핑카트가 비어있으면 홈으로 이동함
      }
    })
  },
  render: () => {
    // 사용자 정보가 존재하면 더이상 로그인 페이지는 보여주지 않아도 됨
    if(getUserInfo().name){
      redirectUser()
    }
    return `
      <div class="form-container">
        <form id="signin-form">
          <ul class="form-items">
            <li>
              <h1>Sign-In</h1>
            </li>
            <li>
              <label for="email">Email</label>
              <input type="email" name="email" id="email"/>
            </li>
            <li>
              <label for="password">Password</label>
              <input type="password" name="password" id="password"/>
            </li>
            <li>
              <button type="submit" class="primary">Signin</button>
            </li>
            <li>
              <div>
                New User ? <a href="/#/register">Create your account</a>
              </div>
            </li>
          </ul>
        </form>
      </div>
    `
  }
}
export default SigninScreen