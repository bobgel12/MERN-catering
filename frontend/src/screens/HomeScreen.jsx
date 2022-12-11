import React from 'react'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const HomeScreen = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Helmet>
        <title>Golden Chopstick Catering</title>
      </Helmet>

      <section className='home'>
        <h1>Golden Chopstick Catering</h1>
        <h3 className='home__text'>Coming soon!</h3>

        <Button
          type='button'
          variant='light'
          className='home__button home__text'
          onClick={() => {
            navigate(`/search`)
          }}>
          Checkout our foods
        </Button>
      </section>
    </div>
  )
}

export default HomeScreen
