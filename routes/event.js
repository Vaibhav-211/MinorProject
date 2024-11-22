const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { eventSchema} = require("../schema.js");
const Event = require("../models/event.js");


const validateEvent = (req, res, next) => {
  // let { error } = eventSchema.validate(req.body);
  let { error } = eventSchema.validate({ event: req.body.event })
  if (error) {
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allEvents = await Event.find({});
    res.render("events/index.ejs", { allEvents });
  })
);

// New Route
router.get("/new", (req, res) => {
  res.render("events/new.ejs");
});

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const event = await Event.findById(id).populate("reviews");
    res.render("events/show.ejs", { event });
  })
);

// Create Route
router.post(
  "/",
  validateEvent,
  wrapAsync(async (req, res) => {
    const newEvent = new Event(req.body.event);
    await newEvent.save();
    req.flash("success","New Event Created!");
    res.redirect("/events");
  })
);

// Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const event = await Event.findById(id);
    res.render("events/edit.ejs", { event });
  })
);

// Update Route
router.put(
  "/:id",
  validateEvent,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Event.findByIdAndUpdate(id, { ...req.body.event });
    res.redirect(`/events/${id}`);
  })
);

// Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedEvent = await Event.findByIdAndDelete(id);
    console.log(deletedEvent);
    res.redirect("/events");
  })
);

module.exports = router;