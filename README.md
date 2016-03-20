# Eliter

[![Build Status](https://travis-ci.org/nameoverflow/eliter.svg?branch=master)](https://travis-ci.org/nameoverflow/eliter)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Eliter is a tiny node.js web server framework, providing generator-based async APIs.

## Quick Start

### Install

```
npm install eliter --save
```

### Hello World

```javascript

const Eliter = require('eliter')

let app = new Eliter()

app.route('/').get(function* () {
    this.send('text', 'hello eliter!') // `this` there is an instance of class Connection
})

// `::` stands for a URL param
app.route('/do/::', function* (act, child) {
    this.act = act
    yield* child // the last param is handler of child route
}).route('/::').get(function* (name) {
    this.send('text', `${this.act} ${name}`)
})

// /do/hello/world => "hello world"

app.start(4000)

```

## What it looks like

### Generator-based Async

```javascript
const app = new Eliter()
app.route('/').get(function *() {
    const data = yield getFromModel()
    this.send('json', data)
})
```

### Nested Router and Middleware

```javascript
const app = new Eliter()

const admin = app.route('/admin', function *(child) {
    const { data: { auth }} = yield this.session()
    if (auth) {
        yield* child
    } else {
        this.send({ status: 302, headers: { Location: '/login' }})
    }
})

const profile = admin.route('/profile').get(function* () {
    const data = yield getFromModel()
    this.send('html', `<p>Hello, ${data.username}<p>`)
})
```

### Pluginable

```javascript
const app = new Eliter()

const checkAuth = conn => conn.checkAuth = function* () {
    const { data: { auth }} = yield this.session()
    return !!auth
}

app.with(checkAuth)

const admin = app.route('/admin', function *(child) {
    if (yield* this.checkAuth()) {
        yield* child
    } else {
        this.send({ status: 302, headers: { Location: '/login' }})
    }
})
```

## Docs - FIXME

Clone and check `./docs`

Run `npm run doc` to build documentions (`npm i` and jsdoc3 required)
