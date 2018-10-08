# README

## changes

### createStageFromJson

createStageFromJson(josnStr, canvas) ==> createStageFromJson(jsonObj, canvas)

### oncontextmenu

stage scene 暴露右键菜单事件 oncontextmenu ，通过 DOM 3 实现，IE9以下不兼容

修复在画布偶尔会弹出原生右键菜单问题
