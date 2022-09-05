import axios from 'axios'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { getError } from '../utils'
import { Store } from '../Store'
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const ProductScreen = (props) => {
  const navigate = useNavigate()
  const params = useParams()
  const { slug } = params

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const result = await axios.get(`/api/products/slug/${slug}`)
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) })
      }
    }
    fetchData()
  }, [slug])

  // form input qty (aantal porties toevoegen aan winkelwagen)
  const [qty, setQty] = useState('')
  const updateQty = (event) => {
    setQty(event.target.value)
  }
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart } = state
  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + Number(qty) : Number(qty)
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
    navigate('/cart')
  }
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className='img-large'
            src={product.imageUrl}
            alt={product.name}
          />
        </Col>
        <Col md={6}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>

            <ListGroup.Item>{product.description}</ListGroup.Item>
          </ListGroup>
          <Card className='mt-3'>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Prijs:</Col>
                    <Col>€{product.price} per portie</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroupItem>
                  {/* INPUT AANTAL */}

                  <Form>
                    <Form.Group
                      className='mb-3'
                      controlId='formInputQty'>
                      <Form.Label>Aantal porties</Form.Label>
                      <Form.Control
                        type='number'
                        placeholder='Aantal personen'
                        value={qty}
                        onChange={(event) => updateQty(event)}
                        required
                        min={10}
                        max={400}
                      />
                    </Form.Group>
                    <Button
                      onClick={addToCartHandler}
                      variant='primary'
                      type='submit'>
                      Toevoegen aan winkelwagen
                    </Button>
                  </Form>

                  {/* END INPUT AANTAL */}
                </ListGroupItem>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ProductScreen
