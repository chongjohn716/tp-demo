import Link from './link'
import { extend } from '../common'

function CurveLink(a, b, c) {
  this.initialize(a, b, c)
}

extend(CurveLink, Link)

CurveLink.prototype.initialize = function () {
  CurveLink.super.initialize.apply(this, arguments)
}
CurveLink.prototype.paintPath = function (a, b) {
  if (this.nodeA === this.nodeZ) {
    return void this.paintLoop(a)
  }
  a.beginPath()
  a.moveTo(b[0].x, b[0].y)
  for (var c = 1; c < b.length; c++) {
    var d = b[c - 1],
      e = b[c],
      f = (d.x + e.x) / 2,
      g = (d.y + e.y) / 2

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
    var h = b[b.length - 2],
      i = b[b.length - 1]

    this.paintArrow(a, h, i)
  }
}

export default CurveLink
