var nodes = []

function drawNodes() {
  nodeData.forEach(nd => {
    const node = new DeviceNode(nd)
    node.addTo(scene)
    // node.addTo(container, true)
    nodes.push(node)
  })
}

drawNodes()

function drawLinks() {
  linkData.forEach(ld => {
    const link = new DeviceLink(nodes[0], nodes[1], ld)
    link.addTo(scene)
  })
}

drawLinks()
