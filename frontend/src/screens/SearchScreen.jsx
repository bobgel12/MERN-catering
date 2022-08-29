import React, { useEffect, useReducer, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { Helmet } from 'react-helmet-async'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Button from 'react-bootstrap/Button'
import Product from '../components/Product'
import LinkContainer from 'react-router-bootstrap/LinkContainer'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

export default function SearchScreen() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const sp = new URLSearchParams(search) // /search?category=Shirts
  const category = sp.get('category') || 'all'
  const query = sp.get('query') || 'all'
  const order = sp.get('order') || 'newest'
  const page = sp.get('page') || 1

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&order=${order}`
        )
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        })
      }
    }
    fetchData()
  }, [category, error, order, page, query])

  const [categories, setCategories] = useState([])
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`)
        setCategories(data)
      } catch (err) {
        toast.error(getError(err))
      }
    }
    fetchCategories()
  }, [dispatch])

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page
    const filterCategory = filter.category || category
    const filterQuery = filter.query || query
    const sortOrder = filter.order || order
    return `/search?category=${filterCategory}&query=${filterQuery}&order=${sortOrder}&page=${filterPage}`
  }
  return (
    <div>
      <Helmet>
        <title>Zoek gerechten</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3 className='left'>Categoriën</h3>
          <br />
          <div>
            <ul>
              <li>
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}>
                  Alle gerechten
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c })}>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <br />
          <br />
        </Col>

        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
          ) : (
            <>
              <Row className='justify-content-between mb-3'>
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? 'Geen' : countProducts} resultaten
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {query !== 'all' || category !== 'all' ? (
                      <Button
                        variant='light'
                        onClick={() => navigate('/search')}>
                        <i className='fas fa-times-circle'></i>
                      </Button>
                    ) : null}
                  </div>
                  <br />
                  <br />
                </Col>
                <Col className='text-end'>
                  Sorteren op{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }))
                    }}>
                    <option value='newest'>Nieuwste gerechten</option>
                    <option value='lowest'>Prijs: laag naar hoog</option>
                    <option value='highest'>Prijs: hoog naar laag</option>
                  </select>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>Geen gerechten gevonden</MessageBox>
              )}

              <Row>
                {products.map((product) => (
                  <Col
                    sm={6}
                    lg={4}
                    className='mb-3'
                    key={product._id}>
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>

              <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className='mx-1'
                    to={getFilterUrl({ page: x + 1 })}>
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant='light'>
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  )
}
