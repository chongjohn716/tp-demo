import util from './util'
import MessageBus from './message-bus'
import { version } from './const'
import { find } from './common'
import { del } from './extend-native'

function createEagleEye(a) {
  return {
    hgap: 16,
    visible: false,
    exportCanvas: document.createElement('canvas'),
    getImage: function (b, c) {
      const d = a.getBound()
      let e = 1
      let f = 1
      this.exportCanvas.width = a.canvas.width
      this.exportCanvas.height = a.canvas.height
      b != null && c != null ? (this.exportCanvas.width = b, this.exportCanvas.height = c, e = b / d.width, f = c / d.height) : (d.width > a.canvas.width && (this.exportCanvas.width = d.width), d.height > a.canvas.height && (this.exportCanvas.height = d.height))
      const g = this.exportCanvas.getContext('2d')
      a.childs.length > 0 && (g.save(), g.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height), a.childs.forEach(function (a) {
        a.visible && (a.save(), a.translateX = 0, a.translateY = 0, a.scaleX = 1, a.scaleY = 1, g.scale(e, f), d.left < 0 && (a.translateX = Math.abs(d.left)), d.top < 0 && (a.translateY = Math.abs(d.top)), a.paintAll = true, a.repaint(g), a.paintAll = false, a.restore())
      }), g.restore())
      return this.exportCanvas.toDataURL('image/png')
    },
    canvas: document.createElement('canvas'),
    update: function () {
      this.eagleImageDatas = this.getData(a)
    },
    setSize: function (a, b) {
      this.width = this.canvas.width = a
      this.height = this.canvas.height = b
    },
    getData: function (b, c) {
      function d(a) {
        const b = a.stage.canvas.width
        const c = a.stage.canvas.height
        const d = b / a.scaleX / 2
        const e = c / a.scaleY / 2
        return {
          translateX: a.translateX + d - d * a.scaleX,
          translateY: a.translateY + e - e * a.scaleY
        }
      }
      // TODO: 这行执行不到
      // j != null && k != null ? this.setSize(b, c) : this.setSize(200, 160)
      const e = this.canvas.getContext('2d')
      if (a.childs.length > 0) {
        e.save()
        e.clearRect(0, 0, this.canvas.width, this.canvas.height)
        a.childs.forEach(function (a) {
          a.visible && (a.save(), a.centerAndZoom(null, null, e), a.repaint(e), a.restore())
        })
        const f = d(a.childs[0])
        let g = f.translateX * (this.canvas.width / a.canvas.width) * a.childs[0].scaleX
        let h = f.translateY * (this.canvas.height / a.canvas.height) * a.childs[0].scaleY
        const i = a.getBound()
        let j = a.canvas.width / a.childs[0].scaleX / i.width
        const k = a.canvas.height / a.childs[0].scaleY / i.height
        j > 1 && (j = 1)
        k > 1 && (j = 1)
        g *= j
        h *= k
        i.left < 0 && (g -= Math.abs(i.left) * (this.width / i.width))
        i.top < 0 && (h -= Math.abs(i.top) * (this.height / i.height))
        e.save()
        e.lineWidth = 1
        e.strokeStyle = 'rgba(255,0,0,1)'
        e.strokeRect(-g, -h, e.canvas.width * j, e.canvas.height * k)
        e.restore()
        let l = null
        try {
          l = e.getImageData(0, 0, e.canvas.width, e.canvas.height)
        } catch (m) { }
        return l
      }
      return null
    },
    paint: function () {
      if (this.eagleImageDatas != null) {
        const b = a.graphics
        b.save()
        b.fillStyle = 'rgba(211,211,211,0.3)'
        b.fillRect(a.canvas.width - this.canvas.width - 2 * this.hgap, a.canvas.height - this.canvas.height - 1, a.canvas.width - this.canvas.width, this.canvas.height + 1)
        b.fill()
        b.save()
        b.lineWidth = 1
        b.strokeStyle = 'rgba(0,0,0,1)'
        b.rect(a.canvas.width - this.canvas.width - 2 * this.hgap, a.canvas.height - this.canvas.height - 1, a.canvas.width - this.canvas.width, this.canvas.height + 1)
        b.stroke()
        b.restore()
        b.putImageData(this.eagleImageDatas, a.canvas.width - this.canvas.width - this.hgap, a.canvas.height - this.canvas.height)
        b.restore()
      } else { this.eagleImageDatas = this.getData(a) }
    },
    eventHandler: function (a, b, c) {
      let d = b.x
      let e = b.y
      if (d > c.canvas.width - this.canvas.width && e > c.canvas.height - this.canvas.height) {
        d = b.x - this.canvas.width
        e = b.y - this.canvas.height
        a === 'mousedown' && (this.lastTranslateX = c.childs[0].translateX, this.lastTranslateY = c.childs[0].translateY)
        if (a === 'mousedrag' && c.childs.length > 0) {
          const f = b.dx
          const g = b.dy
          const h = c.getBound()
          const i = this.canvas.width / c.childs[0].scaleX / h.width
          const j = this.canvas.height / c.childs[0].scaleY / h.height
          c.childs[0].translateX = this.lastTranslateX - f / i
          c.childs[0].translateY = this.lastTranslateY - g / j
        }
      }
    }
  }
}

