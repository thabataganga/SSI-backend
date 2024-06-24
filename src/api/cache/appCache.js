// ref: https://www.npmjs.com/package/node-cache
const NodeCache = require( "node-cache" );
const appCache = new NodeCache({
    stdTTL: 100,
    maxKeys: -1,
});

module.exports  = appCache