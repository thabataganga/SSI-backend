// controllers/ariesClientController.js
const { ariesClient } = require("../services");

console.log("Aries services")

async function requestAuthToken(req, res, next) {
  const { tenantId, apiKey, walletKey } = req.body;

  try {
    const token = await ariesClient.requestAuthToken(tenantId, apiKey, walletKey);
    res.json({ token });
  } catch (error) {
    next(error);
  }
}

async function createInvitation(req, res, next) {
  const { token, alias, multiUse } = req.body;

  try {
    const invitation = await ariesClient.createInvitation(token, alias, multiUse);
    res.json({ invitation });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  requestAuthToken,
  createInvitation
};
