import util from '../util'

import Link from './link'

function CurveLink(a, b, c) {
  this.initialize(a, b, c)
}

util.extend(CurveLink, Link)

CurveLink.prototype.initialize = function () {
  CurveLink.super.initialize.apply(this, arguments)
}
CurveLink.prototype.paintPath = function (a, b) {
  if (this.nodeA === this.nodeZ) {
    return void this.paintLoop(a)
  }
  a.beginPath()
  a.moveTo(b[0].x, b[0].y)
  for (let c = 1; c < b.length; c++) {
    const d = b[c - 1]
    const e = b[c]
    const f = (d.x + e.x) / 2
    let g = (d.y + e.y) / 2
    g += (e.y - d.y) / 2
    a.strokeStyle = 'rgba(' + this.strokeColor + ',' + this.alpha + ')'
    a.lineWidth = this.lineWidth
    a.moveTo(d.x, d.cy)
    a.quadraticCurveTo(f, g, e.x, e.y)
    a.stroke()
  }
  a.stroke()
  a.closePath()
  if (this.arrowsRadius != null) {
    const h = b[b.length - 2]
    const i = b[b.length - 1]
    this.paintArrow(a, h, i)
  }
}

export default CurveLink
