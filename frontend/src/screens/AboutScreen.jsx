import React from 'react'

import { Helmet } from 'react-helmet-async'

export default function SearchScreen() {
  return (
    <div>
      <Helmet>
        <title>Over</title>
      </Helmet>
      <section className='about'>
        <div className='about__bio-image'>
          <div className='about__bio'>
            <h2 className='text-secondary'>BIO</h2>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Dignissimos facere possimus asperiores incidunt ipsa earum
              ratione. Doloribus porro in vero magni, placeat asperiores, nulla
              deleniti corrupti sequi reprehenderit, eaque aliquid!
            </p>
          </div>
        </div>

        <div className='jobs'>
          <div className='jobs__job'>
            <h2 className='text-secondary'>2022 - current</h2>
            <h3>Your Company</h3>
            <h6>Kok</h6>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem,
              omnis alias? Facilis odit corporis natus eius! Placeat sunt ab nam
              nihil beatae, hic saepe reiciendis, qui, suscipit ipsum blanditiis
              debitis.
            </p>
          </div>
          <div className='jobs__job'>
            <h2 className='text-secondary'>2012 - 2022</h2>
            <h3>Your Company</h3>
            <h6>Kok</h6>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem,
              omnis alias? Facilis odit corporis natus eius! Placeat sunt ab nam
              nihil beatae, hic saepe reiciendis, qui, suscipit ipsum blanditiis
              debitis.
            </p>
          </div>
          <div className='jobs__job'>
            <h2 className='text-secondary'>2002 - 2012</h2>
            <h3>Your Company</h3>
            <h6>Kok</h6>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem,
              omnis alias? Facilis odit corporis natus eius! Placeat sunt ab nam
              nihil beatae, hic saepe reiciendis, qui, suscipit ipsum blanditiis
              debitis.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
