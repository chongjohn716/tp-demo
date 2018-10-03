import CircleNode from '../nodes/circle-node'

export default function PieChartNode() {
  var b = new CircleNode()
  return b.radius = 150,
  b.colors = ['#3666B0', '#2CA8E0', '#77D1F6'],
  b.datas = [0.3, 0.3, 0.4],
  b.titles = ['A', 'B', 'C'],
  b.paint = function (a) {
    var c = 2 * b.radius,
      d = 2 * b.radius
    b.width = c,
    b.height = d
    for (var e = 0, f = 0; f < this.datas.length; f++) {
      var g = this.datas[f] * Math.PI * 2
      a.save(),
      a.beginPath(),
      a.fillStyle = b.colors[f],
      a.moveTo(0, 0),
      a.arc(0, 0, this.radius, e, e + g, !1),
      a.fill(),
      a.closePath(),
      a.restore(),
      a.beginPath(),
      a.font = this.font
      var h = this.titles[f] + ': ' + (100 * this.datas[f]).toFixed(2) + '%',
        i = a.measureText(h).width,
        j = (a.measureText('田').width, (e + e + g) / 2),
        k = this.radius * Math.cos(j),
        l = this.radius * Math.sin(j)
      j > Math.PI / 2 && j <= Math.PI ? k -= i : j > Math.PI && j < 2 * Math.PI * 3 / 4 ? k -= i : j > 2 * Math.PI * 0.75,
      a.fillStyle = '#FFFFFF',
      a.fillText(h, k, l),
      a.moveTo(this.radius * Math.cos(j), this.radius * Math.sin(j)),
      j > Math.PI / 2 && j < 2 * Math.PI * 3 / 4 && (k -= i),
      j > Math.PI,
      a.fill(),
      a.stroke(),
      a.closePath(),
      e += g
    }
  },
  b
}
