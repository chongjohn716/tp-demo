import InteractiveElement from './interactive-element'
import util from '../util'
import { SceneMode } from '../const'

function EditableElement() {
}

util.extend(EditableElement, InteractiveElement)

EditableElement.prototype.initialize = function () {
  EditableElement.super.initialize.apply(this, arguments)
  this.editAble = false
  this.selectedPoint = null
}
EditableElement.prototype.getCtrlPosition = function (a) {
  const b = 5
  const c = 5
  const d = this.getPosition(a)
  return {
    left: d.x - b,
    top: d.y - c,
    right: d.x + b,
    bottom: d.y + c
  }
}
EditableElement.prototype.selectedHandler = function (b) {
  EditableElement.super.selectedHandler.apply(this, arguments)
  this.selectedSize = {
    width: this.width,
    height: this.height
  }
  b.scene.mode === SceneMode.edit && (this.editAble = true)
}
EditableElement.prototype.unselectedHandler = function () {
  EditableElement.super.unselectedHandler.apply(this, arguments)
  this.selectedSize = null
  this.editAble = false
}

const CTRL_POSTIONS = ['Top_Left', 'Top_Center', 'Top_Right', 'Middle_Left', 'Middle_Right', 'Bottom_Left', 'Bottom_Center', 'Bottom_Right']

EditableElement.prototype.paintCtrl = function (a) {
  if (this.editAble) {
    a.save()
    for (let c = 0; c < CTRL_POSTIONS.length; c++) {
      const d = this.getCtrlPosition(CTRL_POSTIONS[c])
      d.left -= this.cx
      d.right -= this.cx
      d.top -= this.cy
      d.bottom -= this.cy
      const e = d.right - d.left
      const f = d.bottom - d.top
      a.beginPath()
      a.strokeStyle = 'rgba(0,0,0,0.8)'
      a.rect(d.left, d.top, e, f)
      a.stroke()
      a.closePath()
      a.beginPath()
      a.strokeStyle = 'rgba(255,255,255,0.3)'
      a.rect(d.left + 1, d.top + 1, e - 2, f - 2)
      a.stroke()
      a.closePath()
    }
    a.restore()
  }
}

EditableElement.prototype.isInBound = function (a, c) {
  this.selectedPoint = null
  if (this.editAble) {
    for (let e = 0; e < CTRL_POSTIONS.length; e++) {
      const f = this.getCtrlPosition(CTRL_POSTIONS[e])
      if (a > f.left && a < f.right && c > f.top && c < f.bottom) {
        this.selectedPoint = CTRL_POSTIONS[e]
        return true
      }
    }
  }
  return EditableElement.super.isInBound.apply(this, arguments)
}

EditableElement.prototype.mousedragHandler = function (a) {
  let b, c, d, e
  if (this.selectedPoint == null) {
    b = this.selectedLocation.x + a.dx
    c = this.selectedLocation.y + a.dy
    this.setLocation(b, c)
    this.dispatchEvent('mousedrag', a)
  } else {
    if (this.selectedPoint === 'Top_Left') {
      d = this.selectedSize.width - a.dx
      e = this.selectedSize.height - a.dy
      b = this.selectedLocation.x + a.dx
      c = this.selectedLocation.y + a.dy
      b < this.x + this.width && (this.x = b, this.width = d)
      c < this.y + this.height && (this.y = c, this.height = e)
    } else if (this.selectedPoint === 'Top_Center') {
      e = this.selectedSize.height - a.dy
      c = this.selectedLocation.y + a.dy
      c < this.y + this.height && (this.y = c, this.height = e)
    } else if (this.selectedPoint === 'Top_Right') {
      d = this.selectedSize.width + a.dx
      c = this.selectedLocation.y + a.dy
      c < this.y + this.height && (this.y = c, this.height = this.selectedSize.height - a.dy)
      d > 1 && (this.width = d)
    } else if (this.selectedPoint === 'Middle_Left') {
      d = this.selectedSize.width - a.dx
      b = this.selectedLocation.x + a.dx
      b < this.x + this.width && (this.x = b)
      d > 1 && (this.width = d)
    } else if (this.selectedPoint === 'Middle_Right') {
      d = this.selectedSize.width + a.dx
      d > 1 && (this.width = d)
    } else if (this.selectedPoint === 'Bottom_Left') {
      d = this.selectedSize.width - a.dx
      b = this.selectedLocation.x + a.dx
      d > 1 && (this.x = b, this.width = d)
      e = this.selectedSize.height + a.dy
      e > 1 && (this.height = e)
    } else if (this.selectedPoint === 'Bottom_Center') {
      e = this.selectedSize.height + a.dy
      e > 1 && (this.height = e)
    } else if (this.selectedPoint === 'Bottom_Right') {
      d = this.selectedSize.width + a.dx
      d > 1 && (this.width = d)
      e = this.selectedSize.height + a.dy
      e > 1 && (this.height = e)
    }
    this.dispatchEvent('resize', a)
  }
}

export default EditableElement
