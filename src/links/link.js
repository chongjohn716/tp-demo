
import util from '../util'
import InteractiveElement from '../elements/interactive-element'
import { extend } from '../common'
import { e, d, h } from './common'
import { defaultZIndex, minus270 } from '../const'

function Link(b, c, g) {
  this.initialize(b, c, g)
}

extend(Link, InteractiveElement)

Link.prototype.initialize = function (nodeA, nodeZ, text) {
  if (arguments.length < 2) {
    throw new Error('')
  }
  Link.super.initialize.apply(this, arguments)
  this.elementType = 'link'
  this.zIndex = defaultZIndex.link

  this.text = text
  this.nodeA = nodeA
  this.nodeZ = nodeZ
  this.nodeA && this.nodeA.outLinks == null && (this.nodeA.outLinks = [])
  this.nodeA && this.nodeA.inLinks == null && (this.nodeA.inLinks = [])
  this.nodeZ && this.nodeZ.inLinks == null && (this.nodeZ.inLinks = [])
  this.nodeZ && this.nodeZ.outLinks == null && (this.nodeZ.outLinks = [])
  this.nodeA != null && this.nodeA.outLinks.push(this)
  this.nodeZ != null && this.nodeZ.inLinks.push(this)
  this.caculateIndex()
  this.font = '12px Consolas'
  this.fontColor = '255,255,255'
  this.lineWidth = 2
  this.lineJoin = 'miter'
  this.transformAble = !1
  this.bundleOffset = 20
  this.bundleGap = 12
  this.textOffsetX = 0
  this.textOffsetY = 0
  this.arrowsRadius = null
  this.arrowsOffset = 0
  this.dashedPattern = null
  this.path = []
  var e = 'text,font,fontColor,lineWidth,lineJoin'.split(',')
  this.serializedProperties = this.serializedProperties.concat(e)
}
Link.prototype.caculateIndex = function () {
  var a = e(this.nodeA, this.nodeZ)
  a > 0 && (this.nodeIndex = a - 1)
}
Link.prototype.removeHandler = function () {
  var a = this
  this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function (b) {
    return b !== a
  }))
  this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function (b) {
    return b !== a
  }))
  var b = d(this)
  b.forEach(function (a, b) {
    a.nodeIndex = b
  })
}
Link.prototype.getStartPosition = function () {
  var a = {
    x: this.nodeA.cx,
    y: this.nodeA.cy
  }
  return a
}
Link.prototype.getEndPosition = function () {
  var a
  this.arrowsRadius != null && (a = h(this.nodeZ, this.nodeA))
  a == null && (a = {
    x: this.nodeZ.cx,
    y: this.nodeZ.cy
  })
  return a
}
Link.prototype.getPath = function () {
  var a = [],
    b = this.getStartPosition(),
    c = this.getEndPosition()
  if (this.nodeA === this.nodeZ) { return [b, c] }
  var d = e(this.nodeA, this.nodeZ)
  if (d == 1) { return [b, c] }
  var f = Math.atan2(c.y - b.y, c.x - b.x),
    g = {
      x: b.x + this.bundleOffset * Math.cos(f),
      y: b.y + this.bundleOffset * Math.sin(f)
    },
    h = {
      x: c.x + this.bundleOffset * Math.cos(f - Math.PI),
      y: c.y + this.bundleOffset * Math.sin(f - Math.PI)
    },
    i = f - Math.PI / 2,
    j = f - Math.PI / 2,
    k = d * this.bundleGap / 2 - this.bundleGap / 2,
    l = this.bundleGap * this.nodeIndex,
    m = {
      x: g.x + l * Math.cos(i),
      y: g.y + l * Math.sin(i)
    },
    n = {
      x: h.x + l * Math.cos(j),
      y: h.y + l * Math.sin(j)
    }

  m = {
    x: m.x + k * Math.cos(i - Math.PI),
    y: m.y + k * Math.sin(i - Math.PI)
  }
  n = {
    x: n.x + k * Math.cos(j - Math.PI),
    y: n.y + k * Math.sin(j - Math.PI)
  }
  a.push({
    x: b.x,
    y: b.y
  })
  a.push({
    x: m.x,
    y: m.y
  })
  a.push({
    x: n.x,
    y: n.y
  })
  a.push({
    x: c.x,
    y: c.y
  })

  return a
}
Link.prototype.paintPath = function (a, b) {
  if (this.nodeA === this.nodeZ) {
    return void this.paintLoop(a)
  }
  a.beginPath()
  a.moveTo(b[0].x, b[0].y)
  for (var c = 1; c < b.length; c++) {
    this.dashedPattern == null ? a.lineTo(b[c].x, b[c].y) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern)
  }
  a.stroke()
  a.closePath()
  if (this.arrowsRadius != null) {
    var d = b[b.length - 2],
      e = b[b.length - 1]

    this.paintArrow(a, d, e)
  }
}
Link.prototype.paintLoop = function (a) {
  a.beginPath()

  var b = this.bundleGap * (this.nodeIndex + 1) / 2
  Math.PI + Math.PI / 2
  a.arc(this.nodeA.x, this.nodeA.y, b, Math.PI / 2, 2 * Math.PI)
  a.stroke()
  a.closePath()
}
Link.prototype.paintArrow = function (b, c, d, flag) {
  var e = this.arrowsOffset,
    f = this.arrowsRadius / 2,
    g = c,
    h = d,
    i = Math.atan2(h.y - g.y, h.x - g.x),
    j = util.getDistance(g, h) - this.arrowsRadius,
    k = g.x + (j + e) * Math.cos(i),
    l = g.y + (j + e) * Math.sin(i),
    m = h.x + e * Math.cos(i),
    n = h.y + e * Math.sin(i)

  i -= Math.PI / 2

  var o = {
      x: k + f * Math.cos(i),
      y: l + f * Math.sin(i)
    },
    p = {
      x: k + f * Math.cos(i - Math.PI),
      y: l + f * Math.sin(i - Math.PI)
    }

  b.beginPath()
  b.fillStyle = 'rgba(' + this.strokeColor + ',' + this.alpha + ')'
  b.moveTo(o.x, o.y)
  b.lineTo(m, n)
  b.lineTo(p.x, p.y)
  b.stroke()
  b.closePath()

  if (flag) {
    return
  }

  this.bothArrow && this.paintArrow(b, d, c, true)
}

