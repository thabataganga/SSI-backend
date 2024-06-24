const mongoose = require("mongoose");
const util = require("util");
const client = require("../../infra/redisClient");

client.set("foo", (err) => {
   if (err) console.error(err);
   console.log("salvo")
})