const methods = ['post', 'get', 'put', 'patch', 'delete']


function nodeFactory(route_node) {
    route_node._register = _register
    methods.forEach(v => route_node[v] = addMethod(v))
    return route_node
}

function addMethod(method) {
    return function(handler) {
        this._register(method, handler)
        return this
    }
}

function _register(method, handler) {
    if (!this.$methods) {
        this.$methods = {}
    }
    if (this.$methods[method]) {
        throw new Error('Add handler to same method more than once')
    }

    this.$methods[method] = handler
    this.$handler = handlerFactory(this.$methods)
}

function handlerFactory(methods) {
    return function* () {
        const method = this.method,
            args = Array.from(arguments)
        if (!methods[method]) {
            yield* unknown.call(this)
        } else {
            yield* methods[method].apply(this, args)
        }
    }
}

function* unknown() {
    this.error('Unknown method', 405)
}

module.exports = nodeFactory