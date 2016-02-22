module.exports = {
    'server': {
        'port': 4000,
        'headers': {
            'server': 'black-tech',
            'Connection': 'keep-alive',
            'charset': 'utf-8'
        }
    },
    'file': {
        'type': {
            'html': 'text/html',
            'js': 'application/x-javascript',
            'json': 'application/json',
            'css': 'text/css',
            'ico': 'image/x-icon',
            'jpg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'rar': 'application/zip',
            'zip': 'application/zip',
            'pdf': 'application/pdf',
            'txt': 'text/plain'
        },
        'maxAge': 60 * 60 * 24 * 365,
        'compress': {
            'match': /css|js|html/ig
        }
    },
    'session': {
        'PATH_ROOT': 'tmp/',
        'MAX_AGE': 60 * 60 * 24 * 7
    }
}
