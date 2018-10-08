(function (window) {

  function DeviceLink(nodeA, nodeZ, option) {
    this.initialize(nodeA, nodeZ, option)
  }

  JTopo.extend(DeviceLink, JTopo.FoldLink)

  DeviceLink.prototype.initialize = function (nodeA, nodeZ, option) {
    const path = option.path
    const [na, nz] = [nodeA, nodeZ].map((parent, i) => {
      return createLinkPoint(path[i], parent)
    })

    this.constructor.super.initialize.call(this, na, nz, option.text)

    this.direction = 'horizontal';
    this.lineWidth = 1;                           // 线宽
    this.strokeColor = JTopo.util.randomColor();  // 线条颜色随机
    // link.dashedPattern = dashedPattern;
  }

  DeviceLink.prototype.setDirection = function (direction) {
    this.direction = direction
  }

  function setLoction(x, y) {
    let { left, right, top, bottom } = this.parent.getBound();

    const aa = 4;

    left = left - aa;
    right = right - aa;
    top = top - aa;
    bottom = bottom - aa;

    (x < left) && (x = left);
    (x > right) && (x = right);
    (y < top) && (y = top);
    (y > bottom) && (y = bottom);

    const x1 = x - left
    const x2 = right - x
    const y1 = y - top
    const y2 = bottom - y

    let minX, minXB
    if (x1 > x2) {
      minX = x2
      minXB = right
    } else {
      minX = x1
      minXB = left
    }

    let minY, minYB
    if (y1 > y2) {
      minY = y2
      minYB = bottom
    } else {
      minY = y1
      minYB = top
    }

    let nx, ny
    if (minX > minY) {
      nx = x
      ny = minYB
    } else {
      nx = minXB
      ny = y
    }

    this.originSetLoction(nx, ny)
  }

  function createLinkPoint({ x, y }, parent) {
    let node = new JTopo.CircleNode()
    node.radius = 4
    node.setLocation(x, y);

    // node.dragable = false
    node.zIndex = 120
    node.parent = parent
    node.originSetLoction = node.setLocation
    node.setLocation = setLoction

    parent.childs.push(node)

    return node
  }

  window.DeviceLink = DeviceLink

  DeviceLink.prototype.addTo = function (con) {
    con.add(this)
    con.add(this.nodeA)
    con.add(this.nodeZ)
  }

}(window))

