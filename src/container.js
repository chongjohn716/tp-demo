import util from './util'
import InteractiveElement from './elements/interactive-element'
import layout from './layout'
import { defaultZIndex } from './const'
import { del } from './extend-native'

function Container(c) {
  this.initialize(c)
}

util.extend(Container, InteractiveElement)

Container.prototype.initialize = function (text) {
  Container.super.initialize.apply(this, null)

  this.elementType = 'container'
  this.zIndex = defaultZIndex.container
  this.width = 100
  this.height = 100
  this.childs = []
  this.alpha = 0.5
  this.dragable = true
  this.childDragble = true
  this.visible = true
  this.fillColor = '10,100,80'
  this.borderWidth = 0
  this.borderColor = '255,255,255'
  this.borderRadius = null
  this.font = '12px Consolas'
  this.fontColor = '255,255,255'
  this.text = text
  this.textPosition = 'Bottom_Center'
  this.textOffsetX = 0
  this.textOffsetY = 0
  this.layout = new layout.AutoBoundLayout()
}

Container.prototype.add = function (a) {
  this.childs.push(a)
  a.dragable = this.childDragble
}

Container.prototype.remove = function (a) {
  for (let b = 0; b < this.childs.length; b++) {
    if (this.childs[b] === a) {
      a.parentContainer = null
      this.childs = del.call(this.childs, b)
      a.lastParentContainer = this
      break
    }
  }
}

Container.prototype.removeAll = function () {
  this.childs = []
}

Container.prototype.setLocation = function (a, b) {
  const c = a - this.x
  const d = b - this.y
  this.x = a
  this.y = b
  for (let e = 0; e < this.childs.length; e++) {
    const f = this.childs[e]
    f.setLocation(f.x + c, f.y + d)
  }
}
Container.prototype.doLayout = function (a) {
  a && a(this, this.childs)
}
Container.prototype.paint = function (a) {
  this.visible && (this.layout && this.layout(this, this.childs), a.beginPath(), a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')', this.borderRadius == null || !this.borderRadius ? a.rect(this.x, this.y, this.width, this.height) : a.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius), a.fill(), a.closePath(), this.paintText(a), this.paintBorder(a))
}

Container.prototype.paintBorder = function (a) {
  if (!this.borderWidth) {
    return
  }
  a.beginPath()
  a.lineWidth = this.borderWidth
  a.strokeStyle = 'rgba(' + this.borderColor + ',' + this.alpha + ')'
  const b = this.borderWidth / 2
  this.borderRadius == null || !this.borderRadius ? a.rect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth) : a.JTopoRoundRect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius)
  a.stroke()
  a.closePath()
}
Container.prototype.paintText = function (a) {
  const b = this.text
  if (!b) {
    return
  }

  a.beginPath()
  a.font = this.font
  const c = a.measureText(b).width
  const d = a.measureText('田').width
  a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')'
  const e = this.getTextPostion(this.textPosition, c, d)
  a.fillText(b, e.x, e.y)
  a.closePath()
}

Container.prototype.getTextPostion = function (a, b, c) {
  let d = null
  a == null || a === 'Bottom_Center' ? d = {
    x: this.x + this.width / 2 - b / 2,
    y: this.y + this.height + c
  }
    : a === 'Top_Center' ? d = {
      x: this.x + this.width / 2 - b / 2,
      y: this.y - c / 2
    }
      : a === 'Top_Right' ? d = {
        x: this.x + this.width - b,
        y: this.y - c / 2
      }
        : a === 'Top_Left' ? d = {
          x: this.x,
          y: this.y - c / 2
        }
          : a === 'Bottom_Right' ? d = {
            x: this.x + this.width - b,
            y: this.y + this.height + c
          }
            : a === 'Bottom_Left' ? d = {
              x: this.x,
              y: this.y + this.height + c
            }
              : a === 'Middle_Center' ? d = {
                x: this.x + this.width / 2 - b / 2,
                y: this.y + this.height / 2 + c / 2
              }
                : a === 'Middle_Right' ? d = {
                  x: this.x + this.width - b,
                  y: this.y + this.height / 2 + c / 2
                }
                  : a === 'Middle_Left' && (d = {
                    x: this.x,
                    y: this.y + this.height / 2 + c / 2
                  })
  this.textOffsetX != null && (d.x += this.textOffsetX)
  this.textOffsetY != null && (d.y += this.textOffsetY)
  return d
}
Container.prototype.paintMouseover = function () { }
Container.prototype.paintSelected = function (a) {
  a.shadowBlur = 10
  a.shadowColor = 'rgba(0,0,0,1)'
  a.shadowOffsetX = 0
  a.shadowOffsetY = 0
}

export default Container
