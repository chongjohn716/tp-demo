// import Link from './links/link'
// import Node from './nodes/node'
// import Stage from './stage'
// import Scene from './scene'
import { del } from './extend-native'

const canvas = document.createElement('canvas')
const graphics = canvas.getContext('2d')
const alarmImageCache = {}

function getDistance(a, b, c, d) {
  let e,
    f
  c == null && d == null ? (e = b.x - a.x, f = b.y - a.y) : (e = c - a, f = d - b)

  return Math.sqrt(e * e + f * f)
}

function getElementsBound(a) {
  const b = {
    left: Number.MAX_VALUE,
    right: Number.MIN_VALUE,
    top: Number.MAX_VALUE,
    bottom: Number.MIN_VALUE
  }
  for (let c = 0; c < a.length; c++) {
    const d = a[c]
    d instanceof JTopo.Link || (b.left > d.x && (b.left = d.x, b.leftNode = d), b.right < d.x + d.width && (b.right = d.x + d.width, b.rightNode = d), b.top > d.y && (b.top = d.y, b.topNode = d), b.bottom < d.y + d.height && (b.bottom = d.y + d.height, b.bottomNode = d))
  }

  b.width = b.right - b.left
  b.height = b.bottom - b.top
  return b
}

function mouseCoords(a) {
  a = cloneEvent(a)
  a.pageX || (a.pageX = a.clientX + document.body.scrollLeft - document.body.clientLeft, a.pageY = a.clientY + document.body.scrollTop - document.body.clientTop)
  return a
}

function getEventPosition(a) {
  return mouseCoords(a)
}

function rotatePoint(a, b, c, d, e) {
  const f = c - a
  const g = d - b
  const h = Math.sqrt(f * f + g * g)
  const i = Math.atan2(g, f) + e

  return {
    x: a + Math.cos(i) * h,
    y: b + Math.sin(i) * h
  }
}

function rotatePoints(a, b, c) {
  const d = []
  for (let e = 0; e < b.length; e++) {
    const f = rotatePoint(a.x, a.y, b[e].x, b[e].y, c)
    d.push(f)
  }
  return d
}

function cloneEvent(a) {
  const b = {}
  for (const c in a) { c !== 'returnValue' && c !== 'keyLocation' && (b[c] = a[c]) }
  return b
}

function clone(a) {
  const b = {}
  for (const c in a) { b[c] = a[c] }
  return b
}

function isPointInRect(a, b) {
  const c = b.x
  const d = b.y
  const e = b.width
  const f = b.height
  return a.x > c && a.x < c + e && a.y > d && a.y < d + f
}

function isPointInLine(a, b, c) {
  const d = getDistance(b, c)
  const e = getDistance(b, a)
  const f = getDistance(c, a)

  return Math.abs(e + f - d) <= 0.5
}

function removeFromArray(a, b) {
  for (let c = 0; c < a.length; c++) {
    const d = a[c]
    if (d === b) {
      a = del.call(a, c)
      break
    }
  }
  return a
}

function randomColor() {
  return Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random())
}
function isIntsect() { }
function getProperties(a, b) {
  let c = ''
  for (let d = 0; d < b.length; d++) {
    d > 0 && (c += ',')
    let e = a[b[d]]
    typeof e === 'string' ? e = '"' + e + '"' : void 0 === e && (e = null)
    c += b[d] + ':' + e
  }
  return c
}

function toJson(a) {
  const b = 'backgroundColor,visible,mode,rotate,alpha,scaleX,scaleY,shadow,translateX,translateY,areaSelect,paintAll'.split(',')
  const c = 'text,elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,fillColor,shadow,transformAble,zIndex,dragable,selected,showSelected,font,fontColor,textPosition,textOffsetX,textOffsetY'.split(',')
  let d = '{'
  d += 'frames:' + a.frames
  d += ', scenes:['
  for (let e = 0; e < a.childs.length; e++) {
    const f = a.childs[e]
    d += '{'
    d += getProperties(f, b)
    d += ', elements:['
    for (let g = 0; g < f.childs.length; g++) {
      const h = f.childs[g]
      g > 0 && (d += ',')
      d += '{'
      d += getProperties(h, c)
      d += '}'
    }
    d += ']}'
  }

  d += ']'
  d += '}'

  return d
}

