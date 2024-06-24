const mongoose = require("mongoose");

const WalletSchema = mongoose.Schema(
  {
    tenantId: {
      type: String,
    },
    apiKey: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);
const wallet = {
  type: WalletSchema,
  default: {
    tenantId: null,
    apiKey: null,
    token: null,
  },
};

module.exports = wallet;
