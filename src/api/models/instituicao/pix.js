const mongoose = require("mongoose");

const PixSchema = mongoose.Schema(
  {
    key: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const pix = {
  type: PixSchema,
  default: {},
};

module.exports = pix;
