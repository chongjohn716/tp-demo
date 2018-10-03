import { noop } from '../common'

function Element() {
}

Element.prototype.initialize = function () {
  this.elementType = 'element'
  this.serializedProperties = ['elementType']
  this.propertiesStack = []
  this._id = '' + (new Date()).getTime()
}

Element.prototype.distroy = noop
Element.prototype.removeHandler = noop

Element.prototype.attr = function (a, b) {
  if (a != null && b != null) { this[a] = b } else if (a != null) { return this[a] }
  return this
}

Element.prototype.save = function () {
  const a = this
  const b = {}
  this.serializedProperties.forEach(function (c) {
    b[c] = a[c]
  })
  this.propertiesStack.push(b)
}

Element.prototype.restore = function () {
  if (this.propertiesStack != null && this.propertiesStack.length !== 0) {
    const a = this
    const b = this.propertiesStack.pop()
    this.serializedProperties.forEach(function (c) {
      a[c] = b[c]
    })
  }
}

Element.prototype.toJson = function () {
  const a = this
  const c = this.serializedProperties.length
  let b = ''

  this.serializedProperties.forEach((d, e) => {
    let f = a[d]
    typeof f === 'string' && (f = '"' + f + '"')
    b += '"' + d + '":' + f
    c > e + 1 && (b += ',')
  })

  return `{${b}}`
}

export default Element
