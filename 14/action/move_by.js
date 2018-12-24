const cache = []
class MoveBy {
    constructor() {}

    init(toX, toY, duration, ease, callback) {
        this.name = 'MoveBy'
        this.fromX = 0
        this.fromY = 0
        this.toX = toX
        this.toY = toY
        this.duration = duration
        this.iDuration = duration != 0 ? 1 / duration : 0
        this.callback = callback
        this.target = null
        this.parent = null
        this.fn = null
        this.tick = 0
        this.isFinished = false
        return this
    }
    initWithFn(fn, duration, ease, callback) {
        this.init(null, null, duration, ease, callback)
        this.fn = fn
        return this
    }
    run(target) {
        if (this.fn) {
            this.fn(target)
        }
        this.target = target
        this.fromX = target.spaceComponent.position.x
        this.fromY = target.spaceComponent.position.y
        return this
    }
    updateFrame(percent) {
        this.target.spaceComponent.position.update(
            this.toX * percent + this.fromX,
            this.toY * percent + this.fromY
        )
        return this
    }
    update(frameElapsedTime) {
        this.tick += frameElapsedTime
        if (this.tick >= this.duration) {
            this.updateFrame(1)
            this.isFinished = true
            if (this.callback) {
                this.callback(this.target)
            }
            this.parent.removeAction(this)
        } else {
            this.updateFrame(this.tick * this.iDuration)
        }
        return this
    }
    restore() {
        this.tick = 0
        this.isFinished = false
        return this
    }
    remove() {
        this.parent =
            this.target =
            this.callback =
            this.fn = null
        this._collect()
    }
    _collect() {
        MoveBy.collect(this)
    }
    static create(toX, toY, duration, ease, callback) {
        return (cache.length ? cache.pop() : new MoveBy).init(toX, toY, duration, ease, callback)
    }
    static createWithFn(fn, duration, ease, callback) {
        return (cache.length ? cache.pop() : new MoveBy).initWithFn(fn, duration, ease, callback)
    }
    static collect(item) {
        cache.push(item)
    }
}

export default MoveBy