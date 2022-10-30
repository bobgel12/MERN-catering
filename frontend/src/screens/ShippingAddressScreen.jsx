import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import CheckoutSteps from '../components/CheckoutSteps'

export default function ShippingAddressScreen() {
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    userInfo,
    cart: { shippingAddress },
  } = state
  const [fullName, setFullName] = useState(shippingAddress.fullName || '')
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping')
    }
  }, [userInfo, navigate])
  const [country, setCountry] = useState(shippingAddress.country || '')
  const [date, setDate] = useState(shippingAddress.date || '')
  const submitHandler = (e) => {
    e.preventDefault()
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
        date,
      },
    })
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        date,
      })
    )
    navigate('/payment')
  }
  return (
    <div>
      <Helmet>
        <title>Bezorging</title>
      </Helmet>

      <CheckoutSteps
        step1
        step2></CheckoutSteps>
      <div className='container small-container'>
        <h1 className='my-3'>Bezorging</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group
            className='mb-3'
            controlId='fullName'>
            <Form.Label>Naam + voornaam</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group
            className='mb-3'
            controlId='address'>
            <Form.Label>Bezorgadres</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group
            className='mb-3'
            controlId='city'>
            <Form.Label>Gemeente</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group
            className='mb-3'
            controlId='postalCode'>
            <Form.Label>Postcode</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group
            className='mb-3'
            controlId='country'>
            <Form.Label>Land</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group
            className='mb-3'
            controlId='date'>
            <Form.Label>Datum en tijd</Form.Label>
            <Form.Control
              type='datetime-local'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>
          <div className='mb-3'>
            <Button
              variant='primary'
              type='submit'>
              Ga verder
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
