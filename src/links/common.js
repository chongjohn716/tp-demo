import util from '../util'

export function b(a, b) {
  var c = []
  if (a == null || b == null) { return c }
  if (a && b && a.outLinks && b.inLinks) {
    for (var d = 0; d < a.outLinks.length; d++) {
      for (var e = a.outLinks[d], f = 0; f < b.inLinks.length; f++) {
        var g = b.inLinks[f]
        e === g && c.push(g)
      }
    }
  }
  return c
}
export function c(a, c) {
  var d = b(a, c),
    e = b(c, a),
    f = d.concat(e)
  return f
}
export function d(a) {
  var b = c(a.nodeA, a.nodeZ)
  return b = b.filter(function (b) {
    return a !== b
  })
}
export function e(a, b) {
  return c(a, b).length
}
export function h(b, c) {
  var d = util.lineF(b.cx, b.cy, c.cx, c.cy),
    e = b.getBound(),
    f = util.intersectionLineBound(d, e)
  return f
}
