import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function CheckoutSteps(props) {
  return (
    <Row className='checkout-steps'>
      <Col className={props.step1 ? 'active' : ''}>Inloggen</Col>
      <Col className={props.step2 ? 'active' : ''}>Factuuradres</Col>
      <Col className={props.step3 ? 'active' : ''}>Reservatie</Col>
      <Col className={props.step4 ? 'active' : ''}>Betaling</Col>
      <Col className={props.step5 ? 'active' : ''}>Bestelling plaatsen</Col>
    </Row>
  )
}
