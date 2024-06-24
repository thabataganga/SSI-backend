const axios = require('axios');
const ariesService = require('../services/ariesService');

async function requestAuthToken(tenantId, apiKey, walletKey) {
    //console.log(req.body);
   // const { tenantId, apiKey, walletKey } = req.body;
    //const walletKey = "";
    
        const ariesApiClient = ariesService.createAriesApiClient();
        const requestData = { tenantId, apiKey, walletKey };
        const response = await ariesApiClient.post(`/multitenancy/tenant/${tenantId}/token`, requestData);
        const token = response.data.token;
        res.json({ token });
   
}

async function createInvitation(req, res, next) {
    const { token, alias, multiUse } = req.body;

    try {
        const ariesApiClient = ariesService.createAriesApiClient(token);
        const requestData = { alias, multi_use: multiUse };
        const response = await ariesApiClient.post('/connections/create-invitation', requestData);
        const invitation = response.data;
        res.json({ invitation });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    requestAuthToken,
    createInvitation
};
