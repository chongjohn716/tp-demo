export const noop = a => a

/**
 * find method start
 * =============================================================================
*/
var e = 'click,mousedown,mouseup,mouseover,mouseout,mousedrag,keydown,keyup'.split(',')
function b(a, b) {
  var c = []
  if (a.length == 0) { return c }
  var d = b.match(/^\s*(\w+)\s*$/)
  if (d != null) {
    var e = a.filter(function (a) {
      return a.elementType == d[1]
    })
    e != null && e.length > 0 && (c = c.concat(e))
  } else {
    var f = !1
    if (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*\]\s*/), (d == null || d.length < 5) && (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*\]\s*/), f = !0), d != null && d.length >= 5) {
      var g = d[1],
        h = d[2],
        i = d[3],
        j = d[4]
      e = a.filter(function (a) {
        if (a.elementType != g) { return !1 }
        var b = a[h]
        return f == 1 && (b = parseInt(b)),
        i == '=' ? b == j : i == '>' ? b > j : i == '<' ? j > b : i == '<=' ? j >= b : i == '>=' ? b >= j : i == '!=' ? b != j : !1
      }),
      e != null && e.length > 0 && (c = c.concat(e))
    }
  }
  return c
}
function c(a) {
  if (a.find = function (a) {
    return d.call(this, a)
  }, e.forEach(function (b) {
    a[b] = function (a) {
      for (var c = 0; c < this.length; c++) { this[c][b](a) }
      return this
    }
  }), a.length > 0) {
    var b = a[0]
    for (var c in b) {
      var f = b[c]
      typeof f == 'function' && !(function (b) {
        a[c] = function () {
          for (var c = [], d = 0; d < a.length; d++) { c.push(b.apply(a[d], arguments)) }
          return c
        }
      }
      (f))
    }
  }
  return a.attr = function (a, b) {
    if (a != null && b != null) {
      for (var c = 0; c < this.length; c++) { this[c][a] = b }
    } else {
      if (a != null && typeof a == 'string') {
        for (var d = [], c = 0; c < this.length; c++) { d.push(this[c][a]) }
        return d
      }
      if (a != null) {
        for (var c = 0; c < this.length; c++) {
          for (var e in a) { this[c][e] = a[e] }
        }
      }
    }
    return this
  },
  a
}

export const find = function find(d) {
  var e = [],
    f = []
  this instanceof JTopo.Stage ? (e = this.childs, f = f.concat(e)) : this instanceof JTopo.Scene ? e = [this] : f = this,
  e.forEach(function (a) {
    f = f.concat(a.childs)
  })
  var g = null
  return g = typeof d == 'function' ? f.filter(d) : b(f, d),
  g = c(g)
}

/**
 * find method end
 * =============================================================================
*/

export function createStageFromJson(jsonObj, canvas) {
  var stage = new JTopo.Stage(canvas)
  for (var k in jsonObj) { k != 'childs' && (stage[k] = jsonObj[k]) }
  var scenes = jsonObj.childs
  return scenes.forEach(function (a) {
    var b = new JTopo.Scene(stage)
    for (var c in a) { c != 'childs' && (b[c] = a[c]), c == 'background' && (b.background = a[c]) }
    var d = a.childs
    d.forEach(function (a) {
      var c = null,
        d = a.elementType
      d == 'node' ? c = new JTopo.Node() : d == 'CircleNode' && (c = new JTopo.CircleNode())
      for (var e in a) { c[e] = a[e] }
      b.add(c)
    })
  }),
  stage
}

export const extend = function extend(SubClass, SuperClass) {
  // let F = function () { }
  // F.prototype = superClass.prototype
  SubClass.prototype = new SuperClass()
  SubClass.prototype.constructor = SubClass

  // 防止超类改变原型
  SubClass.super = SuperClass.prototype
}
