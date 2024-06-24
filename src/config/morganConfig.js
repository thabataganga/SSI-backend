const morgan = require('morgan');
const labels = '[INFO] :method - :url ip: - :remote-addr - :remote-user [:date[web]] " HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'

module.exports = app => {
    if (process.env.NODE_ENV != "production") {
        app.use(morgan(labels))
    }
}