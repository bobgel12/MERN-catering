import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const HomeScreen = () => {
  return (
    <div>
      <Helmet>
        <title>Kevins catering</title>
      </Helmet>

      <section className='home'>
        <h1>KEVINS CATERING</h1>
        <h3 className='home__text'>WIJ ZIJN OPEN</h3>
        <Link
          to={'/search'}
          className='home__button home__text'>
          BESTEL ONLINE
        </Link>
      </section>
    </div>
  )
}

export default HomeScreen
