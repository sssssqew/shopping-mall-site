import {register} from '../api'
import {setUserInfo, getUserInfo} from '../localStorage'
import { hideLoading, showLoading, showMessage, redirectUser } from '../utils'

const RegisterScreen = {
  after_render: () => {
    document.getElementById('register-form')
    .addEventListener("submit", async (e) => { // 로그인 과정
      e.preventDefault() // 새로고침 방지
      showLoading()
      const data = await register({
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
      hideLoading()
      if(data.error){
        showMessage(data.error)
      }else{
        setUserInfo(data) // 사용자 정보 로컬스토리지에 저장해두기
        redirectUser()
      }
    })
  },
  render: () => {
    // 사용자 정보가 존재하면 더이상 회원가입 페이지는 보여주지 않아도 됨
    if(getUserInfo().name){
      redirectUser()
    }
    return `
      <div class="form-container">
        <form id="register-form">
          <ul class="form-items">
            <li>
              <h1>Create account</h1>
            </li>
            <li>
              <label for="name">Name</label>
              <input type="name" name="name" id="name"/>
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
              <label for="repassword">Re-Enter Password</label>
              <input type="password" name="repassword" id="repassword"/>
            </li>
            <li>
              <button type="submit" class="primary">Register</button>
            </li>
            <li>
              <div>
                Already have an account ? <a href="/#/signin">Sign-In</a>
              </div>
            </li>
          </ul>
        </form>
      </div>
    `
  }
}
export default RegisterScreen