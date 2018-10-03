import Stage from './stage'
import Scene from './scene'
import Node from './nodes/node'

export const noop = a => a

let e = 'click,mousedown,mouseup,mouseover,mouseout,mousedrag,keydown,keyup'.split(',')

function b(a, b) {
  let c = []
  if (a.length === 0) { return c }
  let d = b.match(/^\s*(\w+)\s*$/)
  if (d != null) {
    const e = a.filter(function (a) {
      return a.elementType === d[1]
    })
    e != null && e.length > 0 && (c = c.concat(e))
  } else {
    let f = false
    d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*\]\s*/)
    if (d == null || d.length < 5) {
      d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*\]\s*/)
      f = true
    }
    if (d != null && d.length >= 5) {
      const g = d[1]
      const h = d[2]
      const i = d[3]
      const j = d[4]
      e = a.filter(function (a) {
        if (a.elementType !== g) {
          return false
        }
        let b = a[h]
        f && (b = parseInt(b))
        return i === '=' ? b === j : i === '>' ? b > j : i === '<' ? j > b : i === '<=' ? j >= b : i === '>=' ? b >= j : i === '!=' ? b !== j : false
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
      for (let c = 0; c < this.length; c++) { this[c][b](a) }
      return this
    }
  })
  if (a.length > 0) {
    const b = a[0]
    for (const c in b) {
      const f = b[c]
      typeof f === 'function' && !(function (b) {
        a[c] = function () {
          for (let c = [], d = 0; d < a.length; d++) { c.push(b.apply(a[d], arguments)) }
          return c
        }
      }(f))
    }
  }
  a.attr = function (a, b) {
    let c, d, e
    if (a != null && b != null) {
      for (c = 0; c < this.length; c++) { this[c][a] = b }
    } else {
      if (a != null && typeof a === 'string') {
        for (d = [], c = 0; c < this.length; c++) { d.push(this[c][a]) }
        return d
      }
      if (a != null) {
        for (c = 0; c < this.length; c++) {
          for (e in a) { this[c][e] = a[e] }
        }
      }
    }
    return this
  }
  return a
}

export const find = function find(d) {
  let e = []
  let f = []
  this instanceof Stage ? (e = this.childs, f = f.concat(e)) : this instanceof Scene ? e = [this] : f = this
  e.forEach(function (a) {
    f = f.concat(a.childs)
  })
  let g = null
  g = typeof d === 'function' ? f.filter(d) : b(f, d)
  return c(g)
}

export function loadStageFromJson(json, canvas) {
  const obj = eval(json)
  const stage = new Stage(canvas)

  for (let k in stageObj) {
    if (k != 'scenes') { stage[k] = obj[k] } else {
      for (let scenes = obj.scenes, i = 0; i < scenes.length; i++) {
        let sceneObj = scenes[i],
          scene = new Scene(stage)
        for (let p in sceneObj) {
          if (p != 'elements') { scene[p] = sceneObj[p] } else {
            for (let nodeMap = {}, elements = sceneObj.elements, m = 0; m < elements.length; m++) {
              let elementObj = elements[m],
                type = elementObj.elementType,
                element
              type == 'Node' && (element = new Node())
              for (let mk in elementObj) { element[mk] = elementObj[mk] }
              nodeMap[element.text] = element,
                scene.add(element)
            }
          }
        }
      }
    }
  }
  return stage
}
