import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import CheckoutSteps from '../components/CheckoutSteps'

export default function ReservationScreen() {
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    userInfo,
    cart: { reservation },
  } = state
  const [date, setDate] = useState(reservation.date || '')
  const [fullName, setFullName] = useState(reservation.fullName || '')
  const [company, setCompany] = useState(reservation.company || '')
  const [address, setAddress] = useState(reservation.address || '')
  const [city, setCity] = useState(reservation.city || '')
  const [postalCode, setPostalCode] = useState(reservation.postalCode || '')
  const [comments, setComments] = useState(reservation.comments || '')
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/reservation')
    }
  }, [userInfo, navigate])
  const submitHandler = (e) => {
    e.preventDefault()
    ctxDispatch({
      type: 'SAVE_RESERVATION',
      payload: {
        date,
        fullName,
        company,
        address,
        city,
        postalCode,
        comments,
      },
    })
    localStorage.setItem(
      'reservation',
      JSON.stringify({
        date,
        fullName,
        company,
        address,
        city,
        postalCode,
        comments,
      })
    )
    navigate('/payment')
  }
  return (
    <div>
      <Helmet>
        <title>Reservatie</title>
      </Helmet>

      <CheckoutSteps
        step1
        step2
        step3></CheckoutSteps>
      <div className='container small-container'>
        <h1 className='my-3'>Reservatie</h1>
        <Form onSubmit={submitHandler}>
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
            controlId='company'>
            <Form.Label>Bedrijf</Form.Label>
            <Form.Control
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </Form.Group>
          <Form.Group
            className='mb-3'
            controlId='address'>
            <Form.Label>Adres</Form.Label>
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
            <Form.Label>Bijkomende opmerkingen</Form.Label>
            <Form.Control
              value={comments}
              onChange={(e) => setComments(e.target.value)}
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
