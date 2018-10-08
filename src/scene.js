import util from './util'
import Element from './elements/element'
import InteractiveElement from './elements/interactive-element'
import Node from './nodes/node'
import Link from './links/link'
import MessageBus from './message-bus'
import { find, extend, del } from './common'

import {
  SceneMode,
  MouseCursor
} from './const'
function SelectArea(a, b, c, d) {
  return function (e) {
    e.beginPath()
    e.strokeStyle = 'rgba(0,0,236,0.5)'
    e.fillStyle = 'rgba(0,0,236,0.1)'
    e.rect(a, b, c, d)
    e.fill()
    e.stroke()
    e.closePath()
  }
}

function Scene(c) {
  this.initialize()
  c != null && (c.add(this), this.addTo(c))

  this.touchstart = this.mousedownHander
  this.touchmove = this.mousedragHandler
  this.touchend = this.mousedownHander
  var f = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup'.split(',')
  f.forEach((a) => {
    this[a] = function (b) {
      b != null ? this.addEventListener(a, b) : this.dispatchEvent(a)
    }
  })
}

extend(Scene, Element)

Scene.prototype.find = find

Scene.prototype.initialize = function () {
  Scene.super.initialize.apply(this, arguments)
  this.messageBus = new MessageBus()
  this.elementType = 'scene'
  this.childs = []
  this.zIndexMap = {}
  this.zIndexArray = []
  this.backgroundColor = '255,255,255'
  this.visible = !0
  this.alpha = 0
  this.scaleX = 1
  this.scaleY = 1
  this.mode = SceneMode.normal
  this.translate = !0
  this.translateX = 0
  this.translateY = 0
  this.lastTranslateX = 0
  this.lastTranslateY = 0
  this.mouseDown = !1
  this.mouseDownX = null
  this.mouseDownY = null
  this.mouseDownEvent = null
  this.areaSelect = !0
  this.operations = []
  this.selectedElements = []
  this.paintAll = !1

  var c = 'background,backgroundColor,mode,paintAll,areaSelect,translate,translateX,translateY,lastTranslatedX,lastTranslatedY,alpha,visible,scaleX,scaleY'.split(',')
  this.serializedProperties = this.serializedProperties.concat(c)
}

Scene.prototype.setBackground = function (a) {
  this.background = a
}

Scene.prototype.addTo = function (a) {
  this.stage !== a && a != null && (this.stage = a)
}

Scene.prototype.show = function () {
  this.visible = !0
}

Scene.prototype.hide = function () {
  this.visible = !1
}

Scene.prototype.paint = function (a) {
  if (this.visible != 0 && this.stage != null) {
    a.save()
    this.paintBackgroud(a)
    a.restore()
    a.save()
    a.scale(this.scaleX, this.scaleY)
    if (this.translate == 1) {
      var b = this.getOffsetTranslate(a)
      a.translate(b.translateX, b.translateY)
    }
    this.paintChilds(a)
    a.restore()
    a.save()
    this.paintOperations(a, this.operations)
    a.restore()
  }
}

Scene.prototype.repaint = function (a) {
  this.visible != 0 && this.paint(a)
}

Scene.prototype.paintBackgroud = function (a) {
  this.background != null ? a.drawImage(this.background, 0, 0, a.canvas.width, a.canvas.height) : (a.beginPath(), a.fillStyle = 'rgba(' + this.backgroundColor + ',' + this.alpha + ')', a.fillRect(0, 0, a.canvas.width, a.canvas.height), a.closePath())
}

Scene.prototype.getDisplayedElements = function () {
  for (var a = [], b = 0; b < this.zIndexArray.length; b++) {
    for (var c = this.zIndexArray[b], d = this.zIndexMap[c], e = 0; e < d.length; e++) {
      var f = d[e]
      this.isVisiable(f) && a.push(f)
    }
  }
  return a
}

