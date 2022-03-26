import { parseRequestUrl, rerender } from "../utils"
import { getProduct } from "../api"
import { getCartItems, setCartItems } from "../localStorage"

// 사용자가 상품을 카트에 담을때마다 선택한 상품정보를 서버에서 읽어와서 로컬스토리지에 추가하기
const addToCart = (item, forceUpdate = false) => {
  let cartItems = getCartItems()
  const existItem = cartItems.find(x => x.product === item.product) // 카트에 사용자가 선택한 상품이 존재하는지 검사
  if(existItem){
    if(forceUpdate){
      cartItems = cartItems.map( x => x.product === existItem.product ? item : x ) // 카트에 같은 id 의 상품이 이미 존재하면 입력으로 들어온 새 상품정보로 교체함 (qty 값을 업데이트하기 위함)
    }
  }else{
    cartItems = [...cartItems, item] // 카트에 상품 추가
  }
  setCartItems(cartItems) // 로컬 스토리지 업데이트

  if(forceUpdate){
    rerender(CartScreen) // 화면 업데이트
  }
}
const removeFromCart = (id) => {
  setCartItems(getCartItems().filter(x => x.product !== id)) // 로컬스토리지에서 상품 삭제
  if(id === parseRequestUrl().id){ // 삭제하려는 상품의 id 값이 현재 url 에 포함되어 있는 경우 해당 id 값은 더이상 url 에 포함되면 안됨
    document.location.hash = '/cart'
  }else{
    rerender(CartScreen) // 화면 업데이트
  }
}

const CartScreen = {
  after_render: () => {
    const qtySelects = document.getElementsByClassName('qty-select')
    Array.from(qtySelects).forEach(qtySelect => {
      qtySelect.addEventListener('change', (e) => { // 사용자가 qty 숫자중 어느 하나를 선택한 경우
        const item = getCartItems().find(x => x.product === qtySelect.id) // 사용자가 qty 를 변경하려는 상품을 로컬스토리지에서 검색
        addToCart({...item, qty: Number(e.target.value)}, true) // 사용자가 선택한 상품의 qty 수량으로 로컬스토리지 업데이트 및 화면 업데이트
      })
    })
    const deleteButtons = document.getElementsByClassName('delete-button')
    Array.from(deleteButtons).forEach(deleteButton => {
      deleteButton.addEventListener('click', () => {
        removeFromCart(deleteButton.id)
      })
    })
    document.getElementById('checkout-button').addEventListener('click', () => {
      document.location.hash = '/signin'
    })
  },
  render: async () => {
    const request = parseRequestUrl()
    if(request.id){
      const product = await getProduct(request.id) // 서버에서 해당 상품정보 읽어오기
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1
      })
    }
    const cartItems = getCartItems()
    return `
      <div class="content cart">
        <div class="cart-list">
          <ul class="cart-list-container">
            <li>
              <h3>Shopping Cart</h3>
              <div>Price</div>
            </li>
            ${cartItems.length === 0 ? 
            `<div>Cart is empty <a href="/#/">Go Shopping</a></div>` : 
              cartItems.map(item => `
                <li>
                  <div class="cart-image">
                    <img src="${item.image}" alt="${item.name}"/>
                  </div>
                  <div class="cart-name">
                    <div>
                      <a href="/#/product/${item.product}">${item.name}</a>
                    </div>
                    <div>
                      Qty: <select class="qty-select" id="${item.product}">
                        ${[...Array(item.countInStock).keys()].map(x => item.qty === x+1 ? // 재고수량만큼 옵션을 생성함
                          `<option selected value="${x+1}">${x+1}</option>` :
                          `<option value="${x+1}">${x+1}</option>`)}
                      </select>
                      <button type="button" class="delete-button" id="${item.product}">
                        Delete
                      </button>
                    </div>
                  </div>
                  <div class="cart-price">
                    $${item.price}
                  </div>
                </li>
              `).join('')}
          </ul>
        </div>
        <div class="cart-action">
          <h3>
              Subtotal (${cartItems.reduce((a, c) => a + c.qty, 0)} items) 
              :
              $${cartItems.reduce((a, c) => a + c.price*c.qty, 0)}
          </h3>
          <button id="checkout-button" class="primary fw">
              Proceed to Checkout
          </button>
        </div>
      </div>`
  }
}
export default CartScreen