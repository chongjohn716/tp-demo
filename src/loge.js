
function Coordinate(x, y) {
  this.x = x
  this.y = y
}

function shift(a, b, c) {
  return function (d) {
    for (let e = 0; b > e; e++) {
      a()
      c && d.turn(c)
      d.move(3)
    }
  }
}

function spin(a, b) {
  const c = 2 * Math.PI
  return function (d) {
    for (let e = 0; b > e; e++) {
      a()
      d.turn(c / b)
    }
  }
}

function scale(a, b, c) {
  return function (d) {
    for (let e = 0; b > e; e++) {
      a()
      d.resize(c)
    }
  }
}

function polygon(a) {
  const b = 2 * Math.PI
  return function (c) {
    for (let d = 0; a > d; d++) {
      c.forward(1)
      c.turn(b / a)
    }
  }
}

function star(a) {
  const b = 4 * Math.PI
  return function (c) {
    for (let d = 0; a > d; d++) {
      c.forward(1)
      c.turn(b / a)
    }
  }
}
function spiral(a, b, c, d) {
  return function (e) {
    for (let f = 0; b > f; f++) {
      a()
      e.forward(1)
      e.turn(c)
      e.resize(d)
    }
  }
}
function Tortoise(a) {
  this.p = new Coordinate(0, 0)
  this.w = new Coordinate(1, 0)
  this.paint = a
}

Tortoise.prototype.forward = function (a) {
  const b = this.p
  const c = this.w

  b.x = b.x + a * c.x
  b.y = b.y + a * c.y
  this.paint && this.paint(b.x, b.y)

  return this
}

Tortoise.prototype.move = function (a) {
  const b = this.p
  const c = this.w

  b.x = b.x + a * c.x
  b.y = b.y + a * c.y
  return this
}

Tortoise.prototype.moveTo = function (a, b) {
  this.p.x = a
  this.p.y = b

  return this
}

Tortoise.prototype.turn = function (a) {
  const b = (this.p, this.w)
  const c = Math.cos(a) * b.x - Math.sin(a) * b.y
  const d = Math.sin(a) * b.x + Math.cos(a) * b.y

  b.x = c
  b.y = d

  return this
}

Tortoise.prototype.resize = function (a) {
  const b = this.w

  b.x = b.x * a
  b.y = b.y * a

  return this
}

Tortoise.prototype.save = function () {
  this._stack == null && (this._stack = [])
  this._stack.push([this.p, this.w])

  return this
}
Tortoise.prototype.restore = function () {
  if (this._stack != null && this._stack.length > 0) {
    const a = this._stack.pop()
    this.p = a[0]
    this.w = a[1]
  }
  return this
}

export default {
  Tortoise,
  shift,
  spin,
  polygon,
  spiral,
  star,
  scale
}
