"use strict"

var zlib = require('zlib'),
    url = require('url'),
    query = require('querystring'),
    file = require('./file'),
    getSession = require('./Session'),
    logger = require('./logger')

const HEADERS = {
        'server': 'black-tech',
        'Connection': 'keep-alive',
        'charset': 'utf-8',
        'Content-Type': 'text/plain'
    },
    CONTENT_TYPE = {
        'html': 'text/html',
        'json': 'application/json',
        'text': 'text/plain'
    }

/** Class describe the connection of each request */
class Connection {
    /**
     * @param  {http.IncomingMessage} req  Node's request object
     * @param  {http.ServerResponse}  res  Node's response object
     * @param  {Object}               conf Config
     * @return {Connection}
     */
    constructor(req, res, conf) {

        /** @type {http.IncomingMessage} Request */
        this._req = req

        /** @type {http.ServerResponse} Response */
        this._res = res

        this._conf = conf
        this.url = url.parse(this._req.url)
        this.query = this.url.query && query.parse(this.url.query)
    }

    /**
     * Send data as respones
     * 
     * @param  {(String|Object)} sel           Type of data or headers to set.
     * @param  {Number}          [sel.status]  HTTP code
     * @param  {Object}          [sel.headers] Headers of response
     * @param  {(String|Object)} data          Data to send
     * @return {Connection} Return self
     *
     * @public
     */
    send(sel, data) {

        let stat,

            cur_headers = Object.assign({}, HEADERS)
        
        if (typeof sel === 'string') {
            if (!CONTENT_TYPE[sel]) {
                logger.msg(conn, `Unkown sending selection "${sel}", using text/plain`)
            }
            cur_headers['Content-Type'] = CONTENT_TYPE[sel]
            stat = 200


        /** If sel param is Object, copy status code and headers */

        } else {

            // let {status, headers} = sel
            // Nodejs doesn't support destructing....
            // 14th Feb. 2016

            stat = sel.status
            Object.assign(cur_headers, sel.headers)
        }

        // this._res.writeHead(stat, cur_headers)
        if (data) {

            /** If data is an object, send JSON */
            if (typeof data !== 'string') {
                data = JSON.stringify(data)
            }


            if (acceptGzip(this._req)) {

                /** Compose */
                zlib.gzip(data, (err, result) => {
                    if (err) {
                        logger.msg("error gzipping!")
                        this._sendRes(500, cur_headers, "error gzipping!")
                    } else {
                        cur_headers['Content-Encoding'] = 'gzip'
                        this._sendRes(stat, cur_headers, result)
                    }
                })
            } else {
                this._sendRes(stat, cur_headers, data)
            }
        } else {
            this._sendRes(stat, cur_headers)
        }

        /** Developing log */
        if (process.env.NODE_ENV === 'development') {
            logger.msg(this, data)
        }
        return this
    }

    _sendRes(code, headers, data) {
        this._res.writeHead(code, headers)
        this._res.end(data)
    }
    /** Assign to `redirect` */
    jump(loc) {
        return this.redirect(loc)
    }

    /**
     * Send response to redirect
     * @param  {String} loc Location to redirect
     * @return {Connection} Return self
     *
     * @public
     */
    redirect(loc) {
        return this.send({
            status: 302,
            headers: {
                Location: loc
            }
        })
    }

    /**
     * Send a res as error
     * @param  {String} str      String descripting error
     * @param  {Number} [code=500] Http code of the error
     * @return {Connection} Return self
     *
     * @public
     */
    error(str, code/* = 500*/) {
        code = code || 500
        return this.send({
            status: code
        }, str)
    }

    /**
     * Set cookies
     * @param {Object} cookie_data data of cookies
     * @return {Connection} Return self
     *
     * @public
     */
    setCookie(cookie_data) {
        var cookies, k, v
        cookies = (function() {
            var results
            results = []
            for (k in cookie_data) {
                v = cookie_data[k]
                results.push(k + "=" + v)
            }
            return results
        })();
        this._res.setHeader('Set-Cookie', cookies.join(';'))
        return this
    }
    /**
     * Get request body
     * @param  {Number} [max_size = 1e6] The max size of data.
     * Kill connection if overflow.
     * @return {Promise} Promise of http body's data
     *
     * @public
     */
    getBody(max_size/* = 1e6*/) {
        if (!max_size) { max_size = 1e6 }

        let req = this._req
        return new Promise((resolve, reject) => {
            let http_body = ''
            req.on('data', post_chunk => {
                http_body += post_chunk
                if (http_body.length > max_size) {
                    req.connection.destroy()
                    reject()
                }
            })
            req.on('end', () => resolve(http_body))
        })
    }
    /**
     * Get cookie of current request
     * @return {Object} Object include cookies
     *
     * @public
     */
    get cookie() {
        let cookies = {},
            headers = this._req.headers
        if (headers.cookie) {
            for (let cookie of headers.cookie.split(';')) {
                let parts = cookie.split('=')
                cookies[parts[0].trim()] = (parts[1] || '').trim()
            }
        }

        return cookies
    }

    /**
     * Get HTTP headers of current request
     * @return {Object} Headers
     */
    get headers() {
        return this._req.headers
    }
    /**
     * Config getter
     * @return {Object} config
     */
    get config() {
        return this._conf
    }
    /**
     * Get HTTP method
     * @return {String} Method
     */
    get method() {
        return this._req.method.toLowerCase()
    }
}


Connection.prototype.sendFile = file
Connection.prototype.session = getSession


function acceptGzip(request) {
    let acceptEncoding = request.headers['accept-encoding'] || ""
    return /\bgzip\b/.test(acceptEncoding)
}


module.exports = Connection
