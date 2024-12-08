const Event = require("../models/event");

module.exports.index = async (req, res) => {
  const allEvents = await Event.find({});
  res.render("events/index.ejs", { allEvents });
};

module.exports.renderNewForm = (req, res) => {
  res.render("events/new.ejs");
};

module.exports.showEvent = async (req, res) => {
  let { id } = req.params;
  const event = await Event.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!event) {
    req.flash("error", "Event you requested for does not exits!");
    res.redirect("/events");
  }
  res.render("events/show.ejs", { event });
};

module.exports.createEvent = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newEvent = new Event(req.body.event);
  newEvent.owner = req.user._id;
  newEvent.image = { url, filename };
  await newEvent.save();
  req.flash("success", "New Event Created!");
  res.redirect("/events");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const event = await Event.findById(id);
  if (!event) {
    req.flash("error", "You are not the owner of this event");
    res.redirect("/events");
  }
  let originalImageUrl = event.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("events/edit.ejs", { event , originalImageUrl });
};

module.exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  let event = await Event.findByIdAndUpdate(id, { ...req.body.event });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    event.image = { url, filename };
    await event.save();
  }
  req.flash("success", "Events Updated!");
  res.redirect(`/events/${id}`);
};

module.exports.destroyEvent = async (req, res) => {
  const { id } = req.params;
  const deletedEvent = await Event.findByIdAndDelete(id);
  req.flash("success", "Events Deleted!");
  res.redirect("/events");
};
