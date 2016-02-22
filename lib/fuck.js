var fuck = gen => {
    // return new Promise(resolve => {
    //     var it = gen()
    //     var go = res => {
    //         var p = it.next(res)
    //         if (p.done) { resolve(p.value) }
    //         p.value.then(go)
    //     }
    //     go()
    // })
    var it = gen()
    var go = res => {
        var p = it.next(res)
        if (p.done) { return }
        p.value.then(go)
    }
    go()
}
module.exports = fuck