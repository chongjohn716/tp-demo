import util from '../util'

export function b(a, b) {
  const c = []
  if (a == null || b == null) { return c }
  if (a && b && a.outLinks && b.inLinks) {
    for (let d = 0; d < a.outLinks.length; d++) {
      for (let e = a.outLinks[d], f = 0; f < b.inLinks.length; f++) {
        const g = b.inLinks[f]
        e === g && c.push(g)
      }
    }
  }
  return c
}
export function c(a, c) {
  const d = b(a, c)
  const e = b(c, a)
  const f = d.concat(e)
  return f
}
export function d(a) {
  const b = c(a.nodeA, a.nodeZ)
  return b.filter(function (b) {
    return a !== b
  })
}
export function e(a, b) {
  return c(a, b).length
}
export function h(b, c) {
  const d = util.lineF(b.cx, b.cy, c.cx, c.cy)
  const e = b.getBound()
  const f = util.intersectionLineBound(d, e)
  return f
}
