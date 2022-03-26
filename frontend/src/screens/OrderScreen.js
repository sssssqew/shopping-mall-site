import { hideLoading, parseRequestUrl, rerender, showLoading, showMessage } from "../utils"
import { getOrder, getPaypalClientId, payOrder } from '../api'

// 페이팔 결제로직 => 해킹 위험 때문에 페이팔에 가입하지 않아서 동작하지 않음 (clientId 가 없음)
const handlePayment = (clientId, totalPrice) => {
  window.paypal.Button.render({
    env: 'sandbox',
    client: {
      sandbox: clientId,
      production: '',
    },
    locale: 'en_US',
    style: {
      size: 'responsive',
      color: 'gold',
      shape: 'pill'
    },
    commit: true,
    payment(data, actions){
      return actions.payment.create({
        transactions: [
          {
            amount: {
              total: totalPrice,
              currency: 'USD'
            }
          }
        ]
      })
    },
    onAuthorize(data, actions){
      return actions.payment.execute().then(async () => {
        showLoading()
        await payOrder(parseRequestUrl().id, { // 페이먼트 정보 업데이트
          orderID:  data.orderID,
          payerID: data.payerID,
          paymentID: data.paymentID
        })
        hideLoading()
        showMessage('Payment was successful.', () => {
          rerender(OrderScreen) // 업데이트된 페이먼트 정보로 화면 업데이트
        })
      })
    }
  }, '#paypal-button').then(() => {
    hideLoading()
  })
}
const addPaypalSdk = async (totalPrice) => {
  const clientId = await getPaypalClientId()
  showLoading()
  if(!window.paypal){
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://www.paypalobjects.com/api/checkout.js'
    script.async = true 
    script.onload = () => handlePayment(clientId, totalPrice)
    document.body.appendChild(script)
  }else{
    handlePayment(clientId, totalPrice)
  }
}
const OrderScreen = {
  render: async () => {
    const request = parseRequestUrl()
    const {
      _id,
      orderItems,
      shipping,
      payment,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isDelivered,
      deliveredAt,
      isPaid,
      paidAt
    } = await getOrder(request.id)

    // if(!isPaid){
    //   addPaypalSdk(totalPrice)
    // }
    return `
      <div>
        <h1>Order ${_id}</h1>
        <div class="order">
          <div class="order-info">
            <div>
              <h2>Shipping</h2>
              <div>
                ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, ${shipping.country}
              </div>
              ${isDelivered ? `<div class="success">Delivered at ${deliveredAt}</div>` : 
                `<div class="error">Not Delivered</div>`}
            </div>
            <div>
              <h2>Payment</h2>
              <div>
                Payment Method: ${payment.paymentMethod}
              </div>
              ${isPaid ? `<div class="success">Paid at ${paidAt}</div>` : 
                `<div class="error">Not Paid</div>`}
            </div>
            <div>
              <ul class="cart-list-container">
                <li>
                  <h2>Shopping cart</h2>
                  <div>Price</div>
                </li>
                
                ${orderItems.map(item => `
                  <li>
                    <div class="cart-image">
                      <img src="${item.image}" alt="${item.name}"/>
                    </div>
                    <div class="cart-name">
                      <div>
                        <a href="/#/product/${item.product}">${item.name}</a>
                      </div>
                      <div>Qty: ${item.qty}</div>
                    </div>
                    <div class="cart-price">$${item.price}</div>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
          <div class="order-action">
            <ul>
              <li>
                <h2>Order Summury</h2>
              </li>
              <li>
                <div>Items</div><div>$${itemsPrice}</div>
              </li>
              <li>
                <div>Shipping</div><div>$${shippingPrice}</div>
              </li>
              <li>
                <div>Tax</div><div>$${taxPrice}</div>
              </li>
              <li class="total">
                <div>Order Total</div><div>$${totalPrice}</div>
              </li>
              <li><div class="fw" id="paypal-button"></div></li>
            </ul>
          </div>
        </div>
      </div>
    `
  }
}
export default OrderScreen