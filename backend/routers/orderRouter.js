import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Order from '../models/orderModel'
import User from '../models/userModel';
import { isAuth, isAdmin } from '../utils'

const orderRouter = express.Router()

orderRouter.get('/mine', isAuth, expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }) // req.user 는 isAuth 에서 전달된 값 (현재 사용자에 대한 주문정보만 필터링)
  res.send(orders)
}))
orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if(order){
    res.send(order)
  }else{
    res.status(404).send({message: 'Order Not Found' })
  }
}))

orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
  const order = new Order({
    orderItems: req.body.orderItems,
    user: req.user._id, // 사용자 id
    shipping: req.body.shipping,
    payment: req.body.payment,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice
  })
  const createdOrder = await order.save()
  res.status(201).send({message: 'New Order Created', order: createdOrder})
}))

orderRouter.put("/:id/pay", isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if(order){
    order.isPaid = true 
    order.paidAt = Date.now()
    order.payment.paymentResult = {
      payerID: req.body.payerID,
      paymentID: req.body.paymentID,
      orderID: req.body.orderID
    }
    const updatedOrder = await order.save()
    res.send({message: 'Order Paid', order: updatedOrder})
  }else{
    res.status(404).send({ message: 'Order Not Found' })
  }
}))
orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user');
    res.send(orders);
  })
);

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({
      users,
      orders: orders.length === 0 ? [{ numOrders: 0, totalSales: 0 }] : orders,
      dailyOrders,
      productCategories,
    });
  })
);

export default orderRouter