import EditableElement from '../elements/editable-element'
import { defaultZIndex } from '../const'
import { extend } from '../common'

var Images = {}

function Node(text) {
  this.initialize(text)
}

extend(Node, EditableElement)

Object.defineProperties(Node.prototype, {
  alarmColor: {
    get: function () {
      return this._alarmColor
    },
    set: function (b) {
      this._alarmColor = b
      if (this.image != null) {
        var c = JTopo.util.genImageAlarm(this.image, b)
        c && (this.alarmImage = c)
      }
    }
  }
})

Node.prototype.initialize = function (text) {
  Node.super.initialize.apply(this, arguments)
  this.elementType = 'node'
  this.zIndex = defaultZIndex.node
  this.text = text
  this.font = '12px Consolas'
  this.fontColor = '255,255,255'
  this.borderWidth = 0
  this.borderColor = '255,255,255'
  this.borderRadius = null
  this.dragable = !0
  this.textPosition = 'Bottom_Center'
  this.textOffsetX = 0
  this.textOffsetY = 0
  this.transformAble = !0
  this.inLinks = null
  this.outLinks = null
  var d = 'text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius'.split(',')
  this.serializedProperties = this.serializedProperties.concat(d)
}
Node.prototype.paint = function (a) {
  if (this.image) {
    var b = a.globalAlpha

    a.globalAlpha = this.alpha
    this.alarmImage != null && this.alarm != null ? a.drawImage(this.alarmImage, -this.width / 2, -this.height / 2, this.width, this.height) : a.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height)
    a.globalAlpha = b
  } else {
    a.beginPath()
    a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')'
    this.borderRadius == null || this.borderRadius == 0 ? a.rect(-this.width / 2, -this.height / 2, this.width, this.height) : a.JTopoRoundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius)
    a.fill()
    a.closePath()
  }
  this.paintText(a)
  this.paintBorder(a)
  this.paintCtrl(a)
  this.paintAlarmText(a)
}
Node.prototype.paintAlarmText = function (a) {
  if (this.alarm != null && this.alarm != '') {
    var b = this.alarmColor || '255,0,0',
      c = this.alarmAlpha || 0.5

    a.beginPath()
    a.font = this.alarmFont || '10px 微软雅黑'

    var d = a.measureText(this.alarm).width + 6,
      e = a.measureText('田').width + 6,
      f = this.width / 2 - d / 2,
      g = -this.height / 2 - e - 8

    a.strokeStyle = 'rgba(' + b + ', ' + c + ')'
    a.fillStyle = 'rgba(' + b + ', ' + c + ')'
    a.lineCap = 'round'
    a.lineWidth = 1
    a.moveTo(f, g)
    a.lineTo(f + d, g)
    a.lineTo(f + d, g + e)
    a.lineTo(f + d / 2 + 6, g + e)
    a.lineTo(f + d / 2, g + e + 8)
    a.lineTo(f + d / 2 - 6, g + e)
    a.lineTo(f, g + e)
    a.lineTo(f, g)
    a.fill()
    a.stroke()
    a.closePath()
    a.beginPath()
    a.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')'
    a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')'
    a.fillText(this.alarm, f + 2, g + e - 4)
    a.closePath()
  }
}
Node.prototype.paintText = function (a) {
  var b = this.text
  if (b != null && b != '') {
    a.beginPath()
    a.font = this.font
    var c = a.measureText(b).width,
      d = a.measureText('田').width

    a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')'

    var e = this.getTextPostion(this.textPosition, c, d)

    a.fillText(b, e.x, e.y)
    a.closePath()
  }
}
Node.prototype.paintBorder = function (a) {
  if (this.borderWidth != 0) {
    a.beginPath()
    a.lineWidth = this.borderWidth
    a.strokeStyle = 'rgba(' + this.borderColor + ',' + this.alpha + ')'
    var b = this.borderWidth / 2
    this.borderRadius == null || this.borderRadius == 0 ? a.rect(-this.width / 2 - b, -this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth) : a.JTopoRoundRect(-this.width / 2 - b, -this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius)
    a.stroke()
    a.closePath()
  }
}
Node.prototype.getTextPostion = function (a, b, c) {
  var d = null
  a == null || a == 'Bottom_Center' ? d = {
    x: -this.width / 2 + (this.width - b) / 2,
    y: this.height / 2 + c
  }
    : a == 'Top_Center' ? d = {
      x: -this.width / 2 + (this.width - b) / 2,
      y: -this.height / 2 - c / 2
    }
      : a == 'Top_Right' ? d = {
        x: this.width / 2,
        y: -this.height / 2 - c / 2
      }
        : a == 'Top_Left' ? d = {
          x: -this.width / 2 - b,
          y: -this.height / 2 - c / 2
        }
          : a == 'Bottom_Right' ? d = {
            x: this.width / 2,
            y: this.height / 2 + c
          }
            : a == 'Bottom_Left' ? d = {
              x: -this.width / 2 - b,
              y: this.height / 2 + c
            }
              : a == 'Middle_Center' ? d = {
                x: -this.width / 2 + (this.width - b) / 2,
                y: c / 2
              }
                : a == 'Middle_Right' ? d = {
                  x: this.width / 2,
                  y: c / 2
                }
                  : a == 'Middle_Left' && (d = {
                    x: -this.width / 2 - b,
                    y: c / 2
                  })
  this.textOffsetX != null && (d.x += this.textOffsetX)
  this.textOffsetY != null && (d.y += this.textOffsetY)
  return d
}
Node.prototype.setImage = function (a, b) {
  if (a == null) { throw new Error('Node.setImage(): 参数Image对象为空!') }
  var c = this
  if (typeof a == 'string') {
    var d = Images[a]

    d == null ? (d = new Image(), d.src = a, d.onload = function () {
      Images[a] = d
      b == 1 && c.setSize(d.width, d.height)
      c.image = d
      c.alarmColor = c.alarmColor == null ? '255,0,0' : c.alarmColor
    }) : (b && this.setSize(d.width, d.height), c.image = d, c.alarmColor = c.alarmColor == null ? '255,0,0' : c.alarmColor)
  } else {
    this.image = a
    c.alarmColor = c.alarmColor == null ? '255,0,0' : c.alarmColor
    b == 1 && this.setSize(a.width, a.height)
  }
}
Node.prototype.removeHandler = function (a) {
  var b = this
  this.outLinks && (this.outLinks.forEach(function (c) {
    c.nodeA === b && a.remove(c)
  }), this.outLinks = null)

  this.inLinks && (this.inLinks.forEach(function (c) {
    c.nodeZ === b && a.remove(c)
  }), this.inLinks = null)
}

export default Node
