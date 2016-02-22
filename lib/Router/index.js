"use strict"

const R = require('eli-router'),
    nodeFactory = require('./factory')


class Router extends R {
    constructor() {
        super()
    }

    route(route_string, handler) {
        let child = super.route(route_string, handler)
        if (handler) {
            return child
        } else {
            child.route = this.route
            return nodeFactory(child)
        }
    }
}

module.exports = Router
