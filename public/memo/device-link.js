function DeviceLink() {

}

JTopo.extend(DeviceLink, JTopo.Link)

DeviceLink.prototype.setDirection = function (direction) {
  this.link.direction = direction
}

function drawLink(data) {
  const path = data.path
  var startNode = drawLinkPoint(path[0], nodes[0])
  var endNode = drawLinkPoint(path[1], nodes[1])

  newFoldLink(startNode, endNode, '123', 'vertical')
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

function drawLinkPoint({ x, y }, parent) {
  let node = new JTopo.CircleNode()
  node.radius = 4
  node.setLocation(x, y);

  // node.dragable = false
  node.zIndex = 120
  node.parent = parent
  node.originSetLoction = node.setLocation
  node.setLocation = setLoction


  scene.add(node)
  parent.childs.push(node)
  return node
}

function newFoldLink(nodeA, nodeZ, text, direction, dashedPattern) {
  var link = new JTopo.FoldLink(nodeA, nodeZ, text);

  link.direction = direction || 'horizontal';
  link.lineWidth = 1;                           // 线宽
  link.strokeColor = JTopo.util.randomColor();  // 线条颜色随机
  link.dashedPattern = dashedPattern;

  scene.add(link);
  container.add(link)
  return link;
}