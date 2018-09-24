var cornerSize = 1
var cornerLength = 16
var nodeBorderWidth = 1
var baseZIndex = 1
var labelNodeZIndex = 100
var labelTextZIndex = 110

var nodes = []

function drawNodes() {
  nodeData.forEach(nd => {
    const node = drawNode(nd)
    drawNodeLabel(nd, node)
    nodes.push(node)
  })
}

function drawNode(data) {
  var node = new JTopo.Node(data.text);

  node.setBound(
    data.x + nodeBorderWidth,
    data.y + nodeBorderWidth,
    data.width - nodeBorderWidth * 2,
    data.height - nodeBorderWidth * 2
  )
  node.textPosition = "Middle_Center"
  node.borderWidth = nodeBorderWidth
  node.borderColor = '0,0,0'
  node.fillColor = '255,255,255'
  node.fontColor = '20,20,20'
  node.zIndex = baseZIndex
  node.setLocation = container.setLocation
  node.childs = []

  scene.add(node)
  container.add(node)

  return node
}

function drawNodeLabel({
  x, y, height, width
}, node) {
  height -= nodeBorderWidth
  width -= nodeBorderWidth

  let corners = [
    [x, y - cornerLength, cornerSize, cornerLength],
    [x + width, y - cornerLength, cornerSize, cornerLength],
    [x - cornerLength, y, cornerLength, cornerSize],
    [x - cornerLength, y + height, cornerLength, cornerSize]
  ]

  var nodes = corners.map(([x, y, width, height]) => {
    let corner = new JTopo.Node()

    corner.setBound(x, y, width, height)
    corner.dragable = false
    corner.zIndex = labelNodeZIndex

    scene.add(corner)
    node.childs.push(corner)
    return corner
  })

  addLabel(x + width / 2, y, node)
  addLabel(x - cornerLength / 2, y + height / 2, node, 270 * Math.PI / 180)

  newLink(nodes[0], nodes[1], '11', node)
  newLink(nodes[2], nodes[3], '11', node)
}

function addLabel(x, y, node, rote) {
  var textNode = new JTopo.TextNode('121m');
  textNode.setCenterLocation(x, y);
  textNode.fontColor = '0,0,0'
  rote && (textNode.rotate = rote)
  textNode.zIndex = labelTextZIndex
  textNode.dragable = false
  scene.add(textNode);
  node.childs.push(textNode)
}

function newLink(nodeA, nodeZ, text, node) {
  var link = new JTopo.Link(nodeA, nodeZ, text);
  link.lineWidth = 1; // 线宽
  link.arrowsRadius = 8; // 线宽
  link.strokeColor = '0,200,255';
  scene.add(link);
  node.childs.push(link)
  return link;
}

drawNodes()

function drawLinks() {
  linkData.forEach(ld => {
    const link = drawLink(ld)
  })
}

function drawLink(data) {
  const path = data.path
  var startNode = drawLinkPoint(path[0], nodes[0])
  var endNode = drawLinkPoint(path[1], nodes[1])

  newFoldLink(startNode, endNode, '123', 'vertical', 3)
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
    debugger
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

drawLinks()
