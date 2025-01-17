import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function CheckoutSteps(props) {
  return (
    <Row className='checkout-steps'>
      <Col className={props.step1 ? 'active' : ''}>Login</Col>
      <Col className={props.step2 ? 'active' : ''}>Billing address</Col>
      <Col className={props.step3 ? 'active' : ''}>Reservation</Col>
      <Col className={props.step4 ? 'active' : ''}>Payment</Col>
      <Col className={props.step5 ? 'active' : ''}>Place an order</Col>
    </Row>
  )
}
