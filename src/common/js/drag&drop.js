function dragstart(event) {
  var ev = event || window.event
  ev.preventDefault()
  console.log('dragstart')
}

function dragover(event) {
  var ev = event || window.event
  ev.preventDefault()
  console.log('dragover')
}

export {dragstart, dragover}