"use strict"
let fs = require('fs'),
    crypto = require('crypto')

module.exports = getSession

function generateID() {
    return crypto
        .createHmac('md5', Math.ceil(Math.random() * 1000).toString())
        .update(new Date().getTime().toString())
        .digest('hex')
}

function createSession(sid, callback) {
    let _data = {
        'creatTime': new Date()
    }, path = this.getConf('session')['PATH_ROOT'] + sid
    this.setCookie({
        'sid': sid,
        'path': '/',
        'Max-Age': this.getConf('session')['MAX_AGE'],
        'HttpOnly': true
    })
    return fs.writeFile(path,
        JSON.stringify(_data),
        callback(new Session(path, sid, _data)))
}
/**
 * Init and load session
 * @method session
 * @memberOf Connection.prototype
 * @return {Promise}
 * 
 * @public
 */
function getSession() {
    var cookie = this.cookie,
        sid = cookie['sid'] || generateID(),
        file_path = this.getConf('session')['PATH_ROOT'] + sid

    return new Promise(res => {
        fs.exists(file_path, exists => {
            if (exists) {
                return fs.readFile(file_path, 'UTF-8', file_data => {
                    let data = JSON.parse(file_data),
                        cur_time = +new Date() / 1e3 - (+data.creatTime)
                    if (cur_time > this.getConf('session')['MAX_AGE']) {
                        fs.unlink(file_path)
                        .then(createSession.call(this, sid, res))
                    } else {
                        res(new Session(file_path, sid, data))
                    }
                })
            } else {
                createSession.call(this, sid, res)
            }
        })
    })
}
/**
 * Class of session object that will be passed to next `then`
 */
class Session {
    /**
     * Create a new Session object contains session data
     * @param  {String} path  Path of session file
     * @param  {String} sid   Session's id
     * @param  {Object} data  Session's data
     * @return {Session}
     */
    constructor(path, sid, data) {
        this.sid = sid
        this.path = path
        this.load(data)
    }
    /**
     * Load data
     * @param {Object} data
     *
     * @private
     */
    load(data) {
        this._data = data
    }
    get data() {
        return this._data
    }
    set(data) {
        this._data = Object.assign(this._data, data)
        this._data['creatTime'] = new Date()
        return new Promise(res => {
            this._save(res)
        })
    }
    _save(cb) {
        return fs.writeFile(this.path, JSON.stringify(this._data), cb)
    }
}