Link.prototype.paint = function (a) {
  if (this.nodeA != null && !this.nodeZ != null) {
    var b = this.getPath(this.nodeIndex)
    this.path = b
    a.strokeStyle = 'rgba(' + this.strokeColor + ',' + this.alpha + ')'
    a.lineWidth = this.lineWidth
    this.paintPath(a, b)
    b && b.length > 0 && this.paintText(a, b)
  }
}

Link.prototype.paintText = function (a, b) {
  var c = b[0],
    d = b[b.length - 1]

  b.length == 4 && (c = b[1], d = b[2])

  if (this.text && this.text.length > 0) {
    var e = (d.x + c.x) / 2 + this.textOffsetX,
      f = (d.y + c.y) / 2 + this.textOffsetY

    a.save()
    a.beginPath()
    a.font = this.font

    var g = a.measureText(this.text).width,
      h = a.measureText('田').width

    a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')'

    if (this.nodeA === this.nodeZ) {
      var j = this.bundleGap * (this.nodeIndex + 1) / 2

      e = this.nodeA.x + j * Math.cos(minus270)
      f = this.nodeA.y + j * Math.sin(minus270)
      a.fillText(this.text, e, f)
    } else {
      a.fillText(this.text, e - g / 2, f - h / 2)
    }

    a.stroke()
    a.closePath()
    a.restore()
  }
}

Link.prototype.paintSelected = function (a) {
  a.shadowBlur = 10
  a.shadowColor = 'rgba(0,0,0,1)'
  a.shadowOffsetX = 0
  a.shadowOffsetY = 0
}

Link.prototype.isInBound = function (b, c) {
  if (this.nodeA === this.nodeZ) {
    var d = this.bundleGap * (this.nodeIndex + 1) / 2,
      e = util.getDistance(this.nodeA, {
        x: b,
        y: c
      }) - d
    return Math.abs(e) <= 3
  }

  for (var f = !1, g = 1; g < this.path.length; g++) {
    var h = this.path[g - 1],
      i = this.path[g]
    if (util.isPointInLine({
      x: b,
      y: c
    }, h, i) == 1) {
      f = !0
      break
    }
  }
  return f
}

export default Link
