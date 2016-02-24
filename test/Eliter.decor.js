"use strict"

let Eliter = require('..'),
    request = require('supertest'),
    assert = require('assert')


describe('Eliter.decor(deco)', () => {
    it('should add new method to conn object', (done) => {
        let app = new Eliter()
        app.decor(conn => {
            conn.test = function () {
                this.send('text', 'ouch!')
            }
        })
        app.route('/').get(function *(conn) {
            this.test()
        })

        request(app._server).get('/')
        .expect('ouch!', done)

    })
})