function Stage(c) {
  // TODO:
  // JTopo.stage = this
  const n = this

  c != null && this.initialize(c)

  const q = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup'.split(',')

  q.forEach((a) => {
    this[a] = function (b) {
      b != null ? this.addEventListener(a, b) : this.dispatchEvent(a)
    }
  });

  (function frameLoop() {
    n.frames === 0
      ? setTimeout(frameLoop, 100)
      : n.frames < 0
        ? (n.repaint(), setTimeout(frameLoop, 1e3 / -n.frames))
        : (n.repaint(), setTimeout(frameLoop, 1e3 / n.frames))
  }())

  setTimeout(function () {
    n.mousewheel(function (a) {
      const b = a.wheelDelta == null ? a.detail : a.wheelDelta
      this.wheelZoom != null && (b > 0 ? this.zoomIn(this.wheelZoom) : this.zoomOut(this.wheelZoom))
    })
    n.paint()
  }, 300)

  setTimeout(function () {
    n.paint()
  }, 1e3)

  setTimeout(function () {
    n.paint()
  }, 3e3)
}

Stage.prototype.initialize = function (c) {
  this.bindEvent(c)
  this.canvas = c
  this.graphics = c.getContext('2d')
  this.childs = []
  this.frames = 24
  this.messageBus = new MessageBus()
  this.eagleEye = createEagleEye(this)
  this.wheelZoom = null
  this.mouseDownX = 0
  this.mouseDownY = 0
  this.mouseDown = false
  this.mouseOver = false
  this.needRepaint = true
  this.serializedProperties = ['frames', 'wheelZoom']
}

