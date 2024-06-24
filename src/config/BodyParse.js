const express = require("express");

module.exports = app => {
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use( (req, _, next) => {
            req.locals = {};
            return next()
        })
}