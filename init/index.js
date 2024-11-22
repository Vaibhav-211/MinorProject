const mongoose = require("mongoose");
const initData = require("./data.js");
const Event = require("../models/PlanMate.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Momentous";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


const initDB = async()=>{
  await Event.deleteMany({});
    await Event.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();