import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderItems: [ // 주문한 상품목록
    {
      name: {type: String, required: true},
      image: {type: String, required: true},
      price: {type: Number, required: true},
      qty: {type: Number, required: true},
      product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true} // ref: Product 모델 정보 참조 (외래키)
    }
  ],
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  shipping: {
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  payment: {
    paymentMethod: String,
    paymentResult: {
      orderID: String,
      payerID: String,
      paymentID: String
    }
  },
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  isPaid: {type: Boolean, required: true, default: false}, // 입금여부
  paidAt: Date, // 언제 입금했는지
  isDelivered: {type: Boolean, required: true, default: false}, // 배송완료 여부
  deliveredAt: Date, // 언제 배송완료했는지 

}, {
  timestamps: true // 주문이 생성 및 업데이트되는 시간 기록
})

const Order = mongoose.model('Order', orderSchema)
export default Order