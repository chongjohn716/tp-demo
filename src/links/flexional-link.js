import util from '../util'
import Link from './link'
import { e } from './common'

function FlexionalLink(a, b, c) {
  this.initialize(a, b, c)
}

util.extend(FlexionalLink, Link)

FlexionalLink.prototype.initialize = function () {
  FlexionalLink.super.initialize.apply(this, arguments)
  this.direction = 'vertical'
  this.offsetGap = 44
}
FlexionalLink.prototype.getStartPosition = function () {
  const a = {
    x: this.nodeA.cx,
    y: this.nodeA.cy
  }
  this.direction === 'horizontal' ? a.x = this.nodeZ.cx < a.x ? this.nodeA.x : this.nodeA.x + this.nodeA.width : a.y = this.nodeZ.cy < a.y ? this.nodeA.y : this.nodeA.y + this.nodeA.height
  return a
}
FlexionalLink.prototype.getEndPosition = function () {
  const a = {
    x: this.nodeZ.cx,
    y: this.nodeZ.cy
  }
  this.direction === 'horizontal' ? a.x = this.nodeA.cx < a.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width : a.y = this.nodeA.cy < a.y ? this.nodeZ.y : this.nodeZ.y + this.nodeZ.height

  return a
}
FlexionalLink.prototype.getPath = function (a) {
  const b = this.getStartPosition()
  const c = this.getEndPosition()
  if (this.nodeA === this.nodeZ) {
    return [b, c]
  }
  const d = []
  const f = e(this.nodeA, this.nodeZ)
  const g = (f - 1) * this.bundleGap
  const h = this.bundleGap * a - g / 2
  let i = this.offsetGap
  this.direction === 'horizontal' ? (this.nodeA.cx > this.nodeZ.cx && (i = -i), d.push({
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
  }))

  return d
}

export default FlexionalLink
