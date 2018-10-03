export default function (global = window) {
  /**
   * CanvasRenderingContext2D 扩展
   *
   */
  const CanvasRenderingContext2D = global.CanvasRenderingContext2D

  const ev = 5

  /**
   *
   * @param {*} a
   * @param {*} b
   * @param {*} c
   * @param {*} d
   * @param {*} e
   */
  CanvasRenderingContext2D.prototype.JTopoRoundRect = function (a, b, c, d, e = ev) {
    this.beginPath()
    this.moveTo(a + e, b)
    this.lineTo(a + c - e, b)
    this.quadraticCurveTo(a + c, b, a + c, b + e)
    this.lineTo(a + c, b + d - e)
    this.quadraticCurveTo(a + c, b + d, a + c - e, b + d)
    this.lineTo(a + e, b + d)
    this.quadraticCurveTo(a, b + d, a, b + d - e)
    this.lineTo(a, b + e)
    this.quadraticCurveTo(a, b, a + e, b)
    this.closePath()
  }

  /**
   *
   * @param {*} a
   * @param {*} b
   * @param {*} c
   * @param {*} d
   * @param {*} e
   */
  CanvasRenderingContext2D.prototype.JTopoDashedLineTo = function (a, b, c, d, e = ev) {
    const f = c - a
    const g = d - b
    const h = Math.floor(Math.sqrt(f * f + g * g))
    const i = e <= 0 ? h : h / e
    const j = g / h * e
    const k = f / h * e
    this.beginPath()
    for (let l = 0; i > l; l++) {
      l % 2 ? this.lineTo(a + l * k, b + l * j) : this.moveTo(a + l * k, b + l * j)
    }
    this.stroke()
  }

  // 兼容处理和扩展方法
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (a) {
    setTimeout(a, 1e3 / 24)
  }

  // 没用
  window.console || (window.console = {
    log: function () { },
    info: function () { },
    debug: function () { },
    warn: function () { },
    error: function () { }
  })
}
