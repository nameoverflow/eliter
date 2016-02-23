# Eliter

[![Build Status](https://travis-ci.org/nameoverflow/eliter.svg?branch=master)](https://travis-ci.org/nameoverflow/eliter)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Eliter is a micro web server based on Node.js, supporting `route`, `session` and `static file`, using co-like generator-based APIs.

### Install

```
npm install eliter --save
```

### Quick Start

```javascript

const Eliter = require('eliter')

let app = new Eliter()

app.route('/').get(function* () {
    this.send('text', 'hello eliter!') // `this` there is an instance of class Connection
})

// `::` stands for a URL param
app.route('/do/::').get(function* (act, child) {
    this.act = act
    yield* child // the last param is handler of child route
}).route('/::').get(function* (name) {
    this.send('text', `${this.act} ${name}`)
})

// /do/hello/world => "hello world"

app.start(4000)

```

### APIs

[Eliter](https://github.com/nameoverflow/eliter/blob/master/docs/index.md) and [Connection](https://github.com/nameoverflow/eliter/blob/master/docs/Connection.md) docs