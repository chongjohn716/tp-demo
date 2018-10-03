function MessageBus(a) {
  this.name = a
  this.messageMap = {}
  this.messageCount = 0
}

MessageBus.prototype.subscribe = function (a, c) {
  const d = this.messageMap[a]
  d == null && (this.messageMap[a] = [])
  this.messageMap[a].push(c)
  this.messageCount++
}

MessageBus.prototype.unsubscribe = function (a) {
  const c = this.messageMap[a]
  c != null && (this.messageMap[a] = null, delete this.messageMap[a], this.messageCount--)
}

MessageBus.prototype.publish = function (a, c, d) {
  const e = this.messageMap[a]
  if (e != null) {
    for (let f = 0; f < e.length; f++) {
      d ? !(function (a, b) {
        setTimeout(function () {
          a(b)
        }, 10)
      }(e[f], c)) : e[f](c)
    }
  }
}

export default MessageBus
