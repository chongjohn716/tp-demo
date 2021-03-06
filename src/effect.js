import util from './util'
import MessageBus from './message-bus'

var o = !1

function B(b, c) {
  var d,
    e = null

  return {
    stop: function () {
      return d ? (window.clearInterval(d), e && e.publish('stop'), this) : this
    },
    start: function () {
      var a = this
      d = setInterval(function () {
        b.call(a)
      }, c)
      return this
    },
    onStop: function (b) {
      e == null && (e = new MessageBus())
      e.subscribe('stop', b)
      return this
    }
  }
}
function gravity(a, c) {
  c = c || {}
  var d = c.gravity || 0.1,
    e = c.dx || 0,
    f = c.dy || 5,
    g = c.stop,
    h = c.interval || 30,
    i = new B(function () {
      g && g() ? (f = 0.5, this.stop()) : (f += d, a.setLocation(a.x + e, a.y + f))
    }, h)
  return i
}
function stepByStep(a, c, d, e, f) {
  var g = 1e3 / 24,
    h = {}
  for (var i in c) {
    var j = c[i],
      k = j - a[i]
    h[i] = {
      oldValue: a[i],
      targetValue: j,
      step: k / d * g,
      isDone: function (b) {
        var c = (this.step > 0 && a[b] >= this.targetValue) || (this.step < 0 && a[b] <= this.targetValue)
        return c
      }
    }
  }
  var l = new B(function () {
    var b = !0
    for (var d in c) {
      h[d].isDone(d) || (a[d] += h[d].step, b = !1)
    }
    if (b) {
      if (!e) {
        return this.stop()
      }
      for (d in c) {
        if (f) {
          var g = h[d].targetValue

          h[d].targetValue = h[d].oldValue
          h[d].oldValue = g
          h[d].step = -h[d].step
        } else {
          a[d] = h[d].oldValue
        }
      }
    }
    return this
  }, g)
  return l
}
function spring(a) {
  a == null && (a = {})
  var b = a.spring || 0.1,
    c = a.friction || 0.8,
    d = a.grivity || 0,
    e = (a.wind || 0, a.minLength || 0)

  return {
    items: [],
    timer: null,
    isPause: !1,
    addNode: function (a, b) {
      var c = {
        node: a,
        target: b,
        vx: 0,
        vy: 0
      }
      this.items.push(c)
      return this
    },
    play: function (a) {
      this.stop()
      a = a == null ? 1e3 / 24 : a
      var b = this
      this.timer = setInterval(function () {
        b.nextFrame()
      }, a)
    },
    stop: function () {
      this.timer != null && window.clearInterval(this.timer)
    },
    nextFrame: function () {
      for (var a = 0; a < this.items.length; a++) {
        var f = this.items[a],
          g = f.node,
          h = f.target,
          i = f.vx,
          j = f.vy,
          k = h.x - g.x,
          l = h.y - g.y,
          m = Math.atan2(l, k)
        if (e != 0) {
          var n = h.x - Math.cos(m) * e,
            o = h.y - Math.sin(m) * e

          i += (n - g.x) * b
          j += (o - g.y) * b
        } else {
          i += k * b
          j += l * b
        }

        i *= c
        j *= c
        j += d
        g.x += i
        g.y += j
        f.vx = i
        f.vy = j
      }
    }
  }
}
function rotate(a, b) {
  function c() {
    e = setInterval(function () {
      o ? f.stop() : (a.rotate += g || 0.2, a.rotate > 2 * Math.PI && (a.rotate = 0))
    }, 100)
    return f
  }
  function d() {
    window.clearInterval(e)
    f.onStop && f.onStop(a)
    return f
  }
  var e = (b.context, null),
    f = {},
    g = b.v

  f.run = c
  f.stop = d
  f.onStop = function (a) {
    f.onStop = a
    return f
  }
  return f
}
function aGravity(a, b) {
  function c() {
    window.clearInterval(g)
    h.onStop && h.onStop(a)
    return h
  }
  function d() {
    var d = b.dx || 0,
      i = b.dy || 2
    g = setInterval(function () {
      o ? h.stop() : (i += f, (a.y + a.height < e.stage.canvas.height ? a.setLocation(a.x + d, a.y + i) : (i = 0, c())))
    }, 20)
    return h
  }
  var e = b.context,
    f = b.gravity || 0.1,
    g = null,
    h = {}

  h.run = d
  h.stop = c
  h.onStop = function (a) {
    h.onStop = a
    return h
  }
  return h
}
function dividedTwoPiece(b, c) {
  function d(c, d, e, f, g) {
    var h = new JTopo.Node()
    h.setImage(b.image)
    h.setSize(b.width, b.height)
    h.setLocation(c, d)
    h.showSelected = !1
    h.dragable = !1
    h.paint = function (a) {
      a.save()
      a.arc(0, 0, e, f, g)
      a.clip()
      a.beginPath()
      this.image != null ? a.drawImage(this.image, -this.width / 2, -this.height / 2) : (a.fillStyle = 'rgba(' + this.style.fillStyle + ',' + this.alpha + ')', a.rect(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2), a.fill())
      a.closePath()
      a.restore()
    }
    return h
  }
  function e(c, e) {
    var f = c,
      g = c + Math.PI,
      h = d(b.x, b.y, b.width, f, g),
      j = d(b.x - 2 + 4 * Math.random(), b.y, b.width, f + Math.PI, f)

    b.visible = !1
    e.add(h)
    e.add(j)
    gravity(h, {
      context: e,
      dx: 0.3
    }).run().onStop(function () {
      e.remove(h)
      e.remove(j)
      i.stop()
    })
    gravity(j, {
      context: e,
      dx: -0.2
    }).run()
  }
  function f() {
    e(c.angle, h)
    return i
  }
  function g() {
    i.onStop && i.onStop(b)
    return i
  }
  var h = c.context,
    i = (b.style, {})

  i.onStop = function (a) {
    i.onStop = a
    return i
  }
  i.run = f
  i.stop = g

  return i
}
function repeatThrow(a, b) {
  function c(a) {
    a.visible = !0
    a.rotate = Math.random()
    var b = g.stage.canvas.width / 2
    a.x = b + Math.random() * (b - 100) - Math.random() * (b - 100)
    a.y = g.stage.canvas.height
    a.vx = 5 * Math.random() - 5 * Math.random()
    a.vy = -25
  }
  function d() {
    c(a)
    h = setInterval(function () {
      o ? void i.stop() : (a.vy += f, a.x += a.vx, a.y += a.vy, void ((a.x < 0 || a.x > g.stage.canvas.width || a.y > g.stage.canvas.height) && (i.onStop && i.onStop(a), c(a))))
    }, 50)
    return i
  }
  function e() {
    window.clearInterval(h)
  }
  var f = 0.8,
    g = b.context,
    h = null,
    i = {}

  i.onStop = function (a) {
    i.onStop = a
    return i
  }
  i.run = d
  i.stop = e

  return i
}
function stopAll() {
  o = !0
}
function startAll() {
  o = !1
}
function cycle(b, c) {
  function d() {
    n = setInterval(function () {
      if (o) {
        return void m.stop()
      }
      var a = f.y + h + Math.sin(k) * j
      b.setLocation(b.x, a)
      k += l
    }, 100)
    return m
  }
  function e() {
    window.clearInterval(n)
  }
  var f = c.p1,
    g = c.p2,
    h = (c.context, f.x + (g.x - f.x) / 2),
    i = f.y + (g.y - f.y) / 2,
    j = util.getDistance(f, g) / 2,
    k = Math.atan2(i, h),
    l = c.speed || 0.2,
    m = {},
    n = null

  m.run = d
  m.stop = e

  return m
}
function move(a, b) {
  function c() {
    h = setInterval(function () {
      if (o) {
        return void g.stop()
      }
      var b = e.x - a.x,
        c = e.y - a.y,
        h = b * f,
        i = c * f

      a.x += h
      a.y += i
      h < 0.01 && i < 0.1 && d()
    }, 100)

    return g
  }
  function d() {
    window.clearInterval(h)
  }
  var e = b.position,
    f = (b.context, b.easing || 0.2),
    g = {},
    h = null

  g.onStop = function (a) {
    g.onStop = a
    return g
  }

  g.run = c
  g.stop = d
  return g
}
function scale(a, b) {
  function c() {
    j = setInterval(function () {
      a.scaleX += f
      a.scaleY += f
      a.scaleX >= e && d()
    }, 100)
    return i
  }
  function d() {
    i.onStop && i.onStop(a)
    a.scaleX = g
    a.scaleY = h
    window.clearInterval(j)
  }
  var e = (b.position, b.context, b.scale || 1),
    f = 0.06,
    g = a.scaleX,
    h = a.scaleY,
    i = {},
    j = null

  i.onStop = function (a) {
    i.onStop = a
    return i
  }
  i.run = c
  i.stop = d
  return i
}

export const Effect = {
  spring,
  gravity
}

export const Animate = {
  stepByStep,
  rotate,
  scale,
  move,
  cycle,
  repeatThrow,
  dividedTwoPiece,
  gravity: aGravity,
  startAll,
  stopAll
}
