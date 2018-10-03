
function Coordinate(x, y) {
  this.x = x
  this.y = y
}

function c(a) {
  this.p = new Coordinate(0, 0),
  this.w = new Coordinate(1, 0),
  this.paint = a
}
function d(a, b, c) {
  return function (d) {
    for (var e = 0; b > e; e++) { a(), c && d.turn(c), d.move(3) }
  }
}
function e(a, b) {
  var c = 2 * Math.PI
  return function (d) {
    for (var e = 0; b > e; e++) { a(), d.turn(c / b) }
  }
}
function f(a, b, c) {
  return function (d) {
    for (var e = 0; b > e; e++) { a(), d.resize(c) }
  }
}
function g(a) {
  var b = 2 * Math.PI
  return function (c) {
    for (var d = 0; a > d; d++) { c.forward(1), c.turn(b / a) }
  }
}
function h(a) {
  var b = 4 * Math.PI
  return function (c) {
    for (var d = 0; a > d; d++) { c.forward(1), c.turn(b / a) }
  }
}
function i(a, b, c, d) {
  return function (e) {
    for (var f = 0; b > f; f++) { a(), e.forward(1), e.turn(c), e.resize(d) }
  }
}
c.prototype.forward = function (a) {
  var b = this.p,
    c = this.w
  return b.x = b.x + a * c.x,
  b.y = b.y + a * c.y,
  this.paint && this.paint(b.x, b.y),
  this
}
c.prototype.move = function (a) {
  var b = this.p,
    c = this.w
  return b.x = b.x + a * c.x,
  b.y = b.y + a * c.y,
  this
}
c.prototype.moveTo = function (a, b) {
  return this.p.x = a,
  this.p.y = b,
  this
}
c.prototype.turn = function (a) {
  var b = (this.p, this.w),
    c = Math.cos(a) * b.x - Math.sin(a) * b.y,
    d = Math.sin(a) * b.x + Math.cos(a) * b.y
  return b.x = c,
  b.y = d,
  this
}
c.prototype.resize = function (a) {
  var b = this.w
  return b.x = b.x * a,
  b.y = b.y * a,
  this
}
c.prototype.save = function () {
  return this._stack == null && (this._stack = []),
  this._stack.push([this.p, this.w]),
  this
}
c.prototype.restore = function () {
  if (this._stack != null && this._stack.length > 0) {
    var a = this._stack.pop()
    this.p = a[0],
    this.w = a[1]
  }
  return this
}

export default {
  Tortoise: c,
  shift: d,
  spin: e,
  polygon: g,
  spiral: i,
  star: h,
  scale: f
}
