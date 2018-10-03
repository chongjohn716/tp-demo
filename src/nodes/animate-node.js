import util from '../util'
import Node from './node'

function G(a, b, c) {
  this.initialize()
  this.frameImages = a || []
  this.frameIndex = 0
  this.isStop = true
  const d = b || 1e3
  this.repeatPlay = false
  const e = this
  this.nextFrame = function () {
    if (!this.isStop && this.frameImages.length != null) {
      this.frameIndex++
      if (this.frameIndex >= this.frameImages.length) {
        if (!this.repeatPlay) { return }
        this.frameIndex = 0
      }
      this.setImage(this.frameImages[this.frameIndex], c)
      setTimeout(function () {
        e.nextFrame()
      }, d / a.length)
    }
  }
}

function H(a, b, c, d, e) {
  this.initialize()
  this.setImage(a)
  this.frameIndex = 0
  this.isPause = true
  this.repeatPlay = false
  const g = d || 1e3
  e = e || 0

  this.paint = function (a) {
    if (this.image) {
      const b = this.width
      const d = this.height
      a.save()
      a.beginPath()
      a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')'
      const f = (Math.floor(this.frameIndex / c) + e) * d
      const g = Math.floor(this.frameIndex % c) * b
      a.drawImage(this.image, g, f, b, d, -b / 2, -d / 2, b, d)
      a.fill()
      a.closePath()
      a.restore()
      this.paintText(a)
      this.paintBorder(a)
      this.paintCtrl(a)
      this.paintAlarmText(a)
    }
  }

  this.nextFrame = function () {
    if (!this.isStop) {
      this.frameIndex++
      if (this.frameIndex >= b * c) {
        if (!this.repeatPlay) { return }
        this.frameIndex = 0
      }
      setTimeout(() => {
        this.isStop || this.nextFrame()
      }, g / (b * c))
    }
  }
}

util.extend(G, Node)
util.extend(H, Node)

function AnimateNode() {
  let a = null
  a = arguments.length <= 3
    ? new G(arguments[0], arguments[1], arguments[2])
    : new H(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
  a.stop = function () {
    a.isStop = true
  }
  a.play = function () {
    a.isStop = false
    a.frameIndex = 0
    a.nextFrame()
  }
  return a
}

util.extend(AnimateNode, Node)

export default AnimateNode
