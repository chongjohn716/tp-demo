var stage;
var canvas = document.getElementById('canvas');
stage = new JTopo.Stage(canvas);

//显示工具栏
showJTopoToobar(stage);

var scene = new JTopo.Scene();
stage.add(scene);

// 网格布局(4行3列)
var FixedBoundLayout = JTopo.layout.FixedBoundLayout(4, 3);

var container = new JTopo.Container('点击切换布局');
container.layout = FixedBoundLayout;
container.fillColor = '255,255,255';
container.borderWidth = 2;
container.borderColor = '255,0,0';

container.setBound(30, 20, 800, 700);
scene.add(container);

// for (var i = 0; i < 12; i++) {
//   var node = new JTopo.Node("F_" + i);
//   node.textPosition = "Middle_Center";
//   scene.add(node);
//   container.add(node);
// }

container.paintSelected = function () { }

stage.wheelZoom = 0.85

scene.addEventListener('click', function (e) {
  console.log(e.target)
})
