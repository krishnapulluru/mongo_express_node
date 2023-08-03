const express = require('express');
const tourController = require('./../controllers/tourController');
const auth = require("./../controllers/authController")
const router = express.Router();

router
  .route('/top-5-cheap-tours')
  .get(tourController.topFiveCheapTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.toursStats);
router.route('/montly-plan/:year').get(tourController.montlyPlan);
router
  .route('/')
  .get(auth.protect , tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
