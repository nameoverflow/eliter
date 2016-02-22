module.exports.msg = function (conn, msg) {
    console.log({
        'time': new Date(),
        'status': conn._res.statusCode,
        'ip': conn._req['connection']['remoteAddress'],
        'url': conn._req.url,
        'user-agent': conn._req.headers['user-agent'],
        'MSG': msg
    })
}