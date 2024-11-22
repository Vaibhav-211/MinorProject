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
    filename: {
      type: String,
      default: "defaultImage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: (v) =>
        v && v.trim() !== ""
          ? v
          : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  startDateTime: {
    type: Date,
    required: [true,"Start date and time are required."]
  },
  endDateTime: {
    type: Date,
    required: [true,"End date and time are required."],
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
});

PlanMateSchema.post("findOneAndDelete", async (event) => {
  if (event) {
    await Review.deleteMany({ _id: { $in: event.reviews } });
  }
});
const Event = mongoose.model("Event", PlanMateSchema);
module.exports = Event;
