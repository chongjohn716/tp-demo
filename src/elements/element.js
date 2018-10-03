import { noop } from '../common'

function Element() {
}

Element.prototype.initialize = function () {
  this.elementType = 'element',
  this.serializedProperties = ['elementType'],
  this.propertiesStack = [],
  this._id = '' + (new Date()).getTime()
}

Element.prototype.distroy = noop
Element.prototype.removeHandler = noop

Element.prototype.attr = function (a, b) {
  if (a != null && b != null) { this[a] = b } else if (a != null) { return this[a] }
  return this
}

Element.prototype.save = function () {
  var a = this,
    b = {}
  this.serializedProperties.forEach(function (c) {
    b[c] = a[c]
  }),
  this.propertiesStack.push(b)
}

Element.prototype.restore = function () {
  if (this.propertiesStack != null && this.propertiesStack.length != 0) {
    var a = this,
      b = this.propertiesStack.pop()
    this.serializedProperties.forEach(function (c) {
      a[c] = b[c]
    })
  }
}

Element.prototype.toJson = function () {
  var a = this,
    b = '{',
    c = this.serializedProperties.length
  return this.serializedProperties.forEach(function (d, e) {
    var f = a[d]
    typeof f === 'string' && (f = '"' + f + '"'),
    b += '"' + d + '":' + f,
    c > e + 1 && (b += ',')
  }),
  b += '}'
}

export default Element