// TODO:
Stage.prototype.bindEvent = function (c) {
  const n = this
  let o = true
  let p = null

  function d(b) {
    const c = util.getEventPosition(b)
    const d = util.getOffsetPosition(n.canvas)

    c.offsetLeft = c.pageX - d.left
    c.offsetTop = c.pageY - d.top
    c.x = c.offsetLeft
    c.y = c.offsetTop
    c.target = null
    return c
  }

  function e(a) {
    document.onselectstart = function () {
      return false
    }
    this.mouseOver = true
    const b = d(a)
    n.dispatchEventToScenes('mouseover', b)
    n.dispatchEvent('mouseover', b)
  }

  function f(a) {
    p = setTimeout(function () {
      o = true
    }, 500)
    document.onselectstart = function () {
      return true
    }
    const b = d(a)
    n.dispatchEventToScenes('mouseout', b)
    n.dispatchEvent('mouseout', b)
    // TODO: animate 值类型
    n.needRepaint = n.animate != 0
  }

  function g(a) {
    const b = d(a)
    n.mouseDown = true
    n.mouseDownX = b.x
    n.mouseDownY = b.y
    n.dispatchEventToScenes('mousedown', b)
    n.dispatchEvent('mousedown', b)
  }

  function h(a) {
    const b = d(a)
    n.dispatchEventToScenes('mouseup', b)
    n.dispatchEvent('mouseup', b)
    n.mouseDown = false
    // TODO: animate 值类型
    n.needRepaint = n.animate != 0
  }

  function i(a) {
    p && (window.clearTimeout(p), p = null)
    o = false
    const b = d(a)
    n.mouseDown ? a.button == 0 && (b.dx = b.x - n.mouseDownX, b.dy = b.y - n.mouseDownY, n.dispatchEventToScenes('mousedrag', b), n.dispatchEvent('mousedrag', b), n.eagleEye.visible && n.eagleEye.update()) : (n.dispatchEventToScenes('mousemove', b), n.dispatchEvent('mousemove', b))
  }

  function j(a) {
    const b = d(a)
    n.dispatchEventToScenes('click', b)
    n.dispatchEvent('click', b)
  }

  function k(a) {
    const b = d(a)
    n.dispatchEventToScenes('dbclick', b)
    n.dispatchEvent('dbclick', b)
  }

  function l(a) {
    const b = d(a)
    n.dispatchEventToScenes('mousewheel', b)
    n.dispatchEvent('mousewheel', b)
    n.wheelZoom != null && (a.preventDefault ? a.preventDefault() : (a = a || window.event, a.returnValue = false), n.eagleEye.visible && n.eagleEye.update())
  }

  function m(b) {
    util.isIE || !window.addEventListener ? (b.onmouseout = f, b.onmouseover = e, b.onmousedown = g, b.onmouseup = h, b.onmousemove = i, b.onclick = j, b.ondblclick = k, b.onmousewheel = l, b.touchstart = g, b.touchmove = i, b.touchend = h) : (b.addEventListener('mouseout', f), b.addEventListener('mouseover', e), b.addEventListener('mousedown', g), b.addEventListener('mouseup', h), b.addEventListener('mousemove', i), b.addEventListener('click', j), b.addEventListener('dblclick', k), util.isFirefox ? b.addEventListener('DOMMouseScroll', l) : b.addEventListener('mousewheel', l))
    window.addEventListener && (window.addEventListener('keydown', function (b) {
      n.dispatchEventToScenes('keydown', util.cloneEvent(b))
      const c = b.keyCode;
      (c === 37 || c === 38 || c === 39 || c === 40) && (b.preventDefault ? b.preventDefault() : (b = b || window.event, b.returnValue = false))
    }, true), window.addEventListener('keyup', function (b) {
      n.dispatchEventToScenes('keyup', util.cloneEvent(b))
      const c = b.keyCode;
      (c === 37 || c === 38 || c === 39 || c === 40) && (b.preventDefault ? b.preventDefault() : (b = b || window.event, b.returnValue = false))
    }, true))
  }

  document.oncontextmenu = function () {
    return o
  }

  m(c)
}

Stage.prototype.dispatchEventToScenes = function (a, b) {
  this.frames !== 0 && (this.needRepaint = true)
  if (this.eagleEye.visible && a.indexOf('mouse') !== -1) {
    const c = b.x
    const d = b.y
    if (c > this.width - this.eagleEye.width && d > this.height - this.eagleEye.height) { return void this.eagleEye.eventHandler(a, b, this) }
  }
  this.childs.forEach(function (c) {
    if (c.visible) {
      const d = c[a + 'Handler']
      if (d == null) { throw new Error('Function not found:' + a + 'Handler') }
      d.call(c, b)
    }
  })
}

Stage.prototype.add = function (a) {
  for (let b = 0; b < this.childs.length; b++) {
    if (this.childs[b] === a) { return }
  }
  a.addTo(this)
  this.childs.push(a)
}

Stage.prototype.remove = function (a) {
  if (a == null) { throw new Error('Stage.remove出错: 参数为null!') }
  for (let b = 0; b < this.childs.length; b++) {
    if (this.childs[b] === a) {
      a.stage = null
      this.childs = del.call(this.childs, b)
      return this
    }
  }
  return this
}

Stage.prototype.clear = function () {
  this.childs = []
}

