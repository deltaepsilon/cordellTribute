window['face'] =
  drawing: false
  draw: ->
    drawing = false
    console.log "inside draw"
    $('#draw').mousedown ->
      window.face.drawing = true
      console.log "mousedown!"
    $('#draw').mouseup ->
      window.face.drawing = false
      console.log "mouseup!"
    $('#draw').mouseleave ->
      window.face.drawing = false
      console.log "mouseleave!"
    $('#draw').mousemove ->
      if window.face.drawing == false
        return
      console.log this
$(document).ready ->
	window.face.draw()