function changeColor(a, b, c) {
  const d = c.split(',')
  const e = parseInt(d[0])
  const f = parseInt(d[1])
  const g = parseInt(d[2])
  const h = canvas.width = b.width
  const i = canvas.height = b.height
  a.clearRect(0, 0, canvas.width, canvas.height)
  a.drawImage(b, 0, 0)
  const j = a.getImageData(0, 0, b.width, b.height)
  for (let k = j.data, l = 0; h > l; l++) {
    for (let m = 0; i > m; m++) {
      const n = 4 * (l + m * h)
      k[n + 3] !== 0 && (e != null && (k[n + 0] += e), f != null && (k[n + 1] += f), g != null && (k[n + 2] += g))
    }
  }
  a.putImageData(j, 0, 0, 0, 0, b.width, b.height)
  const o = canvas.toDataURL()
  return o
}

const Image = window.Image

function genImageAlarm(a, b) {
  const c = a.src + b
  if (alarmImageCache[c]) { return alarmImageCache[c] }
  const d = new Image()
  d.src = changeColor(graphics, a, b)
  alarmImageCache[c] = d
  return d
}

function getOffsetPosition(a) {
  if (!a) {
    return {
      left: 0,
      top: 0
    }
  }
  let b = 0
  let c = 0
  if ('getBoundingClientRect' in document.documentElement) {
    const d = a.getBoundingClientRect()
    const e = a.ownerDocument
    const f = e.body
    const g = e.documentElement
    const h = g.clientTop || f.clientTop || 0
    const i = g.clientLeft || f.clientLeft || 0
    b = d.top + (window.pageYOffset || g && g.scrollTop || f.scrollTop) - h
    c = d.left + (window.pageXOffset || g && g.scrollLeft || f.scrollLeft) - i
  } else {
    do {
      b += a.offsetTop || 0
      c += a.offsetLeft || 0
      a = a.offsetParent
    } while (a)
  }

  return {
    left: c,
    top: b
  }
}

function lineF(a, b, c, d) {
  function e(a) {
    return a * f + g
  }
  const f = (d - b) / (c - a)
  const g = b - a * f
  e.k = f
  e.b = g
  e.x1 = a
  e.x2 = c
  e.y1 = b
  e.y2 = d
  return e
}

function inRange(a, b, c) {
  const d = Math.abs(b - c)
  const e = Math.abs(b - a)
  const f = Math.abs(c - a)
  const g = Math.abs(d - (e + f))
  return g < 1e-6
}

function isPointInLineSeg(a, b, c) {
  return inRange(a, c.x1, c.x2) && inRange(b, c.y1, c.y2)
}

function intersection(a, b) {
  let c, d

  if (a.k === b.k) {
    return null
  }
  1 / 0 === a.k || a.k === -1 / 0
    ? (c = a.x1, d = b(a.x1))
    : 1 / 0 === b.k || b.k === -1 / 0
      ? (c = b.x1, d = a(b.x1))
      : (c = (b.b - a.b) / (a.k - b.k), d = a(c))

  return isPointInLineSeg(c, d, a) === 0 ? null : isPointInLineSeg(c, d, b) === 0 ? null : {
    x: c,
    y: d
  }
}

function intersectionLineBound(a, b) {
  let c = lineF(b.left, b.top, b.left, b.bottom)
  let d = intersection(a, c)
  d == null && (c = lineF(b.left, b.top, b.right, b.top), d = intersection(a, c), d == null && (c = lineF(b.right, b.top, b.right, b.bottom), d = intersection(a, c), d == null && (c = lineF(b.left, b.bottom, b.right, b.bottom), d = intersection(a, c))))
  return d
}

export const extend = function extend(SubClass, SuperClass) {
  // let F = function () { }
  // F.prototype = superClass.prototype
  SubClass.prototype = new SuperClass()
  SubClass.prototype.constructor = SubClass

  // 防止超类改变原型
  SubClass.super = SuperClass.prototype
}

const util = {
  aa: '12',
  rotatePoint: rotatePoint,
  rotatePoints: rotatePoints,
  getDistance: getDistance,
  getEventPosition: getEventPosition,
  mouseCoords: mouseCoords,
  isFirefox: navigator.userAgent.indexOf('Firefox') > 0,
  isIE: !(!window.attachEvent || navigator.userAgent.indexOf('Opera') !== -1),
  isChrome: navigator.userAgent.toLowerCase().match(/chrome/) != null,
  clone: clone,
  isPointInRect: isPointInRect,
  isPointInLine: isPointInLine,
  removeFromArray: removeFromArray,
  cloneEvent: cloneEvent,
  randomColor: randomColor,
  isIntsect: isIntsect,
  toJson: toJson,
  getElementsBound: getElementsBound,
  genImageAlarm: genImageAlarm,
  getOffsetPosition: getOffsetPosition,
  lineF: lineF,
  intersection: intersection,
  intersectionLineBound: intersectionLineBound,
  extend: extend
}

export default util
