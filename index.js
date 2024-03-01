const mongoose = require("mongoose");
const cachegoose = require("recachegoose");
const ConverterBot = require("./bot");
const { TG_TOKEN, MONGO_URL } = require("./const");

cachegoose(mongoose, {
  engine: "memory",
});

mongoose
  .connect(MONGO_URL)
  .then((result) => {
    console.log("CONNECTED TO DB");
    new ConverterBot(TG_TOKEN);
  })
  .catch((err) => {
    console.log(err);
  });
