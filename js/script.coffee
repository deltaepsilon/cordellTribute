window.face =
  drawing: false
  size: "small"
  color: "hsla(0, 0%, 100%, .9)"
  colors:
    white: "hsla(0, 0%, 100%, .9)"
    red: "hsla(0, 66%, 49%, .9)"
    blue: "hsla(196, 90%, 39%, .9)"
    purple: "hsla(280, 22%, 40%, .9)"
    eggplant: "hsla(201, 36%, 25%, .9)"
    green: "hsla(90, 92%, 31%, .9)"
    tangerine: "hsla(25, 98%, 51%, .9)"
  diameter: 10
  offset: {}
  draw: ->
    draw = $('#draw')
    ctx = window.face.ctx
    # ctx.scale -2, -2
    draw.mousedown ->
      window.face.drawing = true
    draw.mouseup ->
      window.face.drawing = false
    draw.mouseleave ->
      window.face.drawing = false
    draw.mousemove (e) ->
      if window.face.drawing == false
        return
      x = e.clientX  -  window.face.offset.left
      y = e.clientY  -  window.face.offset.top
      ctx.beginPath()
      ctx.fillStyle = window.face.color
      ctx.arc x, y, window.face.diameter, 0, Math.PI * 2, true
      ctx.fill()
  parameters: (callback) ->
    try
      canvas = $('#draw')
      window.face['canvas'] = document.getElementById 'draw'
      window.face['ctx'] = window.face.canvas.getContext '2d'
      canvas.attr 'width', canvas.width()
      canvas.attr 'height', canvas.height()
      face = $('#face')
      position = face.position()
      window.face.offset['left'] = position.left + parseInt face.css('margin-left')
      window.face.offset['top'] = position.top + parseInt face.css('margin-top')
    finally
      if typeof(callback) == 'function'
        callback()
  incrementColors: (sign) ->
    $.each window.face.colors, (name, value) ->
      re = /0*\.*0*\d*\)/
      text = re.exec(value)
      number = parseFloat text[0]
      console.log number
      incremented = sign * .05 + number
      incremented = Math.min incremented, 1
      incremented = Math.max incremented, .05
      newHsl = value.replace re, incremented + ")"
      console.log incremented
      console.log newHsl
      window.face.colors[name] = newHsl
      $('#' + name).css 'background-color', newHsl
  elements: (callback) ->
    try
      elements = $('#elements')
      $.each window.face.colors, (name, value) ->
        console.log value
        elements.prepend '<span id="' + name + '" class="color-picker" style="display: none; background: ' + value + ';"></span>'
      pickers = $('.color-picker')
      pickers.click ->
        color = $(this).css 'background-color'
        window.face.color = color
      $('#darker').click ->
        window.face.incrementColors 1
      $('#lighter').click ->
        window.face.incrementColors -1
    finally
      elements.children().fadeIn "slow"
      if typeof(callback) == 'function'
        callback()
$(document).ready ->
  console.log "inside ready"
  window.face.parameters ->
    window.face.elements ->
      window.face.draw()
  $(window).resize ->
    window.face.parameters()
