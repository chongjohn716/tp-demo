(function (window, undefined) {

  const borderWidth = 1

  var cornerSize = 1
  var cornerLength = 16
  var baseZIndex = 100
  var labelNodeZIndex = 100
  var labelTextZIndex = 100

  var containerSetLoction = JTopo.Container.prototype.setLocation

  function DeviceNode(opiton) {
    this.initialize(opiton)
  }

  JTopo.extend(DeviceNode, JTopo.Node)

  DeviceNode.prototype.initialize = function (opiton) {
    this.constructor.super.initialize.call(this, opiton.text)


    this.setBound(
      opiton.x + borderWidth,
      opiton.y + borderWidth,
      opiton.width - borderWidth * 2,
      opiton.height - borderWidth * 2
    )

    this.textPosition = "Middle_Center"
    this.borderWidth = borderWidth
    this.borderColor = '0,0,0'
    this.fillColor = '255,255,255'
    this.fontColor = '20,20,20'
    this.zIndex = baseZIndex

    this.setLocation = containerSetLoction

    this.createChilds(opiton)
  }

  DeviceNode.prototype.addTo = function (con, selfOnly) {
    con.add(this)

    if (selfOnly === true) {
      return
    }

    this.childs.forEach(child => {
      con.add(child)
    })
  }

  DeviceNode.prototype.createChilds = function (opiton) {
    this.childs = createChildNodes(opiton)
  }

  function createChildNodes({
    x, y, height, width
  }) {

    let nodes = []

    height -= borderWidth
    width -= borderWidth

    let corners = [
      [x, y - cornerLength - 4, cornerSize, cornerLength],
      [x + width, y - cornerLength - 4, cornerSize, cornerLength],
      [x - cornerLength - 4, y, cornerLength, cornerSize],
      [x - cornerLength - 4, y + height, cornerLength, cornerSize]
    ]

    corners.forEach(([x, y, width, height]) => {
      let corner = new JTopo.Node()

      corner.setBound(x, y, width, height)
      corner.dragable = false
      corner.zIndex = labelNodeZIndex

      nodes.push(corner)
    })

    nodes.push(newLink(nodes[0], nodes[1]))
    nodes.push(newLink(nodes[2], nodes[3]))

    nodes.push(addLabel(x - cornerLength / 2 - 12, y + height / 2, 270 * Math.PI / 180, '' + height))
    nodes.push(addLabel(x + width / 2, y - 12, 0, '' + width))

    return nodes
  }


  function addLabel(x, y, rote, text) {
    var textNode = new JTopo.TextNode(text);
    textNode.setCenterLocation(x, y);
    textNode.fontColor = '0,0,0'
    rote && (textNode.rotate = rote)
    textNode.zIndex = labelTextZIndex
    textNode.dragable = false

    return textNode
  }

  function newLink(nodeA, nodeZ) {
    var link = new JTopo.Link(nodeA, nodeZ);
    link.lineWidth = 1; // 线宽
    link.arrowsRadius = 8; // 线宽
    link.strokeColor = '0,200,255';
    link.fontColor = '0,0,0';
    link.zIndex = labelTextZIndex;

    return link;
  }

  window.DeviceNode = DeviceNode

}(window))
