"use strict"

const R = require('eli-router'),
    nodeFactory = require('./factory')


class Router extends R {
    constructor() {
        super()
    }

    route(route_string, handler) {
        let child = super.route(route_string, handler)
        child.route = this.route
        return nodeFactory(child)
    }

    static compose(ctx, arr) {
        let child = nothing

        for (let v of arr) {
            v[1].push(child)
            child = R.handle(v, ctx)
        }
        return child
    }
}

function* nothing() {}

module.exports = Router
