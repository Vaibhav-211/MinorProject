const Event = require("../models/event");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let event = await Event.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  event.reviews.push(newReview);

  await newReview.save();
  await event.save();

  req.flash("success", "New Review Created!");
  res.redirect(`/events/${event._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Event.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/events/${id}`);
};
