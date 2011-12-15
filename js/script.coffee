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
  timer: 0
  repeat: 100
  parameters: (callback) ->
    try
      canvas = $('#draw')
      window.face['canvas'] = document.getElementById 'draw'
      window.face['ctx'] = window.face.canvas.getContext '2d'
      face = $('#face')
      position = face.position()
      window.face.offset['left'] = position.left + parseInt face.css('margin-left')
      window.face.offset['top'] = position.top + parseInt face.css('margin-top')
    finally
      if typeof(callback) == 'function'
        callback()
  incrementColors: (sign, callback) ->
    try
      $.each window.face.colors, (name, value) ->
        re = /0*\.*0*\d*\)/
        text = re.exec(value)
        number = parseFloat text[0]
        incremented = sign * .05 + number
        incremented = Math.min incremented, 1
        incremented = Math.max incremented, .05
        newHsl = value.replace re, incremented + ")"
        window.face.colors[name] = newHsl
        $('#' + name).css 'background-color', newHsl
    finally
      if typeof(callback) == 'function'
        callback()
  selectionDisplay: ->
    stroke = $('#selection-display')
    diameter = 2 * window.face.diameter
    stroke.css('background-color', window.face.color).width(diameter).height(diameter)
  erase: ->
    draw = $('#draw')
    window.face.ctx.clearRect 0, 0, draw.width(), draw.height() 
  elements: (callback) ->
    try
      elements = $('#elements')
      $.each window.face.colors, (name, value) ->
        elements.prepend '<span id="' + name + '" class="color-picker" style="display: none; background: ' + value + ';"></span>'
      pickers = $('.color-picker')
      pickers.click ->
        color = $(this).css 'background-color'
        window.face.color = color
        window.face.selectionDisplay()
      
      # Enable darker, lighter, thicker and thinner buttons including
      # mousedown repetition.  Clicking over and over again is annoying
      
      # Darker
      $('#darker').mousedown ->
        wrapper = ->
          window.face.incrementColors 1
        window.face.timer = setInterval wrapper, window.face.repeat
      .bind 'mouseup mouseleave', ->
        clearInterval window.face.timer
      
      # Lighter
      $('#lighter').mousedown ->
        wrapper = ->
          window.face.incrementColors -1
        window.face.timer = setInterval wrapper, window.face.repeat
      .bind 'mouseup mouseleave', ->
        clearInterval window.face.timer
      
      # Thicker
      $('#thicker').mousedown ->
        wrapper = ->
          if window.face.diameter >= pickers.height() / 2
            return
          window.face.diameter += 1
          window.face.selectionDisplay()
        window.face.timer = setInterval wrapper, window.face.repeat
      .bind 'mouseup mouseleave', ->
        clearInterval window.face.timer
      
      # Thinner
      $('#thinner').mousedown ->
        wrapper = ->
          if window.face.diameter <= 2
            return
          window.face.diameter -= 1
          window.face.selectionDisplay()
        window.face.timer = setInterval wrapper, window.face.repeat
      .bind 'mouseup mouseleave', ->
        clearInterval window.face.timer
      
      # Erase
      $('#erase').click ->
        window.face.erase()
    finally
      window.face.selectionDisplay()
      elements.children().fadeIn "slow"
      if typeof(callback) == 'function'
        callback()
  placeAudio: (audio, callback) ->
    try
      section = $('#audio')
      $.each audio, (key, value) ->
        section.append '<audio id="audio-' + key + '" class="audio-clip"><source src="audio/' + value + '.ogg" type="audio/ogg"><source src="audio/' + value + '.mp3" type="audio/mp3"></audio>'
    finally
      window.face['audioElements'] = document.getElementsByTagName('audio')
      if typeof(callback) == 'function'
        callback()
  playAudio: ->
    elements = window.face.audioElements
    element = elements[Object.randomFromTo(0, elements.length - 1)]
    element.play()
  draw: ->
    timer = 0
    draw = $('#draw')
    ctx = window.face.ctx
    draw.mousedown ->
      clearTimeout timer
      timer = setTimeout window.face.playAudio, 2000
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
Object.size = (obj) ->
  # Sometimes you need to know how long an object is
  size = 0
  $.each obj, (key, value) ->
    size += 1
  return size;
Object.randomize = (obj) ->
  # Sometimes you want to randomize an object just like you would an array
  result = obj.sort (a, b)->
      0.5 - Math.random()
  return result
Object.randomFromTo = (from, to) ->
  Math.floor Math.random() * (to - from + 1) + from
$(document).ready ->
  $.post '/', (audio) ->
    window.face['audio'] = $.parseJSON audio
    console.log window.face.audio
    window.face.placeAudio window.face.audio
  window.face.parameters ->
    window.face.elements ->
      window.face.draw()
  $(window).resize ->
    window.face.parameters()
