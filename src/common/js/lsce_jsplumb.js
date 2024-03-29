import {typeNumber, typeString, typeBoolean} from './point'
import {jsPlumb} from 'jsplumb'
const PORTLINEHEIGHT = 24
const FILTERHEIGHT = 170

function addNode(nodetype, classname, id) { // 添加节点类型
  let node = document.createElement(nodetype)
  node.className = classname
  node.id = id
  return node
}

function addWidgetNode(el, e, node) { // 添加到定点位置
  let obj = document.getElementById(el)
  if (el === 'canvas') {
    node.style.top = e.clientY - 40 + 'px'
    node.style.left = e.clientX - 330 + 'px'
  }
  node.style.position = 'absolute'
  obj.appendChild(node) 
}

function addFunctionalPoint(el, io, pn, type, index, _instance) { // 添加port样式锚点
  if (io === 'input') {
    _instance.my_addEndpoint(el, { anchor: [0, 0.3 + pn * 0.2, -1, 0] }, type, index)
  } else if (io === 'output') {
    _instance.my_addEndpoint(el, { anchor: [1, 0.9 - pn * 0.2, 1, 0] }, type, index)
  }
}

function addFunctionalPortName(el, node, text, pos, val) { // 添加portname
  let obj = document.getElementById(el)
  node.innerText = text
  if (pos === 'left') {
    node.style.top = val + 'px'
    node.style.left = 0
    node.style.position = 'absolute'
  } else if (pos === 'right') {
    node.style.bottom = val + 'px'
    node.style.right = 0
    node.style.position = 'absolute'
  } else if (pos === 'title') {
    node.style.top = val + 'px'
    node.style.textAlign = 'center'
    node.style.fontWeight = 'bold'
  }
  node.style.display = 'block'
  obj.appendChild(node)
}

export function addFunctionalNode(item, e, widgetId, _instance, uniqueClass) { // 添加port节点
  let inputLength = item.input.length
  let outputLength = item.output.length
  let type = ''
  let i = 0
  let pn = 0 // input/output pointNum

  addWidgetNode('canvas', e, addNode('div', 'window', widgetId))
  // 为pizzahub组件单独添加样式
  // let idstr = widgetId
  // let reg = /[0-9]/g
  // idstr = idstr.replace(reg, '')
  // if(idstr === 'Pizzahub')
  //   document.getElementById(widgetId).classList.add("pizzahub")
  if(uniqueClass)
    document.getElementById(widgetId).classList.add(uniqueClass)

  addFunctionalPortName(widgetId, addNode('span', '', ''), item.servName, 'title', 0)
  for (pn = 0; pn < inputLength; pn++, i++) {
    item.input[pn].itype === 'Number' ? type = typeNumber : item.input[pn].itype === 'String' ? type = typeString : type = typeBoolean
    addFunctionalPoint(widgetId, 'input', pn, type, i, _instance)
    addFunctionalPortName(widgetId, addNode('span', 'portname', ''), item.input[pn].iname, 'left', (pn + 1) * PORTLINEHEIGHT)
  }
  for (pn = 0; pn < outputLength; pn++, i++) {
    item.output[pn].otype === 'Number' ? type = typeNumber : item.output[pn].otype === 'String' ? type = typeString : type = typeBoolean
    addFunctionalPoint(widgetId, 'output', pn, type, i, _instance)
    addFunctionalPortName(widgetId, addNode('span', 'portname', ''), item.output[pn].oname, 'right', pn * PORTLINEHEIGHT)
  }
  _instance.draggable(jsPlumb.getSelector('.drag-drop-demo .window'))
}

function addFilterPoint(el, type, index, _instance) {
  _instance.my_addEndpoint(el, { anchor: 'LeftMiddle' }, type, index++) // 0
  _instance.my_addEndpoint(el, { anchor: 'RightMiddle' }, type, index++) // 1
  _instance.my_addEndpoint(el, { anchor: 'BottomCenter' }, type, index++) // 2
}

function addFilterPortName(el, node, text, pos) {
  let obj = document.getElementById(el)
  node.innerText = text
  if (pos === 'title') {
    node.style.paddingTop = '35px'
    node.style.textAlign = 'center'
    node.style.fontWeight = 'bold'
  } else if (pos === 'left') { // input
    node.style.top = FILTERHEIGHT / 2 - 6 + 'px'
    node.style.left = '12px'
    node.style.position = 'absolute'
  } else if (pos === 'right') { // Y
    node.style.top = FILTERHEIGHT / 2 - 6 + 'px'
    node.style.right = '12px'
    node.style.position = 'absolute'
  } else if (pos === 'bottom') { // N
    node.style.bottom = '8px'
    node.style.left = FILTERHEIGHT / 2 - 8 + 'px'
    node.style.textAlign = 'center'
    node.style.position = 'absolute'
  }
  node.style.display = 'block'
  obj.appendChild(node)
}

function addAllFilterPortName(id, item) {
  addFilterPortName(id, addNode('span', '', ''), item.servName, 'title')
  addFilterPortName(id, addNode('span', 'portname', ''), item.input[0].iname, 'left')
  addFilterPortName(id, addNode('span', 'portname', ''), item.output[0].oname, 'right')
  addFilterPortName(id, addNode('span', 'portname', ''), item.output[1].oname, 'bottom')
}

export function addFilterNode(item, e, widgetId, _instance) { // 拖出Filter框后渲染的画面
  addWidgetNode('canvas', e, addNode('div', 'filter', widgetId))
  addWidgetNode(widgetId, e, addNode('div', 'filterFrame', ''))
  addAllFilterPortName(widgetId, item)
  let type = ''
  item.input[0].itype === 'Number' ? type = typeNumber : item.input[0].itype === 'String' ? type = typeString : type = typeBoolean
  addFilterPoint(widgetId, type, 0, _instance)
  addWidgetNode(widgetId, e, addNode('input', 'filterInput', widgetId + '_filterInput'))
  _instance.draggable(jsPlumb.getSelector('.drag-drop-demo .filter'))
}

export function addMergeNode(item, e, widgetId, _instance) {
  addFunctionalNode(item, e, widgetId, _instance)
  addWidgetNode(widgetId, e, addNode('input', 'mergeInput', widgetId + '_mergeInput'))
}