Scene.prototype.getDisplayedNodes = function () {
  for (var b = [], c = 0; c < this.childs.length; c++) {
    var d = this.childs[c]
    d instanceof Node && this.isVisiable(d) && b.push(d)
  }
  return b
}

Scene.prototype.paintChilds = function (b) {
  for (var c = 0; c < this.zIndexArray.length; c++) {
    for (var d = this.zIndexArray[c], e = this.zIndexMap[d], f = 0; f < e.length; f++) {
      var g = e[f]
      if (this.paintAll == 1 || this.isVisiable(g)) {
        b.save()
        if (g.transformAble == 1) {
          var h = g.getCenterLocation()
          b.translate(h.x, h.y)
          g.rotate && b.rotate(g.rotate)
          g.scaleX && g.scaleY ? b.scale(g.scaleX, g.scaleY) : g.scaleX ? b.scale(g.scaleX, 1) : g.scaleY && b.scale(1, g.scaleY)
        }
        g.shadow == 1 && (b.shadowBlur = g.shadowBlur, b.shadowColor = g.shadowColor, b.shadowOffsetX = g.shadowOffsetX, b.shadowOffsetY = g.shadowOffsetY)
        g instanceof InteractiveElement && (g.selected && g.showSelected == 1 && g.paintSelected(b), g.isMouseOver == 1 && g.paintMouseover(b))
        g.paint(b)
        b.restore()
      }
    }
  }
}

Scene.prototype.getOffsetTranslate = function (a) {
  var b = this.stage.canvas.width,
    c = this.stage.canvas.height
  a != null && a != 'move' && (b = a.canvas.width, c = a.canvas.height)
  var d = b / this.scaleX / 2,
    e = c / this.scaleY / 2,
    f = {
      translateX: this.translateX + (d - d * this.scaleX),
      translateY: this.translateY + (e - e * this.scaleY)
    }
  return f
}

Scene.prototype.isVisiable = function (b) {
  if (b.visible != 1) { return !1 }
  if (b instanceof Link) { return !0 }
  var c = this.getOffsetTranslate(),
    d = b.x + c.translateX,
    e = b.y + c.translateY

  d *= this.scaleX
  e *= this.scaleY

  var f = d + b.width * this.scaleX,
    g = e + b.height * this.scaleY

  return d > this.stage.canvas.width || e > this.stage.canvas.height || f < 0 || g < 0 ? !1 : !0
}

Scene.prototype.paintOperations = function (a, b) {
  for (var c = 0; c < b.length; c++) { b[c](a) }
}

Scene.prototype.findElements = function (a) {
  for (var b = [], c = 0; c < this.childs.length; c++) { a(this.childs[c]) == 1 && b.push(this.childs[c]) }
  return b
}

Scene.prototype.getElementsByClass = function (a) {
  return this.findElements(function (b) {
    return b instanceof a
  })
}

Scene.prototype.addOperation = function (a) {
  this.operations.push(a)
  return this
}

Scene.prototype.clearOperations = function () {
  this.operations = []
  return this
}

Scene.prototype.getElementByXY = function (b, c) {
  for (var d = null, e = this.zIndexArray.length - 1; e >= 0; e--) {
    for (var f = this.zIndexArray[e], g = this.zIndexMap[f], h = g.length - 1; h >= 0; h--) {
      var i = g[h]
      if (i instanceof InteractiveElement && this.isVisiable(i) && i.isInBound(b, c)) {
        return i
      }
    }
  }
  return d
}

Scene.prototype.add = function (a) {
  this.childs.push(a)
  this.zIndexMap[a.zIndex] == null && (this.zIndexMap[a.zIndex] = [], this.zIndexArray.push(a.zIndex), this.zIndexArray.sort(function (a, b) {
    return a - b
  }))
  this.zIndexMap['' + a.zIndex].push(a)
}

Scene.prototype.remove = function (b) {
  this.childs = util.removeFromArray(this.childs, b)
  var c = this.zIndexMap[b.zIndex]
  c && (this.zIndexMap[b.zIndex] = util.removeFromArray(c, b))
  b.removeHandler(this)
}

