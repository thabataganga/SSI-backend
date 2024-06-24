const {
  requestAuthToken,
  createInvitation,
  getConnections,
  getConnection,
  checkConnectionState,
  sendOffer,
  checkCredentialState,
  getDIdDocument,
  sendProofRequest,
  verifyProof,
} = require("./ariesClient.js");
const ConviteService = require("./ConviteService")();
const AdminService = require("./adminService")();

module.exports = {
  ConviteService,
  AdminService,
  ariesClient: {
    requestAuthToken,
    createInvitation,
    getConnections,
    getConnection,
    checkConnectionState,
    sendOffer,
    checkCredentialState,
    getDIdDocument,
    sendProofRequest,
    verifyProof,
  },
};
