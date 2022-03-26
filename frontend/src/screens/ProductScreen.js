import { hideLoading, parseRequestUrl, showLoading } from "../utils"
import { getProduct } from '../api'
import Rating from '../components/Rating'

const ProductScreen = {
  after_render(){
    const request = parseRequestUrl()
    document.getElementById("add-button").addEventListener('click', () => {
      if(this.isAvailable){ // 상품 재고가 있는 경우에만 쇼핑카트에 추가하기
        document.location.hash = `/cart/${request.id}`
      }else{
        alert('This product is out of stock !')
      }
    })
  },
  async render(){
    const request = parseRequestUrl()
    showLoading()
    const product = await getProduct(request.id)
    if(product.error){
      return `<div>${product.error}</div>`
    }
    // console.log(this.isAvailable)
    if(product.countInStock === 0){ // 상품재고 검사
      this.isAvailable = false
    }else{
      this.isAvailable = true
    }
    hideLoading()
    return `
      <div class="content">
        <div class="back-to-result">
          <a href="/#/">Back to result</a>
        </div>
        <div class="details">
          <div class="details-image">
            <img src="${product.image}" alt="${product.name}"/>
          </div>
          <div class="details-info">
            <ul>
              <li>
                <h1>${product.name}</h1>
              </li>
              <li>
                ${Rating.render({value: product.rating, text: `${product.numReviews} reviews`})}
              </li>
              <li>
                Price: <strong>$${product.price}</strong>
              </li>
              <li>
                Description: 
                <div>
                  ${product.description}
                </div>
              </li>
            </ul>
          </div>
          <div class="details-action">
            <ul>
              <li>
                Price: $${product.price}
              </li>
              <li>
                Status: ${product.countInStock > 0 ? `<span class="success">In Stock</span>` 
                  : `<span class="error">Unavailable</span>`}
              </li>
              <li>
                <button id="add-button" class="fw primary">Add to Cart</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `
  }
}
export default ProductScreen