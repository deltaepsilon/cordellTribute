window['face'] =
  drawing: false
  size: "small"
  color: "lime"
  offset: {}
  draw: ->
    draw = $('#draw')
    draw.mousedown ->
      window.face.drawing = true
    draw.mouseup ->
      window.face.drawing = false
    draw.mouseleave ->
      window.face.drawing = false
    draw.mousemove (e) ->
      if window.face.drawing == false
        return
      span = '<span class="' + window.face.size + ' ' + window.face.color + '" style="top: ' + ( e.clientY  -  window.face.offset.top ) + 'px; left: ' + ( e.clientX  -  window.face.offset.left ) + 'px;"></span>'
      draw.append span
  parameters: (callback) ->
    try
      face = $('#face')
      position = face.position()
      window.face.offset['left'] = position.left + parseInt face.css('margin-left')
      window.face.offset['top'] = position.top + parseInt face.css('margin-top')
    finally
      if typeof(callback) == 'function'
        callback() 
$(document).ready ->
  window.face.parameters ->
	  window.face.draw()
	$(window).resize ->
	  window.face.parameters()