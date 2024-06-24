const appEvent = require("./appEvent");

// internos
if (process.env.NODE_ENV !== "test") {
  require("./emailSubscriber")(appEvent);
  require("./usuarioSubscriber")(appEvent);
  //require('./sindpdSubscriber')(appEvent)
  //require('./logSubscriber')(appEvent)
}

module.exports = appEvent;
