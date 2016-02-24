"use strict"

let Eliter = require('..'),
    request = require('supertest'),
    assert = require('assert')


describe('Connection', () => {

    describe('#send(String, data)', () => {
        let CONTENT_TYPE = {
            'html': 'text/html',
            'text': 'text/plain'
        }
        for(let t in CONTENT_TYPE) {
            it('should send ' + t, done => {
                let app = new Eliter()

                app.route('/' + t).get(function *() {
                    this.send(t, t)
                })

                request(app._server)
                .get('/' + t)
                .expect('Content-Type', CONTENT_TYPE[t], done)
            })
        }
    })

    describe('#send(Object, data)', () => {
        it('should set header and status', done => {
            let app = new Eliter()

            app.route('/a').get(function *() {
                this.send({
                    status: 202,
                    headers: {
                        'x-test': 'ouch'
                    }
                }, '')
            })

            request(app._server)
            .get('/a')
            .expect(202)
            .expect('x-test', 'ouch', done)
        })
    })


    describe('#redirect(loc)', () => {
        it('should redirect', done => {
            let app = new Eliter()

            app.route('/a').get(function *() {
                this.redirect('/')
            })

            request(app._server)
            .get('/a')
            .expect(302)
            .expect('Location', '/', done)
        })
    })

    describe('#setCookie(Object)', () => {
        it('should set cookie', done => {
            let app = new Eliter()

            app.route('/').get(function *() {
                this.setCookie({a: 'omg'})
                    .send('text', '')
            })

            request(app._server)
            .get('/')
            .expect('Set-Cookie', 'a=omg', done)
        })
    })

    describe('#getBody(max_size)', () => {
        it('should get request body', done => {
            let app = new Eliter()

            app.route('/').post(function *() {
                let body = yield this.getBody()

                this.send('text', body)
            })

            request(app._server)
            .post('/').send('omg')
            .expect('omg', done)
        })
    })

    describe('#session()', () => {
        it('should create new session and set cookie of the sid', done => {
            var fs = require('fs')
            fs.mkdir('tmp', () => {
                let app = new Eliter()
                app.route('/').get(function *() {
                    let session = yield this.session()
                    this.send('json', session)
                })

                request(app._server)
                .get('/')
                .end((err, res) => {
                    let sid = res.body.sid
                    let set_cookie = res.headers['set-cookie']
                    fs.exists(app.config.session['PATH_ROOT'] + sid, exists => {
                        require( 'child_process' ).exec( 'rm -r ' + app.config.session['PATH_ROOT'], (err) => {
                            if (err) throw err
                            if (exists) {
                                if (set_cookie.toString().indexOf('sid=' + sid) < 0) {
                                    throw new Error('have not set cookie of session ' + sid)
                                }
                                done()
                            } else {
                                throw new Error('have not created session file ' + sid)
                            }
                        })
                    })
                })
            })
        })
    })
 
})
