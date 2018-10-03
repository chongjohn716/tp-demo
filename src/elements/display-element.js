import Element from './element'
import { extend } from '../common'

function DisplayElement() {
  this.initialize()
}

extend(DisplayElement, Element)

Object.defineProperties(DisplayElement.prototype, {
  cx: {
    get: function () {
      return this.x + this.width / 2
    },
    set: function (a) {
      this.x = a - this.width / 2
    }
  },
  cy: {
    get: function () {
      return this.y + this.height / 2
    },
    set: function (a) {
      this.y = a - this.height / 2
    }
  }
})

DisplayElement.prototype.initialize = function () {
  DisplayElement.super.initialize.apply(this, arguments),
  this.elementType = 'displayElement',
  this.x = 0,
  this.y = 0,
  this.width = 32,
  this.height = 32,
  this.visible = !0,
  this.alpha = 1,
  this.rotate = 0,
  this.scaleX = 1,
  this.scaleY = 1,
  this.strokeColor = '22,124,255',
  this.borderColor = '22,124,255',
  this.fillColor = '22,124,255',
  this.shadow = !1,
  this.shadowBlur = 5,
  this.shadowColor = 'rgba(0,0,0,0.5)',
  this.shadowOffsetX = 3,
  this.shadowOffsetY = 6,
  this.transformAble = !1,
  this.zIndex = 0
  var a = 'x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex'.split(',')
  this.serializedProperties = this.serializedProperties.concat(a)
}
DisplayElement.prototype.paint = function (a) {
  a.beginPath(),
  a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')',
  a.rect(-this.width / 2, -this.height / 2, this.width, this.height),
  a.fill(),
  a.stroke(),
  a.closePath()
}
DisplayElement.prototype.getLocation = function () {
  return {
    x: this.x,
    y: this.y
  }
}
DisplayElement.prototype.setLocation = function (a, b) {
  return this.x = a,
  this.y = b,
  this
}
DisplayElement.prototype.getCenterLocation = function () {
  return {
    x: this.x + this.width / 2,
    y: this.y + this.height / 2
  }
}
DisplayElement.prototype.setCenterLocation = function (a, b) {
  return this.x = a - this.width / 2,
  this.y = b - this.height / 2,
  this
}
DisplayElement.prototype.getSize = function () {
  return {
    width: this.width,
    height: this.heith
  }
}
DisplayElement.prototype.setSize = function (a, b) {
  return this.width = a,
  this.height = b,
  this
}
DisplayElement.prototype.getBound = function () {
  return {
    left: this.x,
    top: this.y,
    right: this.x + this.width,
    bottom: this.y + this.height,
    width: this.width,
    height: this.height
  }
}
DisplayElement.prototype.setBound = function (a, b, c, d) {
  return this.setLocation(a, b),
  this.setSize(c, d),
  this
}
DisplayElement.prototype.getDisplayBound = function () {
  return {
    left: this.x,
    top: this.y,
    right: this.x + this.width * this.scaleX,
    bottom: this.y + this.height * this.scaleY
  }
}
DisplayElement.prototype.getDisplaySize = function () {
  return {
    width: this.width * this.scaleX,
    height: this.height * this.scaleY
  }
}
DisplayElement.prototype.getPosition = function (a) {
  var b,
    c = this.getBound()
  return a == 'Top_Left' ? b = {
    x: c.left,
    y: c.top
  }
    : a == 'Top_Center' ? b = {
      x: this.cx,
      y: c.top
    }
      : a == 'Top_Right' ? b = {
        x: c.right,
        y: c.top
      }
        : a == 'Middle_Left' ? b = {
          x: c.left,
          y: this.cy
        }
          : a == 'Middle_Center' ? b = {
            x: this.cx,
            y: this.cy
          }
            : a == 'Middle_Right' ? b = {
              x: c.right,
              y: this.cy
            }
              : a == 'Bottom_Left' ? b = {
                x: c.left,
                y: c.bottom
              }
                : a == 'Bottom_Center' ? b = {
                  x: this.cx,
                  y: c.bottom
                }
                  : a == 'Bottom_Right' && (b = {
                    x: c.right,
                    y: c.bottom
                  }),
  b
}

export default DisplayElement
