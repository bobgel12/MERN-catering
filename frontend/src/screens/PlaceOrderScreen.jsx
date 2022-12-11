import Axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { Store } from '../Store'
import CheckoutSteps from '../components/CheckoutSteps'
import LoadingBox from '../components/LoadingBox'

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true }
    case 'CREATE_SUCCESS':
      return { ...state, loading: false }
    case 'CREATE_FAIL':
      return { ...state, loading: false }
    default:
      return state
  }
}

export default function PlaceOrderScreen() {
  const navigate = useNavigate()

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  })

  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart, userInfo } = state

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100 // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  )
  cart.totalPrice = cart.itemsPrice

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' })

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          reservation: cart.reservation,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      )
      ctxDispatch({ type: 'CART_CLEAR' })
      dispatch({ type: 'CREATE_SUCCESS' })
      localStorage.removeItem('cartItems')
      navigate(`/order/${data.order._id}`)
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' })
      toast.error(getError(err))
    }
  }
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment')
    }
  }, [cart, navigate])

  return (
    <div>
      <CheckoutSteps
        step1
        step2
        step3
        step4
        step5></CheckoutSteps>
      <Helmet>
        <title>Overzicht bestelling</title>
      </Helmet>
      <h1 className='my-3'>Overzicht bestelling</h1>
      <Row>
        <Col md={8}>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Factuuradres</Card.Title>
              <Card.Text>
                <strong>Naam: </strong> {cart.shippingAddress.fullName} <br />
                <br />
                <strong>Adres: </strong>
                <br />
                {cart.shippingAddress.address}
                <br />
                {cart.shippingAddress.postalCode} {cart.shippingAddress.city}
                <br />
                {cart.shippingAddress.country}
                <br />
              </Card.Text>
              <Link
                to='/shipping'
                className='btn'>
                Bewerken
              </Link>
            </Card.Body>
          </Card>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Reservatie</Card.Title>
              <Card.Text>
                <strong>Date: </strong> {cart.reservation.date} <br />
                <br />
                <strong>Naam: </strong> {cart.reservation.fullName} <br />
                <br />
                <strong>Bedrijf: </strong> {cart.reservation.company} <br />
                <br />
                <strong>Adres: </strong>
                <br />
                {cart.reservation.address}
                <br />
                {cart.reservation.postalCode} {cart.reservation.city}
                <br />
                <br />
                <strong>Opmerkingen:</strong> {cart.reservation.comments}
                <br />
              </Card.Text>
              <Link
                to='/reservation'
                className='btn'>
                Bewerken
              </Link>
            </Card.Body>
          </Card>

          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Betaling</Card.Title>
              <Card.Text>
                <strong>Betaalwijze:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link
                to='/payment'
                className='btn'>
                Bewerken
              </Link>
            </Card.Body>
          </Card>

          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Dishes</Card.Title>
              <ListGroup variant='flush'>
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className='align-items-center'>
                      <Col md={6}>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className='img-fluid rounded img-thumbnail'></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link
                to='/cart'
                className='btn'>
                Bewerken
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Overzicht</Card.Title>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Totaalprijs</strong>
                    </Col>
                    <Col>
                      <strong>${cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className='d-grid'>
                    <Button
                      type='button'
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}>
                      Bestelling plaatsen
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
