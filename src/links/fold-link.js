import util from '../util'
import Link from './link'
import { e } from './common'

function FoldLink(a, b, c) {
  this.initialize(a, b, c)
}

util.extend(FoldLink, Link)

FoldLink.prototype.initialize = function () {
  FoldLink.super.initialize.apply(this, arguments)
  this.direction = 'horizontal'
}
FoldLink.prototype.getStartPosition = function () {
  const a = {
    x: this.nodeA.cx,
    y: this.nodeA.cy
  }
  this.direction === 'horizontal' ? this.nodeZ.cx > a.x ? a.x += this.nodeA.width / 2 : a.x -= this.nodeA.width / 2 : this.nodeZ.cy > a.y ? a.y += this.nodeA.height / 2 : a.y -= this.nodeA.height / 2
  return a
}
FoldLink.prototype.getEndPosition = function () {
  const a = {
    x: this.nodeZ.cx,
    y: this.nodeZ.cy
  }
  this.direction === 'horizontal' ? this.nodeA.cy < a.y ? a.y -= this.nodeZ.height / 2 : a.y += this.nodeZ.height / 2 : a.x = this.nodeA.cx < a.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width
  return a
}
FoldLink.prototype.getPath = function (a) {
  const b = []
  const c = this.getStartPosition()
  const d = this.getEndPosition()
  if (this.nodeA === this.nodeZ) { return [c, d] }
  let f
  let g
  const h = e(this.nodeA, this.nodeZ)
  const i = (h - 1) * this.bundleGap
  const j = this.bundleGap * a - i / 2
  this.direction === 'horizontal' ? (f = d.x + j, g = c.y - j, b.push({
    x: c.x,
    y: g
  }), b.push({
    x: f,
    y: g
  }), b.push({
    x: f,
    y: d.y
  })) : (f = c.x + j, g = d.y - j, b.push({
    x: f,
    y: c.y
  }), b.push({
    x: f,
    y: g
  }), b.push({
    x: d.x,
    y: g
  }))
  return b
}
FoldLink.prototype.paintText = function (a, b) {
  if (this.text && this.text.length > 0) {
    const c = b[1]
    const d = c.x + this.textOffsetX
    const e = c.y + this.textOffsetY
    a.save()
    a.beginPath()
    a.font = this.fon
    const f = a.measureText(this.text).width
    const g = a.measureText('田').width
    a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')'
    a.fillText(this.text, d - f / 2, e - g / 2)
    a.stroke()
    a.closePath()
    a.restore()
  }
}

export default FoldLink
