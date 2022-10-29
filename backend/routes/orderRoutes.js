import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import { isAuth, isAdmin } from '../utils.js'
import nodemailer from 'nodemailer'

const orderRouter = express.Router()

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name')
    res.send(orders)
  })
)

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    })

    const orderItems = JSON.stringify(
      req.body.orderItems.map((orderItem) => {
        return {
          name: orderItem.name,
          quantity: orderItem.quantity,
        }
      }),
      null,
      4
    )

    const output = `
    <h1>U heeft een nieuwe bestelling!</h1>
    <h3>Overzicht bestelling</h3>
    <p>
    Bestelde gerechten: <br />
    ${orderItems})
    <br />
    <br />
    Bezorgadres: <br /> 
    ${req.body.shippingAddress.fullName}<br /> 
    ${req.body.shippingAddress.address}<br /> 
    ${req.body.shippingAddress.postalCode} ${req.body.shippingAddress.city} <br /> 
    ${req.body.shippingAddress.country}<br />
    <br /> 
    Bezorgdatum: ${req.body.shippingAddress.date}
    </p>

    <h4>Betalingsoverzicht</h4>
    <ul>
      <li>Betaalwijze: ${req.body.paymentMethod}</li>
      <li>Prijs gerechten: €${req.body.itemsPrice}</li>
      <li><strong>Totaalprijs: €${req.body.totalPrice}</strong></li>
    </ul>
    <h4>Gebruiker</h4>
    <ul>
      <li>Gebruiker id: ${req.user._id}</li>
      <li>Gebruikersnaam: ${req.user.name}</li>
      <li>Gebruiker email: ${req.user.email}</li>
    </ul>
    `
    console.log(output)

    // create reusable transporter object
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.NODEMAILER_EMAIL, // generated ethereal user
        pass: process.env.NODEMAILER_EMAIL_PASS, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Kevins Catering Webshop" <de.laet.luna@gmail.com>', // sender address
      to: 'luna.dl@hotmail.com', // list of receivers
      subject: 'Nieuwe bestelling!', // Subject line
      html: output, // html body
    })

    console.log('Message sent: %s', info.messageId)

    const order = await newOrder.save()
    res.status(201).send({ message: 'New Order Created', order })

    main().catch(console.error)
  })
)

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
    ])
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ])
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ])
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ])
    res.send({ users, orders, dailyOrders, productCategories })
  })
)

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.send(orders)
  })
)

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      res.send(order)
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()
      await order.save()
      res.send({ message: 'Order Delivered' })
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }

      const updatedOrder = await order.save()
      res.send({ message: 'Order Paid', order: updatedOrder })
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      await order.remove()
      res.send({ message: 'Order Deleted' })
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

export default orderRouter
