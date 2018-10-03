import { del } from './extend-native'

const canvas = document.createElement('canvas')
const graphics = canvas.getContext('2d')
const alarmImageCache = {}

function getDistance(a, b, c, d) {
  var e,
    f
  return c == null && d == null ? (e = b.x - a.x, f = b.y - a.y) : (e = c - a, f = d - b),
  Math.sqrt(e * e + f * f)
}
function getElementsBound(a) {
  for (var b = {
      left: Number.MAX_VALUE,
      right: Number.MIN_VALUE,
      top: Number.MAX_VALUE,
      bottom: Number.MIN_VALUE
    }, c = 0; c < a.length; c++) {
    var d = a[c]
    d instanceof JTopo.Link || (b.left > d.x && (b.left = d.x, b.leftNode = d), b.right < d.x + d.width && (b.right = d.x + d.width, b.rightNode = d), b.top > d.y && (b.top = d.y, b.topNode = d), b.bottom < d.y + d.height && (b.bottom = d.y + d.height, b.bottomNode = d))
  }
  return b.width = b.right - b.left,
  b.height = b.bottom - b.top,
  b
}
function mouseCoords(a) {
  return a = cloneEvent(a),
  a.pageX || (a.pageX = a.clientX + document.body.scrollLeft - document.body.clientLeft, a.pageY = a.clientY + document.body.scrollTop - document.body.clientTop),
  a
}
function getEventPosition(a) {
  return a = mouseCoords(a)
}
function rotatePoint(a, b, c, d, e) {
  var f = c - a,
    g = d - b,
    h = Math.sqrt(f * f + g * g),
    i = Math.atan2(g, f) + e
  return {
    x: a + Math.cos(i) * h,
    y: b + Math.sin(i) * h
  }
}
function rotatePoints(a, b, c) {
  for (var d = [], e = 0; e < b.length; e++) {
    var f = rotatePoint(a.x, a.y, b[e].x, b[e].y, c)
    d.push(f)
  }
  return d
}
function cloneEvent(a) {
  var b = {}
  for (var c in a) { c != 'returnValue' && c != 'keyLocation' && (b[c] = a[c]) }
  return b
}
function clone(a) {
  var b = {}
  for (var c in a) { b[c] = a[c] }
  return b
}
function isPointInRect(a, b) {
  var c = b.x,
    d = b.y,
    e = b.width,
    f = b.height
  return a.x > c && a.x < c + e && a.y > d && a.y < d + f
}
function isPointInLine(a, b, c) {
  var d = getDistance(b, c),
    e = getDistance(b, a),
    f = getDistance(c, a),
    g = Math.abs(e + f - d) <= 0.5
  return g
}
function removeFromArray(a, b) {
  for (var c = 0; c < a.length; c++) {
    var d = a[c]
    if (d === b) {
      a = a.del(c)
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
  for (var c = '', d = 0; d < b.length; d++) {
    d > 0 && (c += ',')
    var e = a[b[d]]
    typeof e == 'string' ? e = '"' + e + '"' : void 0 == e && (e = null),
    c += b[d] + ':' + e
  }
  return c
}
function loadStageFromJson(stageObj, canvas) {
  var stage = new JTopo.Stage(canvas)
  for (var k in stageObj) {
    if (k != 'scenes') { stage[k] = obj[k] } else {
      for (var scenes = obj.scenes, i = 0; i < scenes.length; i++) {
        var sceneObj = scenes[i],
          scene = new JTopo.Scene(stage)
        for (var p in sceneObj) {
          if (p != 'elements') { scene[p] = sceneObj[p] } else {
            for (var nodeMap = {}, elements = sceneObj.elements, m = 0; m < elements.length; m++) {
              var elementObj = elements[m],
                type = elementObj.elementType,
                element
              type == 'Node' && (element = new JTopo.Node())
              for (var mk in elementObj) { element[mk] = elementObj[mk] }
              nodeMap[element.text] = element,
              scene.add(element)
            }
          }
        }
      }
    }
  }
  return console.log(stage),
  stage
}
function toJson(a) {
  var b = 'backgroundColor,visible,mode,rotate,alpha,scaleX,scaleY,shadow,translateX,translateY,areaSelect,paintAll'.split(','),
    c = 'text,elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,fillColor,shadow,transformAble,zIndex,dragable,selected,showSelected,font,fontColor,textPosition,textOffsetX,textOffsetY'.split(','),
    d = '{'
  d += 'frames:' + a.frames,
  d += ', scenes:['
  for (var e = 0; e < a.childs.length; e++) {
    var f = a.childs[e]
    d += '{',
    d += getProperties(f, b),
    d += ', elements:['
    for (var g = 0; g < f.childs.length; g++) {
      var h = f.childs[g]
      g > 0 && (d += ','),
      d += '{',
      d += getProperties(h, c),
      d += '}'
    }
    d += ']}'
  }
  return d += ']',
  d += '}'
}
function changeColor(a, b, c) {
  var d = c.split(','),
    e = parseInt(d[0]),
    f = parseInt(d[1]),
    g = parseInt(d[2]),
    h = canvas.width = b.width,
    i = canvas.height = b.height
  a.clearRect(0, 0, canvas.width, canvas.height),
  a.drawImage(b, 0, 0)
  for (var j = a.getImageData(0, 0, b.width, b.height), k = j.data, l = 0; h > l; l++) {
    for (var m = 0; i > m; m++) {
      var n = 4 * (l + m * h)
      k[n + 3] != 0 && (e != null && (k[n + 0] += e), f != null && (k[n + 1] += f), g != null && (k[n + 2] += g))
    }
  }
  a.putImageData(j, 0, 0, 0, 0, b.width, b.height)
  var o = canvas.toDataURL()
  return o
}
function genImageAlarm(a, b) {
  var c = a.src + b
  if (alarmImageCache[c]) { return alarmImageCache[c] }
  var d = new Image()
  return d.src = changeColor(graphics, a, b),
  alarmImageCache[c] = d,
  d
}
function getOffsetPosition(a) {
  if (!a) {
    return {
      left: 0,
      top: 0
    }
  }
  var b = 0,
    c = 0
  if ('getBoundingClientRect' in document.documentElement) { var d = a.getBoundingClientRect(), e = a.ownerDocument, f = e.body, g = e.documentElement, h = g.clientTop || f.clientTop || 0, i = g.clientLeft || f.clientLeft || 0, b = d.top + (self.pageYOffset || g && g.scrollTop || f.scrollTop) - h, c = d.left + (self.pageXOffset || g && g.scrollLeft || f.scrollLeft) - i } else {
    do { b += a.offsetTop || 0, c += a.offsetLeft || 0, a = a.offsetParent }
    while (a)
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
  var f = (d - b) / (c - a),
    g = b - a * f
  return e.k = f,
  e.b = g,
  e.x1 = a,
  e.x2 = c,
  e.y1 = b,
  e.y2 = d,
  e
}
function inRange(a, b, c) {
  var d = Math.abs(b - c),
    e = Math.abs(b - a),
    f = Math.abs(c - a),
    g = Math.abs(d - (e + f))
  return g < 1e-6 ? !0 : !1
}
function isPointInLineSeg(a, b, c) {
  return inRange(a, c.x1, c.x2) && inRange(b, c.y1, c.y2)
}
function intersection(a, b) {
  var c,
    d
  return a.k == b.k ? null : (1 / 0 == a.k || a.k == -1 / 0 ? (c = a.x1, d = b(a.x1)) : 1 / 0 == b.k || b.k == -1 / 0 ? (c = b.x1, d = a(b.x1)) : (c = (b.b - a.b) / (a.k - b.k), d = a(c)), isPointInLineSeg(c, d, a) == 0 ? null : isPointInLineSeg(c, d, b) == 0 ? null : {
    x: c,
    y: d
  })
}
function intersectionLineBound(a, b) {
  var c = lineF(b.left, b.top, b.left, b.bottom),
    d = intersection(a, c)
  return d == null && (c = lineF(b.left, b.top, b.right, b.top), d = intersection(a, c), d == null && (c = lineF(b.right, b.top, b.right, b.bottom), d = intersection(a, c), d == null && (c = lineF(b.left, b.bottom, b.right, b.bottom), d = intersection(a, c)))),
  d
}

const util = {
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
  loadStageFromJson: loadStageFromJson
}

export default util
