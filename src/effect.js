import Node from './nodes/node'
import util from './util'
import MessageBus from './message-bus'

let o = false

function B(b, c) {
  let d
  let e = null
  return {
    stop: function () {
      return d ? (window.clearInterval(d), e && e.publish('stop'), this) : this
    },
    start: function () {
      const a = this
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
  const d = c.gravity || 0.1
  const e = c.dx || 0
  let f = c.dy || 5
  const g = c.stop
  const h = c.interval || 30
  const i = new B(function () {
    g && g() ? (f = 0.5, this.stop()) : (f += d, a.setLocation(a.x + e, a.y + f))
  }, h)
  return i
}

function stepByStep(a, c, d, e, f) {
  const g = 1e3 / 24
  const h = {}
  for (const i in c) {
    const j = c[i]
    const k = j - a[i]
    h[i] = {
      oldValue: a[i],
      targetValue: j,
      step: k / d * g,
      isDone: function (b) {
        const c = this.step > 0 && a[b] >= this.targetValue || this.step < 0 && a[b] <= this.targetValue
        return c
      }
    }
  }
  const l = new B(function () {
    let b = true
    for (const d in c) { h[d].isDone(d) || (a[d] += h[d].step, b = false) }
    if (b) {
      if (!e) {
        return this.stop()
      }
      for (const d in c) {
        if (f) {
          const g = h[d].targetValue
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
  const b = a.spring || 0.1
  const c = a.friction || 0.8
  const d = a.grivity || 0
  const e = a.minLength || 0
  return {
    items: [],
    timer: null,
    isPause: false,
    addNode: function (a, b) {
      const c = {
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
      const b = this
      this.timer = setInterval(function () {
        b.nextFrame()
      }, a)
    },
    stop: function () {
      this.timer != null && window.clearInterval(this.timer)
    },
    nextFrame: function () {
      for (let a = 0; a < this.items.length; a++) {
        const f = this.items[a]
        const g = f.node
        const h = f.target
        let i = f.vx
        let j = f.vy
        const k = h.x - g.x
        const l = h.y - g.y
        const m = Math.atan2(l, k)
        if (e !== 0) {
          const n = h.x - Math.cos(m) * e
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
      if (o) {
        f.stop()
        return
      }
      a.rotate += g || 0.2
      a.rotate > 2 * Math.PI && (a.rotate = 0)
    }, 100)
    return f
  }
  function d() {
    window.clearInterval(e)
    f.onStop && f.onStop(a)
    return f
  }
  let e = (b.context, null)
  const f = {}
  const g = b.v
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
    const d = b.dx || 0
    let i = b.dy || 2
    g = setInterval(function () {
      if (o) {
        h.stop()
        return
      }
      i += f
      a.y + a.height < e.stage.canvas.height ? a.setLocation(a.x + d, a.y + i) : (i = 0, c())
    }, 20)
    return h
  }
  const e = b.context
  const f = b.gravity || 0.1
  let g = null
  const h = {}
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
    const h = new Node()
    h.setImage(b.image)
    h.setSize(b.width, b.height)
    h.setLocation(c, d)
    h.showSelected = false
    h.dragable = false
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
    const f = c
    const g = c + Math.PI
    const h = d(b.x, b.y, b.width, f, g)
    const j = d(b.x - 2 + 4 * Math.random(), b.y, b.width, f + Math.PI, f)
    b.visible = false
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
  const h = c.context
  const i = (b.style, {})
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
    a.visible = true
    a.rotate = Math.random()
    const b = g.stage.canvas.width / 2
    a.x = b + Math.random() * (b - 100) - Math.random() * (b - 100)
    a.y = g.stage.canvas.height
    a.vx = 5 * Math.random() - 5 * Math.random()
    a.vy = -25
  }
  function d() {
    c(a)
    h = setInterval(function () {
      if (o) {
        i.stop()
        return
      }
      a.vy += f
      a.x += a.vx
      a.y += a.vy

      return (a.x < 0 || a.x > g.stage.canvas.width || a.y > g.stage.canvas.height) && (i.onStop && i.onStop(a), c(a))
    }, 50)
    return i
  }
  function e() {
    window.clearInterval(h)
  }
  const f = 0.8
  const g = b.context
  let h = null
  const i = {}
  i.onStop = function (a) {
    i.onStop = a
    return i
  }
  i.run = d
  i.stop = e
  return i
}

function stopAll() {
  o = true
}

function startAll() {
  o = false
}

function cycle(b, c) {
  function d() {
    n = setInterval(function () {
      if (o) {
        return void m.stop()
      }
      const a = f.y + h + Math.sin(k) * j
      b.setLocation(b.x, a)
      k += l
    }, 100)
    return m
  }
  function e() {
    window.clearInterval(n)
  }
  const f = c.p1
  const g = c.p2
  const h = (c.context, f.x + (g.x - f.x) / 2)
  const i = f.y + (g.y - f.y) / 2
  const j = util.getDistance(f, g) / 2
  let k = Math.atan2(i, h)
  const l = c.speed || 0.2
  const m = {}
  let n = null
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
      const b = e.x - a.x
      const c = e.y - a.y
      const h = b * f
      const i = c * f
      a.x += h
      a.y += i
      h < 0.01 && i < 0.1 && d()
    }, 100)
    return g
  }

  function d() {
    window.clearInterval(h)
  }

  const e = b.position
  const f = (b.context, b.easing || 0.2)
  const g = {}
  let h = null

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
  const e = (b.position, b.context, b.scale || 1)
  const f = 0.06
  const g = a.scaleX
  const h = a.scaleY
  const i = {}
  let j = null
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
