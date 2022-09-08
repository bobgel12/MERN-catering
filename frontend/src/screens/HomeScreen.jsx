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
        <title>Kevins catering</title>
      </Helmet>

      <section className='home'>
        <h1>KEVINS CATERING</h1>
        <h3 className='home__text'>WIJ ZIJN OPEN</h3>

        <Button
          type='button'
          variant='light'
          className='home__button home__text'
          onClick={() => {
            navigate(`/search`)
          }}>
          BESTEL ONLINE
        </Button>
      </section>
    </div>
  )
}

export default HomeScreen
