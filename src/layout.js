function getNodesCenter(a) {
  let b = 0,
    c = 0
  a.forEach(function (a) {
    b += a.cx,
      c += a.cy
  })
  const d = {
    x: b / a.length,
    y: c / a.length
  }
  return d
}
function circleLayoutNodes(c, d) {
  d == null && (d = {}); {
    let e = d.cx,
      f = d.cy,
      g = d.minRadius,
      h = d.nodeDiameter,
      i = d.hScale || 1,
      j = d.vScale || 1
    d.beginAngle || 0,
      d.endAngle || 2 * Math.PI
  }
  if (e == null || f == null) {
    const k = b(c)
    e = k.x,
      f = k.y
  }
  let l = 0,
    m = [],
    n = []
  c.forEach(function (a) {
    d.nodeDiameter == null ? (a.diameter && (h = a.diameter), h = a.radius ? 2 * a.radius : Math.sqrt(2 * a.width * a.height), n.push(h)) : n.push(h),
      l += h
  }),
    c.forEach(function (a, b) {
      const c = n[b] / l
      m.push(Math.PI * c)
    })
  let o = (c.length, m[0] + m[1]),
    p = n[0] / 2 + n[1] / 2,
    q = p / 2 / Math.sin(o / 2)
  g != null && g > q && (q = g)
  let r = q * i,
    s = q * j,
    t = d.animate
  if (t) {
    let u = t.time || 1e3,
      v = 0
    c.forEach(function (b, c) {
      v += c == 0 ? m[c] : m[c - 1] + m[c]
      let d = e + Math.cos(v) * r,
        g = f + Math.sin(v) * s
      JTopo.Animate.stepByStep(b, {
        x: d - b.width / 2,
        y: g - b.height / 2
      }, u).start()
    })
  } else {
    let v = 0
    c.forEach(function (a, b) {
      v += b == 0 ? m[b] : m[b - 1] + m[b]
      let c = e + Math.cos(v) * r,
        d = f + Math.sin(v) * s
      a.cx = c,
        a.cy = d
    })
  }
  return {
    cx: e,
    cy: f,
    radius: r,
    radiusA: r,
    radiusB: s
  }
}
function GridLayout(a, b) {
  return function (c) {
    const d = c.childs
    if (!(d.length <= 0)) {
      for (let e = c.getBound(), f = d[0], g = (e.width - f.width) / b, h = (e.height - f.height) / a, i = (d.length, 0), j = 0; a > j; j++) {
        for (let k = 0; b > k; k++) {
          let l = d[i++],
            m = e.left + g / 2 + k * g,
            n = e.top + h / 2 + j * h
          if (l.setLocation(m, n), i >= d.length) { return }
        }
      }
    }
  }
}
function FlowLayout(a, b) {
  return a == null && (a = 0),
    b == null && (b = 0),
    function (c) {
      const d = c.childs
      if (!(d.length <= 0)) {
        for (let e = c.getBound(), f = e.left, g = e.top, h = 0; h < d.length; h++) {
          const i = d[h]
          f + i.width >= e.right && (f = e.left, g += b + i.height),
            i.setLocation(f, g),
            f += a + i.width
        }
      }
    }
}
function AutoBoundLayout() {
  return function (a, b) {
    if (b.length > 0) {
      for (let c = 1e7, d = -1e7, e = 1e7, f = -1e7, g = d - c, h = f - e, i = 0; i < b.length; i++) {
        const j = b[i]
        j.x <= c && (c = j.x),
          j.x >= d && (d = j.x),
          j.y <= e && (e = j.y),
          j.y >= f && (f = j.y),
          g = d - c + j.width,
          h = f - e + j.height
      }
      a.x = c,
        a.y = e,
        a.width = g,
        a.height = h
    }
  }
}
function getRootNodes(b) {
  let c = [],
    d = b.filter(function (b) {
      return b instanceof JTopo.Link ? true : (c.push(b), false)
    })
  return b = c.filter(function (a) {
    for (let b = 0; b < d.length; b++) {
      if (d[b].nodeZ === a) {
        return false
      }
    }
    return true
  }),
    b = b.filter(function (a) {
      for (let b = 0; b < d.length; b++) {
        if (d[b].nodeA === a) {
          return true
        }
      }
      return false
    })
}
function h(a) {
  let b = 0,
    c = 0
  return a.forEach(function (a) {
    b += a.width,
      c += a.height
  }), {
      width: b / a.length,
      height: c / a.length
    }
}
function i(a, b, c, d) {
  b.x += c,
    b.y += d
  for (let e = getNodeChilds(a, b), f = 0; f < e.length; f++) { i(a, e[f], c, d) }
}
function j(a, b) {
  function c(b, e) {
    const f = getNodeChilds(a, b)
    d[e] == null && (d[e] = {}, d[e].nodes = [], d[e].childs = []),
      d[e].nodes.push(b),
      d[e].childs.push(f)
    for (let g = 0; g < f.length; g++) { c(f[g], e + 1), f[g].parent = b }
  }
  const d = []
  return c(b, 0),
    d
}
function TreeLayout(b, c, d) {
  return function (e) {
    function f(f, g) {
      for (let h = JTopo.layout.getTreeDeep(f, g), k = j(f, g), l = k['' + h].nodes, m = 0; m < l.length; m++) {
        let n = l[m],
          o = (m + 1) * (c + 10),
          p = h * d
        b == 'down' || (b == 'up' ? p = -p : b == 'left' ? (o = -h * d, p = (m + 1) * (c + 10)) : b == 'right' && (o = h * d, p = (m + 1) * (c + 10))),
          n.setLocation(o, p)
      }
      for (let q = h - 1; q >= 0; q--) {
        for (let r = k['' + q].nodes, s = k['' + q].childs, m = 0; m < r.length; m++) {
          let t = r[m],
            u = s[m]
          if (b == 'down' ? t.y = q * d : b == 'up' ? t.y = -q * d : b == 'left' ? t.x = -q * d : b == 'right' && (t.x = q * d), u.length > 0 ? b == 'down' || b == 'up' ? t.x = (u[0].x + u[u.length - 1].x) / 2 : (b == 'left' || b == 'right') && (t.y = (u[0].y + u[u.length - 1].y) / 2) : m > 0 && (b == 'down' || b == 'up' ? t.x = r[m - 1].x + r[m - 1].width + c : (b == 'left' || b == 'right') && (t.y = r[m - 1].y + r[m - 1].height + c)), m > 0) {
            if (b == 'down' || b == 'up') {
              if (t.x < r[m - 1].x + r[m - 1].width) {
                for (let v = r[m - 1].x + r[m - 1].width + c, w = Math.abs(v - t.x), x = m; x < r.length; x++) { i(e.childs, r[x], w, 0) }
              }
            } else if ((b == 'left' || b == 'right') && t.y < r[m - 1].y + r[m - 1].height) {
              for (let y = r[m - 1].y + r[m - 1].height + c, z = Math.abs(y - t.y), x = m; x < r.length; x++) { i(e.childs, r[x], 0, z) }
            }
          }
        }
      }
    }
    let g = null
    c == null && (g = h(e.childs), c = g.width, (b == 'left' || b == 'right') && (c = g.width + 10)),
      d == null && (g == null && (g = h(e.childs)), d = 2 * g.height),
      b == null && (b = 'down')
    const k = JTopo.layout.getRootNodes(e.childs)
    if (k.length > 0) {
      f(e.childs, k[0])
      let l = JTopo.util.getElementsBound(e.childs),
        m = e.getCenterLocation(),
        n = m.x - (l.left + l.right) / 2,
        o = m.y - (l.top + l.bottom) / 2
      e.childs.forEach(function (b) {
        b instanceof JTopo.Node && (b.x += n, b.y += o)
      })
    }
  }
}
function CircleLayout(b) {
  return function (c) {
    function d(a, c, e) {
      const f = q(a, c)
      if (f.length != 0) {
        e == null && (e = b)
        const g = 2 * Math.PI / f.length
        f.forEach(function (b, f) {
          let h = c.x + e * Math.cos(g * f),
            i = c.y + e * Math.sin(g * f)
          b.setLocation(h, i)
          const j = e / 2
          d(a, b, j)
        })
      }
    }
    const e = JTopo.layout.getRootNodes(c.childs)
    if (e.length > 0) {
      d(c.childs, e[0])
      let f = JTopo.util.getElementsBound(c.childs),
        g = c.getCenterLocation(),
        h = g.x - (f.left + f.right) / 2,
        i = g.y - (f.top + f.bottom) / 2
      c.childs.forEach(function (b) {
        b instanceof JTopo.Node && (b.x += h, b.y += i)
      })
    }
  }
}
function n(a, b, c, d, e, f) {
  let g = e || 0,
    h = f || 2 * Math.PI,
    i = h - g,
    j = i / c,
    k = []
  g += j / 2
  for (let l = g; h >= l; l += j) {
    let m = a + Math.cos(l) * d,
      n = b + Math.sin(l) * d
    k.push({
      x: m,
      y: n
    })
  }
  return k
}
function o(a, b, c, d, e, f) {
  let g = f || 'bottom',
    h = []
  if (g == 'bottom') {
    for (let i = a - c / 2 * d + d / 2, j = 0; c >= j; j++) {
      h.push({
        x: i + j * d,
        y: b + e
      })
    }
  } else if (g == 'top') {
    for (let i = a - c / 2 * d + d / 2, j = 0; c >= j; j++) {
      h.push({
        x: i + j * d,
        y: b - e
      })
    }
  } else if (g == 'right') {
    for (let i = b - c / 2 * d + d / 2, j = 0; c >= j; j++) {
      h.push({
        x: a + e,
        y: i + j * d
      })
    }
  } else if (g == 'left') {
    for (let i = b - c / 2 * d + d / 2, j = 0; c >= j; j++) {
      h.push({
        x: a - e,
        y: i + j * d
      })
    }
  }
  return h
}
function m(a, b, c, d, e, f) {
  for (let g = [], h = 0; c > h; h++) {
    for (let i = 0; d > i; i++) {
      g.push({
        x: a + i * e,
        y: b + h * f
      })
    }
  }
  return g
}
function adjustPosition(a, b) {
  if (a.layout) {
    let c = a.layout,
      d = c.type,
      e = null
    if (d == 'circle') {
      const f = c.radius || Math.max(a.width, a.height)
      e = n(a.cx, a.cy, b.length, f, a.layout.beginAngle, a.layout.endAngle)
    } else if (d == 'tree') {
      let g = c.width || 50,
        h = c.height || 50,
        i = c.direction
      e = o(a.cx, a.cy, b.length, g, h, i)
    } else {
      if (d != 'grid') { return }
      e = m(a.x, a.y, c.rows, c.cols, c.horizontal || 0, c.vertical || 0)
    }
    for (let j = 0; j < b.length; j++) { b[j].setCenterLocation(e[j].x, e[j].y) }
  }
}
function getNodeChilds(b, c) {
  let d = []
  for (let e = 0; e < b.length; e++) { b[e] instanceof JTopo.Link && b[e].nodeA === c && d.push(b[e].nodeZ) }
  return d
}
function layoutNode(a, b, c) {
  const d = getNodeChilds(a.childs, b)
  if (d.length == 0) { return null }
  if (adjustPosition(b, d), c == 1) {
    for (let e = 0; e < d.length; e++) { layoutNode(a, d[e], c) }
  }
  return null
}
function springLayout(b, c) {
  function d(a, b) {
    let c = a.x - b.x,
      d = a.y - b.y
    i += c * f,
      j += d * f,
      i *= g,
      j *= g,
      j += h,
      b.x += i,
      b.y += j
  }
  function e() {
    if (!(++k > 150)) {
      for (let a = 0; a < l.length; a++) { l[a] != b && d(b, l[a], l) }
      setTimeout(e, 1e3 / 24)
    }
  }
  let f = 0.01,
    g = 0.95,
    h = -5,
    i = 0,
    j = 0,
    k = 0,
    l = c.getElementsByClass(JTopo.Node)
  e()
}
function getTreeDeep(a, b) {
  function c(a, b, e) {
    const f = getNodeChilds(a, b)
    e > d && (d = e)
    for (let g = 0; g < f.length; g++) { c(a, f[g], e + 1) }
  }
  let d = 0
  return c(a, b, 0),
    d
}
function FixedBoundLayout() {
  return function (a, b) {
    if (b.length > 0) {
      bound = a.getBound()
      for (i = 0; i < b.length; i++) {
        const j = b[i]
        let x = j.x, y = j.y;
        (j.x + j.width > bound.right) && (x = bound.right - j.width);
        (j.x < bound.left) && (x = bound.left);
        (j.y < bound.top) && (y = bound.top);
        (j.y + j.height > bound.bottom) && (y = bound.bottom - j.height)

        j.setLocation(x, y)
      }
    }
  }
}

const layout = {
  layoutNode: layoutNode,
  getNodeChilds: getNodeChilds,
  adjustPosition: adjustPosition,
  springLayout: springLayout,
  getTreeDeep: getTreeDeep,
  getRootNodes: getRootNodes,
  GridLayout: GridLayout,
  FlowLayout: FlowLayout,
  AutoBoundLayout: AutoBoundLayout,
  FixedBoundLayout: FixedBoundLayout,
  CircleLayout: CircleLayout,
  TreeLayout: TreeLayout,
  getNodesCenter: getNodesCenter,
  circleLayoutNodes: circleLayoutNodes
}

export default layout
