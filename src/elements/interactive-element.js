import DisplayElement from './display-element'
import util from '../util'
import MessageBus from '../message-bus'

function InteractiveElement() {
	this.initialize()
	var b = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,touchstart,touchmove,touchend'.split(','),
		d = this
	b.forEach(function (a) {
		d[a] = function (b) {
			b != null ? this.addEventListener(a, b) : this.dispatchEvent(a)
		}
	})
}

util.extend(InteractiveElement, DisplayElement)

InteractiveElement.prototype.initialize = function () {
	InteractiveElement.super.initialize.apply(this, arguments),
	this.elementType = 'interactiveElement',
	this.dragable = !1,
	this.selected = !1,
	this.showSelected = !0,
	this.selectedLocation = null,
	this.isMouseOver = !1
	var a = 'dragable,selected,showSelected,isMouseOver'.split(',')
	this.serializedProperties = this.serializedProperties.concat(a)
}
InteractiveElement.prototype.paintSelected = function (a) {
	this.showSelected != 0 && (a.save(), a.beginPath(), a.strokeStyle = 'rgba(168,202,255, 0.9)', a.fillStyle = 'rgba(168,202,236,0.7)', a.rect(-this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6), a.fill(), a.stroke(), a.closePath(), a.restore())
}
InteractiveElement.prototype.paintMouseover = function (a) {
	return this.paintSelected(a)
}
InteractiveElement.prototype.isInBound = function (a, b) {
	return a > this.x && a < this.x + this.width * Math.abs(this.scaleX) && b > this.y && b < this.y + this.height * Math.abs(this.scaleY)
}
InteractiveElement.prototype.selectedHandler = function () {
	this.selected = !0,
	this.selectedLocation = {
		x: this.x,
		y: this.y
	}
}
InteractiveElement.prototype.unselectedHandler = function () {
	this.selected = !1,
	this.selectedLocation = null
}
InteractiveElement.prototype.dbclickHandler = function (a) {
	this.dispatchEvent('dbclick', a)
}
InteractiveElement.prototype.clickHandler = function (a) {
	this.dispatchEvent('click', a)
}
InteractiveElement.prototype.mousedownHander = function (a) {
	this.dispatchEvent('mousedown', a)
}
InteractiveElement.prototype.mouseupHandler = function (a) {
	this.dispatchEvent('mouseup', a)
}
InteractiveElement.prototype.mouseoverHandler = function (a) {
	this.isMouseOver = !0,
	this.dispatchEvent('mouseover', a)
}
InteractiveElement.prototype.mousemoveHandler = function (a) {
	this.dispatchEvent('mousemove', a)
}
InteractiveElement.prototype.mouseoutHandler = function (a) {
	this.isMouseOver = !1,
	this.dispatchEvent('mouseout', a)
}
InteractiveElement.prototype.mousedragHandler = function (a) {
	var b = this.selectedLocation.x + a.dx,
		c = this.selectedLocation.y + a.dy
	this.setLocation(b, c),
	this.dispatchEvent('mousedrag', a)
}
InteractiveElement.prototype.addEventListener = function (b, c) {
	var d = this,
		e = function (a) {
			c.call(d, a)
		}
	return this.messageBus || (this.messageBus = new MessageBus()),
	this.messageBus.subscribe(b, e),
	this
}
InteractiveElement.prototype.dispatchEvent = function (a, b) {
	return this.messageBus ? (this.messageBus.publish(a, b), this) : null
}
InteractiveElement.prototype.removeEventListener = function (a) {
	this.messageBus.unsubscribe(a)
}
InteractiveElement.prototype.removeAllEventListener = function () {
	this.messageBus = new MessageBus()
}
export default InteractiveElement
