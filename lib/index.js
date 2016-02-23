"use strict"
var http = require('http'),
    query = require('querystring'),
    Conn = require('./Connection'),
    Router = require('./Router'),
    utils = require('./utils'),
    conf = require('./config'),
    fuck = require('./fuck')


/** Entry class making a new application */
class Eliter {
    /**
     * Make a new instance of Eliter and starts listening port
     * @param  {Object} [init_conf] Config
     * @return {Eliter}             App instance
     */
    constructor(init_conf) {
        this._conf = conf
        this._router = new Router()
        this._decos = []

        Object.assign(this._conf, init_conf)

        const callback = this._callbackFactory()
        /** 
         * @type {http.Server}
         *
         * @private
         */
        this._server = http.createServer(callback)
    }

    _callbackFactory() {
        return (req, res) => {
            const cur_conn = this._makeConn(req, res),
                path = cur_conn.url.pathname,
                results = this._router.dispatch(path)

            if (!results) {
                cur_conn.send({
                    'status': 404
                }, 'not found!')
                return
            }

            fuck(function* () {
                yield* Router.compose(cur_conn, results)
            })
        }
    }

    _makeConn(req, res) {
        let cur_conn = new Conn(req, res)
        cur_conn.getConf = prop => this.config[prop]
        this._decos.forEach(deco => deco(cur_conn))

        return cur_conn
    }

    /**
     * Start listening.
     * @param {Number} port Port to listen
     *
     * @public
     */
    start(port) {
        console.log('server start with port ' + conf.server.port)
        return this._server.listen(port || this.config.server.port || 4000, 0, 0, 0, 0)
    }
    /**
     * Add new route
     * @param  {(String|Array)} route_string String of uri or an array contains uris
     * @param  {Generator}      handler      Route handler
     * @return {void}
     *
     * @public
     */
    route(route_string, handler) {
        return this._router.route(route_string, handler)
    }

    /**
     * Add a decoration.
     * A decoration function will be applied to the prototype of class `Connection`
     * (changing or giving new props/methods)
     * when recieve a new request.
     * 
     * @param  {Function} deco function with a `Connection` param
     * @return {void}
     *
     * @public
     */
    decor(deco) {
        this._decos.push(deco)
    }


    /**
     * Get config value
     * @return {Object} Config object
     *
     * @public
     */
    get config() {
        return this._conf
    }
}


module.exports = Eliter