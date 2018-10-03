import Node from './node'
import { extend } from '../common'

function TextNode(text) {
  this.initialize()
  this.text = text
  this.elementType = 'TextNode'
}

extend(TextNode, Node)

TextNode.prototype.paint = function (a) {
  a.beginPath(),
  a.font = this.font,
  this.width = a.measureText(this.text).width,
  this.height = a.measureText('田').width,
  a.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
  a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
  a.fillText(this.text, -this.width / 2, this.height / 2),
  a.closePath(),
  this.paintBorder(a),
  this.paintCtrl(a),
  this.paintAlarmText(a)
}

export default TextNode
