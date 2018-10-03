import extendNative from './extend-native'
import util from './util'

import Stage from './stage'
import Scene from './scene'

import Node from './nodes/node'
import TextNode from './nodes/text-node'
import LinkNode from './nodes/link-node'
import CircleNode from './nodes/circle-node'
import AnimateNode from './nodes/animate-node'

import Link from './links/link'
import FoldLink from './links/fold-link'
import FlexionalLink from './links/flexional-link'
import CurveLink from './links/curve-link'

import Container from './container'

import PieChartNode from './charts/pie-chart'
import BarChartNode from './charts/bar-chart'

import Logo from './loge'
import Layout from './layout'
import { Effect, Animate } from './effect'

import { createStageFromJson, extend } from './common'

const JTopo = {
  Stage,
  Scene,
  // nodes
  Node,
  TextNode,
  LinkNode,
  CircleNode,
  AnimateNode,

  // links
  Link,
  FoldLink,
  FlexionalLink,
  CurveLink,

  Container,

  PieChartNode,
  BarChartNode,

  Logo,
  // Layout,
  layout: Layout,
  Effect,
  Animate,
  util,

  createStageFromJson,

  extend
}

extendNative()

export default JTopo
