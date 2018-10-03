import { extend } from '../common'
import Node from './node'

function CircleNode(a) {
  this.initialize(arguments)
  this._radius = 20
  this.beginDegree = 0
  this.endDegree = 2 * Math.PI
  this.text = a
}

extend(CircleNode, Node)

Object.defineProperties(CircleNode.prototype, {
  radius: {
    get: function () {
      return this._radius
    },
    set: function (a) {
      this._radius = a

      var b = 2 * this.radius,
        c = 2 * this.radius

      this.width = b
      this.height = c
    }
  },
  width: {
    get: function () {
      return this._width
    },
    set: function (a) {
      this._radius = a / 2
      this._width = a
    }
  },
  height: {
    get: function () {
      return this._height
    },
    set: function (a) {
      this._radius = a / 2
      this._height = a
    }
  }
})

CircleNode.prototype.paint = function (a) {
  a.save()
  a.beginPath()
  a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')'
  a.arc(0, 0, this.radius, this.beginDegree, this.endDegree, !0)
  a.fill()
  a.closePath()
  a.restore()
  this.paintText(a)
  this.paintBorder(a)
  this.paintCtrl(a)
  this.paintAlarmText(a)
}

CircleNode.prototype.paintSelected = function (a) {
  a.save()
  a.beginPath()
  a.strokeStyle = 'rgba(168,202,255, 0.9)'
  a.fillStyle = 'rgba(168,202,236,0.7)'
  a.arc(0, 0, this.radius + 3, this.beginDegree, this.endDegree, !0)
  a.fill()
  a.stroke()
  a.closePath()
  a.restore()
}

export default CircleNode
