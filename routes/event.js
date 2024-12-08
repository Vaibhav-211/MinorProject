const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Event = require("../models/event.js");
const { isLoggedIn, isOwner, validateEvent } = require("../middleware.js");
const eventController = require("../controllers/events.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(eventController.index))
  .post(
    isLoggedIn,
    upload.single("event[image]"),
    validateEvent,
    wrapAsync(eventController.createEvent)
  );

// New Route
router.get("/new", isLoggedIn, eventController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(eventController.showEvent))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("event[image]"),
    validateEvent,
    wrapAsync(eventController.updateEvent)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(eventController.destroyEvent));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(eventController.renderEditForm)
);

module.exports = router;
