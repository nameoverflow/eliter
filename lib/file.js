"use strict"

// let {fs, zlib} = require('mz')
let fs = require('mz').fs,
    zlib = require('mz').zlib

/**
 * Method hendling static file request
 * @method   sendFile
 * @memberof Connection.prototype
 * 
 * @param    {String} path Path to file
 * @return   {Promise}
 * 
 * @public
 */
module.exports =
function sendFile(path) {
    let headers = Object.assign({}, this.getConf('server').headers),
        file_name = (path.split('/')).pop(),
        ext = (file_name.split('.')).pop()
    headers['Content-Type'] = this.getConf('file').type[ext] || 'text/plain'
    return fs.stat(path)
        // .then(sendFile.bind(this), errorHandle.bind(this))
        .then(stat => {
            if (!stat) {
                this.send({
                    'status': 404,
                    'headers': {
                        'Content-Type': 'text/html'
                    }
                }, '<html>not found!</html>')
            } else {
                sendFile.call(this)
            }
        }, errorHandle.bind(this))
}

function errorHandler(err) {
    this.send({
        status: 500
    }, 'server error')
}

/** Shit codes...Read and send file */
function sendFile() {
    let lastModified = stat.mtime.toUTCString(),
        IMS = this._req.headers['if-modified-since']
    if (IMS && lastModified === IMS) {
        this._res.writeHead(304, "Not Modified")
        this._res.end()
    } else {
        let expires = new Date(),
            raw = fs.createReadStream(file_path),
            matched = ext.match(this.getConf('file')['compress'].match),
            acceptEncoding = this._req.headers['accept-encoding'] || ""

        expires.setTime(expires.getTime() + this.getConf('file')['maxAge'] * 1000)
        res_header["Expires"] = expires.toUTCString()
        res_header["Cache-Control"] = `max-age=${this.getConf('file')['maxAge']}`
        
        if (matched && acceptEncoding.match(/\bgzip\b/)) {
            res_header['Content-Encoding'] = 'gzip'
            this._res.writeHead(200, 'OK', res_header)
            raw.pipe(zlib.createGzip()).pipe(this._res)
        } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
            res_header['Content-Encoding'] = 'deflate'
            this._res.writeHead(200, 'OK', res_header)
            raw.pipe(zlib.createDeflate()).pipe(this._res)
        } else {
            this._res.writeHead(200, 'OK', res_header)
            raw.pipe(this._res)
        }
    }
}
