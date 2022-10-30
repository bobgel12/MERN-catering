import express from 'express'
import { isAdmin, isAuth } from '../utils.js'
import Reservation from '../models/reservationModel.js'
import expressAsyncHandler from 'express-async-handler'

const reservationRouter = express.Router()

// CREATE
reservationRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newReservation = new Reservation({
      date: req.body.date,
      fullName: req.body.fullName,
      company: req.body.company,
      address: req.body.address,
      postalCode: req.body.postalCode,
      city: req.body.city,
      comments: req.body.comments,
    })

    const reservation = await newReservation.save()
    res.status(201).send({ message: 'New Reservation Created', reservation })

    main().catch(console.error)
  })
)

// UPDATE RESERVATION
reservationRouter.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(201).send({ message: 'Reservation updated', updatedReservation })

    main().catch(console.error)
  })
)

// UPDATE AVAILABILITY
reservationRouter.put(
  '/availability/:id',
  expressAsyncHandler(async (req, res) => {
    await Reservation.updateOne(
      { 'Reservation._id': req.params.id },
      {
        $push: {
          'Reservation.$.unavailableDate': req.body.dates,
        },
      }
    )
    res
      .status(201)
      .send({ message: 'Reservation date status has been updated.' })

    main().catch(console.error)
  })
)

// DELETE RESERVATION
reservationRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id)
    if (reservation) {
      await Reservation.remove()
      res.send({ message: 'Reservation Deleted' })
    } else {
      res.status(404).send({ message: 'Reservation Not Found' })
    }
    main().catch(console.error)
  })
)

// GET RESERVATION
reservationRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const Reservation = await Reservation.findById(req.params.id)
    res.status(200).json(Reservation)
    main().catch(console.error)
  })
)

// GET ALL
reservationRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const Reservations = await Reservation.find()
    res.status(200).json(Reservations)
    main().catch(console.error)
  })
)

export default reservationRouter
