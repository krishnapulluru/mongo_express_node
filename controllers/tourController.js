const Tour = require('./../models/toursModel');
const APIFeatures = require('./../utils/apiFeatures');
const ac = require("./../utils/catchError");
const AppError = require("./../utils/appError");
//Alasing Feature using middleware
exports.topFiveCheapTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,duration,summary';
  next();
};

exports.getAllTours = ac(async (req, res, next) => {
  const featuresApi = new APIFeatures(Tour.find(), req.query)
    .filtering()
    .sorting()
    .fieldsLimiting()
    .paginate();
  // Executing the Query
  const tours = await featuresApi.query;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
})

exports.getTour = ac(async (req, res, next) => {
  const result = await Tour.findById(req.params.id);

  if (!result) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      result
    }
  })
})

exports.createTour = ac(async (req, res, next) => {
  const tourRes = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: tourRes
    }
  });
})

exports.updateTour = ac(async (req, res, next) => {
  const result = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!result) {
    return next(new AppError("No Tour Found with that ID", 404))
  }
  res.status(204).json({
    status: 'success',
    data: {
      result
    }
  });
})

exports.deleteTour = ac(async (req, res, next) => {

  const result = await Tour.findByIdAndDelete(req.params.id);
  console.log(result);
  if (!result) {
    return next(new AppError("No Tour Found with that ID", 404))
  }
  res.status(200).json({
    status: 'success',
    message: 'Deleted Successfully!'
  });
})

exports.toursStats = ac(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $group: {
        _id: 'duration',
        tours_duration_array: {
          $push: {
            name: '$name',
            price: '$price',
            duration: '$duration'
          }
        }
      }
    }
  ])
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  })
})

exports.montlyPlan = ac(async (req, res, next) => {
  const year = req.body.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    result: plan.length,
    data: {
      plan
    }
  });
})
