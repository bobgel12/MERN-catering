import React from 'react'

import { Helmet } from 'react-helmet-async'

export default function SearchScreen() {
  return (
    <div>
      <Helmet>
        <title>Over</title>
      </Helmet>
      <section className='contact'>
        <h4>CONTACT</h4>
        <div className='contact__list'>
          <div className='contact__email'>
            <i className='fas fa-envelope'></i> Email
            <div className='text-secondary'>luna.dl@hotmail.com</div>
          </div>
          <div className='contact__phone'>
            <i className='fas fa-mobile-alt'></i> Tel.
            <div className='text-secondary'>+324 67 03 97 74</div>
          </div>
          <div className='contact__address'>
            <i className='fas fa-marker-alt'></i> Adres
            <div className='text-secondary'>
              Straat 123, 2570 Duffel, Belgium
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
