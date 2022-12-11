import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import MessageBox from '../components/MessageBox'

const CartScreen = () => {
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state

  //update cart
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`)
    if (data.countInStock < quantity) {
      window.alert('Sorry, u heeft het maximum aantal van dit gerecht bereikt.')
      return
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
  }

  // remove item
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  // doorgaan naar bestellen
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Your Shopping Cart is empty.{' '}
              <Link
                to='/products'
                className='bg-light p-2 rounded text-bold'>
                Add dishes
              </Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className='align-items-center'>
                    <Col md={4}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className='img-fluid rounded img-thumbnail'></img>{' '}
                      <Link to={`/products/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      <span>{item.quantity}</span>{' '}
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant='light'>
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant='flush'>
                {/* SUBTOTAL */}
                <ListGroup.Item>
                  <h3>
                    Subtotal (
                    {cartItems.reduce(
                      (accumulator, current) => accumulator + current.quantity,
                      0
                    )}{' '}
                    items) : $
                    {cartItems.reduce(
                      (a, c) =>
                        a + parseFloat((c.price * c.quantity).toFixed(2)),
                      0
                    )}
                  </h3>
                </ListGroup.Item>
                {/* PROCEED TO CHECKOUT */}
                <ListGroup.Item>
                  <div className='d-grid'>
                    <Button
                      type='button'
                      variant='primary'
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}>
                      Continue to order
                    </Button>
                    {/* 
                    {' '}
                      <Button
                        variant='light'
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }>
                        <i className='fas fa-plus-circle'></i>
                      </Button> 
                      */}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CartScreen
