import Node from '../nodes/node'

export default function BarChartNode() {
  var b = new Node()
  return b.showSelected = !1,
  b.width = 250,
  b.height = 180,
  b.colors = ['#3666B0', '#2CA8E0', '#77D1F6'],
  b.datas = [0.3, 0.3, 0.4],
  b.titles = ['A', 'B', 'C'],
  b.paint = function (a) {
    var c = 3,
      d = (this.width - c) / this.datas.length
    a.save(),
    a.beginPath(),
    a.fillStyle = '#FFFFFF',
    a.strokeStyle = '#FFFFFF',
    a.moveTo(-this.width / 2 - 1, -this.height / 2),
    a.lineTo(-this.width / 2 - 1, this.height / 2 + 3),
    a.lineTo(this.width / 2 + c + 1, this.height / 2 + 3),
    a.stroke(),
    a.closePath(),
    a.restore()
    for (var e = 0; e < this.datas.length; e++) {
      a.save(),
      a.beginPath(),
      a.fillStyle = b.colors[e]
      var f = this.datas[e],
        g = e * (d + c) - this.width / 2,
        h = this.height - f - this.height / 2
      a.fillRect(g, h, d, f)
      var i = '' + parseInt(this.datas[e]),
        j = a.measureText(i).width,
        k = a.measureText('田').width
      a.fillStyle = '#FFFFFF',
      a.fillText(i, g + (d - j) / 2, h - k),
      a.fillText(this.titles[e], g + (d - j) / 2, this.height / 2 + k),
      a.fill(),
      a.closePath(),
      a.restore()
    }
  },
  b
}
