import Link from './link'
import { extend } from '../common'
import { e } from './common'

function FlexionalLink(a, b, c) {
  this.initialize(a, b, c)
}

extend(FlexionalLink, Link)

FlexionalLink.prototype.initialize = function () {
  FlexionalLink.super.initialize.apply(this, arguments),
  this.direction = 'vertical',
  this.offsetGap = 44
}
FlexionalLink.prototype.getStartPosition = function () {
  var a = {
    x: this.nodeA.cx,
    y: this.nodeA.cy
  }
  return this.direction == 'horizontal' ? a.x = this.nodeZ.cx < a.x ? this.nodeA.x : this.nodeA.x + this.nodeA.width : a.y = this.nodeZ.cy < a.y ? this.nodeA.y : this.nodeA.y + this.nodeA.height,
  a
}
FlexionalLink.prototype.getEndPosition = function () {
  var a = {
    x: this.nodeZ.cx,
    y: this.nodeZ.cy
  }
  return this.direction == 'horizontal' ? a.x = this.nodeA.cx < a.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width : a.y = this.nodeA.cy < a.y ? this.nodeZ.y : this.nodeZ.y + this.nodeZ.height,
  a
}
FlexionalLink.prototype.getPath = function (a) {
  var b = this.getStartPosition(),
    c = this.getEndPosition()
  if (this.nodeA === this.nodeZ) { return [b, c] }
  var d = [],
    f = e(this.nodeA, this.nodeZ),
    g = (f - 1) * this.bundleGap,
    h = this.bundleGap * a - g / 2,
    i = this.offsetGap
  return this.direction == 'horizontal' ? (this.nodeA.cx > this.nodeZ.cx && (i = -i), d.push({
    x: b.x,
    y: b.y + h
  }), d.push({
    x: b.x + i,
    y: b.y + h
  }), d.push({
    x: c.x - i,
    y: c.y + h
  }), d.push({
    x: c.x,
    y: c.y + h
  })) : (this.nodeA.cy > this.nodeZ.cy && (i = -i), d.push({
    x: b.x + h,
    y: b.y
  }), d.push({
    x: b.x + h,
    y: b.y + i
  }), d.push({
    x: c.x + h,
    y: c.y - i
  }), d.push({
    x: c.x + h,
    y: c.y
  })),
  d
}
export default FlexionalLink
