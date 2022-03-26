import { getUserInfo } from "../localStorage"

const Header = {
  render: () => {
    const {name, isAdmin} = getUserInfo()
    return `
      <div class="brand">
        <a href="/#/">amazon</a>
      </div>
      <div>
        ${name 
        ? `<a href="/#/profile">${name}</a>` 
          : `<a href="/#/signin">Sign-In</a>`}
        <a href="/#/cart">Cart</a>
        ${isAdmin ? `<a href="/#/dashboard">Dashboard</a>` : ''}
      </div>
    `
  }
}
export default Header