const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Event = require("../models/event.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Reviews 
// Post Review Route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let event = await Event.findById(req.params.id);
    let newReview = new Review(req.body.review);

    event.reviews.push(newReview);

    await newReview.save();
    await event.save();

    res.redirect(`/events/${event._id}`);

  })
);


// Delete  Review Route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Event.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/events/${id}`);
  })
);

module.exports = router;