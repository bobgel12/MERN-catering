import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import { isAuth, isAdmin } from '../utils.js'

const productRouter = express.Router()

// GET ALL
productRouter.get('/', async (req, res) => {
  const products = await Product.find()
  res.send(products)
})

// CREATE
productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      imageUrl: 'vul hier een url in of upload een image hieronder',
      price: 0,
      category: 'sample category',
      countInStock: 0,
      description: 'sample description',
    })
    const product = await newProduct.save()
    res.send({ message: 'Product Created', product })
  })
)

// UPDATE
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id
    const product = await Product.findById(productId)
    if (product) {
      product.name = req.body.name
      product.slug = req.body.slug
      product.price = req.body.price
      product.imageUrl = req.body.imageUrl
      product.images = req.body.images
      product.category = req.body.category
      product.countInStock = req.body.countInStock
      product.description = req.body.description
      await product.save()
      res.send({ message: 'Product Updated' })
    } else {
      res.status(404).send({ message: 'Product Not Found' })
    }
  })
)

// DELETE
productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
      await product.remove()
      res.send({ message: 'Product Deleted' })
    } else {
      res.status(404).send({ message: 'Product Not Found' })
    }
  })
)

// PAGE SIZE
const PAGE_SIZE = 20

// GET ADMIN PRODUCTS
productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req
    const page = query.page || 1
    const pageSize = query.pageSize || PAGE_SIZE

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize)
    const countProducts = await Product.countDocuments()
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    })
  })
)

// GET SEARCH PAGE

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req
    const pageSize = query.pageSize || PAGE_SIZE
    const page = query.page || 1
    const category = query.category || ''
    const price = query.price || ''
    const order = query.order || ''
    const searchQuery = query.query || ''

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {}
    const categoryFilter = category && category !== 'all' ? { category } : {}

    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {}
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 }

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize)

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
    })
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    })
  })
)

// GET CATEGORIES
productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category')
    res.send(categories)
  })
)

// GET PRODUCT 
productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
  if (product) {
    res.send(product)
  } else {
    res.status(404).send({ message: 'Product Not Found' })
  }
})
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.send(product)
  } else {
    res.status(404).send({ message: 'Product Not Found' })
  }
})

export default productRouter
