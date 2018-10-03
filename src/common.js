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
    d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*\]\s*/)
    ; (d == null || d.length < 5) && (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*\]\s*/), f = !0)
    if (d != null && d.length >= 5) {
      var g = d[1],
        h = d[2],
        i = d[3],
        j = d[4]
      e = a.filter(function (a) {
        if (a.elementType != g) { return !1 }
        var b = a[h]
        f == 1 && (b = parseInt(b))
        return i == '=' ? b == j : i == '>' ? b > j : i == '<' ? j > b : i == '<=' ? j >= b : i == '>=' ? b >= j : i == '!=' ? b != j : !1
      })

      e != null && e.length > 0 && (c = c.concat(e))
    }
  }
  return c
}
function c(a) {
  a.find = function (a) {
    return find.call(this, a)
  }

  e.forEach(function (b) {
    a[b] = function (a) {
      for (var c = 0; c < this.length; c++) { this[c][b](a) }
      return this
    }
  })

  if (a.length > 0) {
    var b = a[0]
    for (var c in b) {
      var f = b[c]
      typeof f == 'function' && !(function (b) {
        a[c] = function () {
          for (var c = [], d = 0; d < a.length; d++) { c.push(b.apply(a[d], arguments)) }
          return c
        }
      }(f))
    }
  }
  a.attr = function (a, b) {
    if (a != null && b != null) {
      for (var c = 0; c < this.length; c++) { this[c][a] = b }
    } else {
      if (a != null && typeof a == 'string') {
        c = 0
        for (var d = []; c < this.length; c++) {
          d.push(this[c][a])
        }
        return d
      }
      if (a != null) {
        for (c = 0; c < this.length; c++) {
          for (var e in a) { this[c][e] = a[e] }
        }
      }
    }
    return this
  }
  return a
}

export const find = function find(d) {
  var e = [],
    f = []

  this instanceof JTopo.Stage ? (e = this.childs, f = f.concat(e)) : this instanceof JTopo.Scene ? e = [this] : f = this
  e.forEach(function (a) {
    f = f.concat(a.childs)
  })
  var g = null
  g = typeof d == 'function' ? f.filter(d) : b(f, d)
  return c(g)
}
/**
 * find method end
 * =============================================================================
*/

/**
 * extend array start
 * =============================================================================
 */
export const del = function (a) {
  if (typeof a !== 'number') {
    for (let b = 0; b < this.length; b++) {
      if (this[b] === a) {
        return this.slice(0, b).concat(this.slice(b + 1, this.length))
      }
    }
    return this
  }
  return a < 0 ? this : this.slice(0, a).concat(this.slice(a + 1, this.length))
}

export const indexOf = function (a) {
  for (let b = 0; b < this.length; b++) {
    if (this[b] === a) {
      return b
    }
  }
  return -1
}
/**
 * extend array end
 * =============================================================================
 */

export function createStageFromJson(jsonObj, canvas) {
  var stage = new JTopo.Stage(canvas)
  for (var k in jsonObj) { k != 'childs' && (stage[k] = jsonObj[k]) }
  var scenes = jsonObj.childs
  scenes.forEach(function (a) {
    var b = new JTopo.Scene(stage)
    for (var c in a) {
      c != 'childs' && (b[c] = a[c])
      c == 'background' && (b.background = a[c])
    }
    var d = a.childs
    d.forEach(function (a) {
      var c = null,
        d = a.elementType
      d == 'node' ? c = new JTopo.Node() : d == 'CircleNode' && (c = new JTopo.CircleNode())
      for (var e in a) { c[e] = a[e] }
      b.add(c)
    })
  })
  return stage
}

export const extend = function extend(SubClass, SuperClass) {
  // let F = function () { }
  // F.prototype = superClass.prototype
  SubClass.prototype = new SuperClass()
  SubClass.prototype.constructor = SubClass

  // 防止超类改变原型
  SubClass.super = SuperClass.prototype
}
