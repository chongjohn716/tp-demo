import TextNode from './text-node'
import { extend } from '../common'

function LinkNode(a, b, c) {
  this.initialize(),
  this.text = a,
  this.href = b,
  this.target = c,
  this.elementType = 'LinkNode',
  this.isVisited = !1,
  this.visitedColor = null,
  this.mousemove(function () {
    var a = document.getElementsByTagName('canvas')
    if (a && a.length > 0) {
      for (var b = 0; b < a.length; b++) { a[b].style.cursor = 'pointer' }
    }
  }),
  this.mouseout(function () {
    var a = document.getElementsByTagName('canvas')
    if (a && a.length > 0) {
      for (var b = 0; b < a.length; b++) { a[b].style.cursor = 'default' }
    }
  }),
  this.click(function () {
    this.target == '_blank' ? window.open(this.href) : location = this.href,
    this.isVisited = !0
  })
}

extend(LinkNode, TextNode)

LinkNode.prototype.paint = function (a) {
  a.beginPath(),
  a.font = this.font,
  this.width = a.measureText(this.text).width,
  this.height = a.measureText('田').width,
  this.isVisited && this.visitedColor != null ? (a.strokeStyle = 'rgba(' + this.visitedColor + ', ' + this.alpha + ')', a.fillStyle = 'rgba(' + this.visitedColor + ', ' + this.alpha + ')') : (a.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')', a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')'),
  a.fillText(this.text, -this.width / 2, this.height / 2),
  this.isMouseOver && (a.moveTo(-this.width / 2, this.height), a.lineTo(this.width / 2, this.height), a.stroke()),
  a.closePath(),
  this.paintBorder(a),
  this.paintCtrl(a),
  this.paintAlarmText(a)
}

export default LinkNode