Scene.prototype.clear = function () {
  var a = this
  this.childs.forEach(function (b) {
    b.removeHandler(a)
  })
  this.childs = []
  this.operations = []
  this.zIndexArray = []
  this.zIndexMap = {}
}

Scene.prototype.addToSelected = function (a) {
  this.selectedElements.push(a)
}

Scene.prototype.cancleAllSelected = function (a) {
  for (var b = 0; b < this.selectedElements.length; b++) { this.selectedElements[b].unselectedHandler(a) }
  this.selectedElements = []
}

Scene.prototype.notInSelectedNodes = function (a) {
  for (var b = 0; b < this.selectedElements.length; b++) {
    if (a === this.selectedElements[b]) { return !1 }
  }
  return !0
}

Scene.prototype.removeFromSelected = function (a) {
  for (var b = 0; b < this.selectedElements.length; b++) {
    var c = this.selectedElements[b]
    a === c && (this.selectedElements = del.call(this.selectedElements, b))
  }
}

Scene.prototype.toSceneEvent = function (b) {
  var c = util.clone(b)
  c.x /= this.scaleX
  c.y /= this.scaleY
  if (this.translate == 1) {
    var d = this.getOffsetTranslate()
    c.x -= d.translateX
    c.y -= d.translateY
  }
  c.dx != null && (c.dx /= this.scaleX, c.dy /= this.scaleY)
  this.currentElement != null && (c.target = this.currentElement)
  c.scene = this
  return c
}

Scene.prototype.selectElement = function (a) {
  var b = this.getElementByXY(a.x, a.y)
  if (b != null) {
    a.target = b
    b.mousedownHander(a)
    b.selectedHandler(a)
    if (this.notInSelectedNodes(b)) {
      a.ctrlKey || this.cancleAllSelected()
      this.addToSelected(b)
    } else {
      a.ctrlKey == 1 && (b.unselectedHandler(), this.removeFromSelected(b))
      for (var c = 0; c < this.selectedElements.length; c++) {
        var d = this.selectedElements[c]
        d.selectedHandler(a)
      }
    }
  } else { a.ctrlKey || this.cancleAllSelected() }
  this.currentElement = b
}

Scene.prototype.mousedownHandler = function (b) {
  var c = this.toSceneEvent(b)
  this.mouseDown = !0
  this.mouseDownX = c.x
  this.mouseDownY = c.y
  this.mouseDownEvent = c
  if (this.mode == SceneMode.normal) {
    this.selectElement(c)
    ; (this.currentElement == null || this.currentElement instanceof Link) && this.translate == 1 && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY)
  } else {
    if (this.mode == SceneMode.drag && this.translate == 1) {
      this.lastTranslateX = this.translateX
      this.lastTranslateY = this.translateY
      return
    }
    this.mode == SceneMode.select ? this.selectElement(c) : this.mode == SceneMode.edit && (this.selectElement(c), (this.currentElement == null || this.currentElement instanceof Link) && this.translate == 1 && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY))
  }
  this.dispatchEvent('mousedown', c)
}

Scene.prototype.mouseupHandler = function (b) {
  this.stage.cursor != MouseCursor.normal && (this.stage.cursor = MouseCursor.normal)
  this.clearOperations()
  var c = this.toSceneEvent(b)
  this.currentElement != null && (c.target = this.currentElement, this.currentElement.mouseupHandler(c))
  this.dispatchEvent('mouseup', c)
  this.mouseDown = !1
}

Scene.prototype.dragElements = function (b) {
  if (this.currentElement != null && this.currentElement.dragable == 1) {
    for (var c = 0; c < this.selectedElements.length; c++) {
      var d = this.selectedElements[c]
      if (d.dragable != 0) {
        var e = util.clone(b)
        e.target = d
        d.mousedragHandler(e)
      }
    }
  }
}

