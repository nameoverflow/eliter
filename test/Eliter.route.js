"use strict"

let Eliter = require('..'),
    request = require('supertest'),
    assert = require('assert')

describe('Eliter#route(uri, handler)', () => {

    it('Should create a new route', done => {
        let app = new Eliter()
        app.route('/a').get(function* () {
            this.send('text', 'ouch!')
        })

        request(app._server).get('/a')
        .expect('ouch!', done)
    })

    it('Should add route with url params rightly', done => {
        let app = new Eliter()
        app.route('/::/::').get(function* (a, b) {
            this.send('text', `${a} ${b}`)
        })

        request(app._server).get('/ouch/omg')
        .expect('ouch omg', done)
    })


    it('Should work with generator async function', done => {
        let asyncFun = val => 
            new Promise(res => setTimeout(() => res(val), 1))
        let app = new Eliter()
        app.route('/').get(function* () {
            let a = yield asyncFun(1),
                b = yield asyncFun(2),
                c = yield asyncFun(3)
            this.send('text', `${a}${b}${c}`)
        })
        request(app._server).get('/')
        .expect('123', done)
    })

    it('Shold work as nested route', done => {
        let asyncFun = val => 
            new Promise(res => setTimeout(() => res(val), 1))
        let app = new Eliter()
        app.route('/abc', function* (child) {
            let a = yield asyncFun(1)

            this.a = a
            yield* child
        }).route('/::').get(function* (arg) {
            let b = yield asyncFun(arg)

            this.send('text', `${this.a}, ${b}`)
        })
        request(app._server).get('/abc/abc')
        .expect('1, abc', done)
    })

    it('Should send 405', done => {
        let app = new Eliter()
        app.route('/test').post(function* () {
            this.send('text', '233')
        })

        request(app._server).get('/test')
        .expect(405, done)

    })

})
