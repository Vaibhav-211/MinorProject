const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const PlanMateSchema = new Schema({
  eventName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  image: {
    url: String,
    filename: String,
  },
  startDateTime: {
    type: Date,
    required: [true, "Start date and time are required."],
  },
  endDateTime: {
    type: Date,
    required: [true, "End date and time are required."],
    validate: {
      validator: function (value) {
        return value > this.startDateTime;
      },
      message: "End date must be after start date.",
    },
  },
  location: {
    type: String,
    maxlength: 100,
  },
  country: {
    type: String,
    maxlength: 50,
  },
  venueType: {
    type: String,
    enum: ["Indoor", "Outdoor", "Virtual"],
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

PlanMateSchema.post("findOneAndDelete", async (event) => {
  if (event) {
    await Review.deleteMany({ _id: { $in: event.reviews } });
  }
});
const Event = mongoose.model("Event", PlanMateSchema);
module.exports = Event;