Scene.prototype.mousedragHandler = function (b) {
  var c = this.toSceneEvent(b)
  this.mode == SceneMode.normal ? this.currentElement == null || this.currentElement instanceof Link ? this.translate == 1 && (this.stage.cursor = MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.dragElements(c) : this.mode == SceneMode.drag ? this.translate == 1 && (this.stage.cursor = MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.mode == SceneMode.select ? this.currentElement != null ? this.currentElement.dragable == 1 && this.dragElements(c) : this.areaSelect == 1 && this.areaSelectHandle(c) : this.mode == SceneMode.edit && (this.currentElement == null || this.currentElement instanceof Link ? this.translate == 1 && (this.stage.cursor = MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.dragElements(c))
  this.dispatchEvent('mousedrag', c)
}

Scene.prototype.areaSelectHandle = function (a) {
  var b = a.offsetLeft,
    c = a.offsetTop,
    f = this.mouseDownEvent.offsetLeft,
    g = this.mouseDownEvent.offsetTop,
    h = b >= f ? f : b,
    i = c >= g ? g : c,
    j = Math.abs(a.dx) * this.scaleX,
    k = Math.abs(a.dy) * this.scaleY,
    l = new SelectArea(h, i, j, k)

  this.clearOperations().addOperation(l)
  b = a.x
  c = a.y
  f = this.mouseDownEvent.x
  g = this.mouseDownEvent.y
  h = b >= f ? f : b
  i = c >= g ? g : c
  j = Math.abs(a.dx)
  k = Math.abs(a.dy)

  var e = this
  for (var m = h + j, n = i + k, o = 0; o < e.childs.length; o++) {
    var p = e.childs[o]
    p.x > h && p.x + p.width < m && p.y > i && p.y + p.height < n && e.notInSelectedNodes(p) && (p.selectedHandler(a), e.addToSelected(p))
  }
}

Scene.prototype.mousemoveHandler = function (b) {
  this.mousecoord = {
    x: b.x,
    y: b.y
  }
  var c = this.toSceneEvent(b)
  if (this.mode == SceneMode.drag) { return void (this.stage.cursor = MouseCursor.open_hand) }
  this.mode == SceneMode.normal ? this.stage.cursor = MouseCursor.normal : this.mode == SceneMode.select && (this.stage.cursor = MouseCursor.normal)
  var d = this.getElementByXY(c.x, c.y)
  d != null ? (this.mouseOverelement && this.mouseOverelement !== d && (c.target = d, this.mouseOverelement.mouseoutHandler(c)), this.mouseOverelement = d, d.isMouseOver == 0 ? (c.target = d, d.mouseoverHandler(c), this.dispatchEvent('mouseover', c)) : (c.target = d, d.mousemoveHandler(c), this.dispatchEvent('mousemove', c))) : this.mouseOverelement ? (c.target = d, this.mouseOverelement.mouseoutHandler(c), this.mouseOverelement = null, this.dispatchEvent('mouseout', c)) : (c.target = null, this.dispatchEvent('mousemove', c))
}

Scene.prototype.mouseoverHandler = function (a) {
  var b = this.toSceneEvent(a)
  this.dispatchEvent('mouseover', b)
}

Scene.prototype.mouseoutHandler = function (a) {
  var b = this.toSceneEvent(a)
  this.dispatchEvent('mouseout', b)
}

Scene.prototype.clickHandler = function (a) {
  var b = this.toSceneEvent(a)
  this.currentElement && (b.target = this.currentElement, this.currentElement.clickHandler(b))
  this.dispatchEvent('click', b)
}

Scene.prototype.dbclickHandler = function (a) {
  var b = this.toSceneEvent(a)
  this.currentElement ? (b.target = this.currentElement, this.currentElement.dbclickHandler(b)) : this.cancleAllSelected()
  this.dispatchEvent('dbclick', b)
}

Scene.prototype.mousewheelHandler = function (a) {
  var b = this.toSceneEvent(a)
  this.dispatchEvent('mousewheel', b)
}

Scene.prototype.keydownHandler = function (a) {
  this.dispatchEvent('keydown', a)
}

Scene.prototype.keyupHandler = function (a) {
  this.dispatchEvent('keyup', a)
}

Scene.prototype.contextmenuHandler = function (a) {
  this.dispatchEvent('contextmenu', a)
}

Scene.prototype.addEventListener = function (a, b) {
  var c = this,
    d = function (a) {
      b.call(c, a)
    }
  this.messageBus.subscribe(a, d)
  return this
}
Scene.prototype.removeEventListener = function (a) {
  this.messageBus.unsubscribe(a)
}

Scene.prototype.removeAllEventListener = function () {
  this.messageBus = new MessageBus()
}

Scene.prototype.dispatchEvent = function (a, b) {
  this.messageBus.publish(a, b)
  return this
}

Scene.prototype.zoom = function (a, b) {
  a != null && a != 0 && (this.scaleX = a)
  b != null && b != 0 && (this.scaleY = b)
}

Scene.prototype.zoomOut = function (a) {
  a != 0 && (a == null && (a = 0.8), this.scaleX /= a, this.scaleY /= a)
}

Scene.prototype.zoomIn = function (a) {
  a != 0 && (a == null && (a = 0.8), this.scaleX *= a, this.scaleY *= a)
}

Scene.prototype.getBound = function () {
  return {
    left: 0,
    top: 0,
    right: this.stage.canvas.width,
    bottom: this.stage.canvas.height,
    width: this.stage.canvas.width,
    height: this.stage.canvas.height
  }
}

Scene.prototype.getElementsBound = function () {
  return util.getElementsBound(this.childs)
}

Scene.prototype.translateToCenter = function (a) {
  var b = this.getElementsBound(),
    c = this.stage.canvas.width / 2 - (b.left + b.right) / 2,
    d = this.stage.canvas.height / 2 - (b.top + b.bottom) / 2

  a && (c = a.canvas.width / 2 - (b.left + b.right) / 2, d = a.canvas.height / 2 - (b.top + b.bottom) / 2)
  this.translateX = c
  this.translateY = d
}

Scene.prototype.setCenter = function (a, b) {
  var c = a - this.stage.canvas.width / 2,
    d = b - this.stage.canvas.height / 2

  this.translateX = -c
  this.translateY = -d
}

Scene.prototype.centerAndZoom = function (a, b, c) {
  this.translateToCenter(c)
  if (a == null || b == null) {
    var d = this.getElementsBound(),
      e = d.right - d.left,
      f = d.bottom - d.top,
      g = this.stage.canvas.width / e,
      h = this.stage.canvas.height / f
    c && (g = c.canvas.width / e, h = c.canvas.height / f)
    var i = Math.min(g, h)
    if (i > 1) {
      return
    }
    this.zoom(i, i)
  }
  this.zoom(a, b)
}

Scene.prototype.getCenterLocation = function () {
  return {
    x: this.stage.canvas.width / 2,
    y: this.stage.canvas.height / 2
  }
}

Scene.prototype.doLayout = function (a) {
  a && a(this, this.childs)
}

Scene.prototype.toJson = function () {
  var a = this,
    b = '{'
  this.serializedProperties.length
  this.serializedProperties.forEach(function (c) {
    var d = a[c]
    c == 'background' && (d = a._background.src)
    typeof d === 'string' && (d = '"' + d + '"')
    b += '"' + c + '":' + d + ','
  })
  b += '"childs":['
  var c = this.childs.length
  this.childs.forEach(function (a, d) {
    b += a.toJson()
    c > d + 1 && (b += ',')
  })
  b += ']'
  b += '}'
  return b
}

var c = {}

Object.defineProperties(Scene.prototype, {
  background: {
    get: function () {
      return this._background
    },
    set: function (a) {
      if (typeof a === 'string') {
        var b = c[a]
        b == null && (b = new Image(), b.src = a, b.onload = function () {
          c[a] = b
        })
        this._background = b
      } else { this._background = a }
    }
  }
})

export default Scene