Stage.prototype.addEventListener = function (a, b) {
  const c = this
  const d = function (a) {
    b.call(c, a)
  }

  this.messageBus.subscribe(a, d)

  return this
}

Stage.prototype.removeEventListener = function (a) {
  this.messageBus.unsubscribe(a)
}

Stage.prototype.removeAllEventListener = function () {
  this.messageBus = new MessageBus()
}

Stage.prototype.dispatchEvent = function (a, b) {
  this.messageBus.publish(a, b)
  return this
}

Stage.prototype.saveImageInfo = function (a, b) {
  const c = this.eagleEye.getImage(a, b)
  const d = window.open('about:blank')
  d.document.write("<img src='" + c + "' alt='from canvas'/>")
  return this
}

Stage.prototype.saveAsLocalImage = function (a, b) {
  const c = this.eagleEye.getImage(a, b)
  c.replace('image/png', 'image/octet-stream')
  window.location.href = c
  return this
}

Stage.prototype.paint = function () {
  if (!this.canvas) {
    return
  }
  const graphics = this.graphics
  graphics.save()
  graphics.clearRect(0, 0, this.width, this.height)
  this.childs.forEach(function (a) {
    a.visible && a.repaint(graphics)
  })
  this.eagleEye.visible && this.eagleEye.paint(this)
  graphics.restore()
}

Stage.prototype.repaint = function () {
  this.frames !== 0 && (this.frames < 0 && this.needRepaint || (this.paint(), this.frames < 0 && (this.needRepaint = false)))
}

Stage.prototype.zoom = function (a) {
  this.childs.forEach(function (b) {
    b.visible && b.zoom(a)
  })
}

Stage.prototype.zoomOut = function (a) {
  this.childs.forEach(function (b) {
    b.visible && b.zoomOut(a)
  })
}

Stage.prototype.zoomIn = function (a) {
  this.childs.forEach(function (b) {
    b.visible && b.zoomIn(a)
  })
}

Stage.prototype.centerAndZoom = function () {
  this.childs.forEach(function (a) {
    a.visible && a.centerAndZoom()
  })
}

Stage.prototype.setCenter = function (a, b) {
  const c = this
  this.childs.forEach(function (d) {
    const e = a - c.canvas.width / 2
    const f = b - c.canvas.height / 2
    d.translateX = -e
    d.translateY = -f
  })
}

Stage.prototype.getBound = function () {
  const a = {
    left: Number.MAX_VALUE,
    right: Number.MIN_VALUE,
    top: Number.MAX_VALUE,
    bottom: Number.MIN_VALUE
  }
  this.childs.forEach(function (b) {
    const c = b.getElementsBound()
    c.left < a.left && (a.left = c.left, a.leftNode = c.leftNode)
    c.top < a.top && (a.top = c.top, a.topNode = c.topNode)
    c.right > a.right && (a.right = c.right, a.rightNode = c.rightNode)
    c.bottom > a.bottom && (a.bottom = c.bottom, a.bottomNode = c.bottomNode)
  })
  a.width = a.right - a.left
  a.height = a.bottom - a.top
  return a
}

Stage.prototype.toJson = function () {
  const b = this
  let c = '{"version":"' + version + '",'
  // this.serializedProperties.length

  this.serializedProperties.forEach(function (a) {
    let d = b[a]
    typeof d === 'string' && (d = '"' + d + '"')
    c += '"' + a + '":' + d + ','
  })

  c += '"childs":['

  this.childs.forEach(function (a) {
    c += a.toJson()
  })

  c += ']'
  c += '}'

  return c
}

Stage.prototype.find = find

Object.defineProperties(Stage.prototype, {
  width: {
    get() {
      return this.canvas.width
    }
  },

  height: {
    get() {
      return this.canvas.height
    }
  },

  cursor: {
    set(a) {
      this.canvas.style.cursor = a
    },
    get() {
      return this.canvas.style.cursor
    }
  },

  mode: {
    set(a) {
      this.childs.forEach(function (b) {
        b.mode = a
      })
    },
    get() {
      return this.childs.map(function (b) {
        return b.mode
      })
    }
  }
})

export default Stage
