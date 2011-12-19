(function() {
  window.face = {
    drawing: false,
    size: "small",
    color: "hsla(0, 0%, 100%, .9)",
    colors: {
      white: "hsla(0, 0%, 100%, .9)",
      black: "hsla(0, 0%, 0%, 1)",
      purple: "hsla(302, 100%, 42%, 1)",
      yellow: "hsla(63, 100%, 50%, 1)",
      lime: "hsla(88, 100%, 50%, 1)",
      pink: "hsla(324, 100%, 50%, 1)",
      gray: "hsla(0, 0%, 40%, 1)"
    },
    diameter: 10,
    offset: {},
    timer: 0,
    repeat: 100,
    parameters: function(callback) {
      var canvas, face, position;
      try {
        canvas = $('#draw');
        window.face['canvas'] = document.getElementById('draw');
        window.face['ctx'] = window.face.canvas.getContext('2d');
        face = $('#face');
        position = face.position();
        window.face.offset['left'] = position.left + parseInt(face.css('margin-left'));
        return window.face.offset['top'] = position.top + parseInt(face.css('margin-top'));
      } finally {
        if (typeof callback === 'function') {
          callback();
        }
      }
    },
    incrementColors: function(sign, callback) {
      try {
        return $.each(window.face.colors, function(name, value) {
          var incremented, newHsl, number, re, text;
          re = /0*\.*0*\d*\)/;
          text = re.exec(value);
          number = parseFloat(text[0]);
          incremented = sign * .05 + number;
          incremented = Math.min(incremented, 1);
          incremented = Math.max(incremented, .05);
          newHsl = value.replace(re, incremented + ")");
          window.face.colors[name] = newHsl;
          return $('#' + name).css('background-color', newHsl);
        });
      } finally {
        if (typeof callback === 'function') {
          callback();
        }
      }
    },
    selectionDisplay: function() {
      var diameter, stroke;
      stroke = $('#selection-display');
      diameter = 2 * window.face.diameter;
      return stroke.css('background-color', window.face.color).width(diameter).height(diameter);
    },
    erase: function() {
      var draw;
      draw = $('#draw');
      return window.face.ctx.clearRect(0, 0, draw.width(), draw.height());
    },
    elements: function(callback) {
      var elements, pickers;
      try {
        elements = $('#elements');
        $.each(window.face.colors, function(name, value) {
          return elements.prepend('<span id="' + name + '" class="color-picker" style="display: none; background: ' + value + ';"></span>');
        });
        pickers = $('.color-picker');
        pickers.click(function() {
          var color;
          color = $(this).css('background-color');
          window.face.color = color;
          return window.face.selectionDisplay();
        });
        $('#darker').mousedown(function() {
          var wrapper;
          wrapper = function() {
            return window.face.incrementColors(1);
          };
          return window.face.timer = setInterval(wrapper, window.face.repeat);
        }).bind('mouseup mouseleave', function() {
          return clearInterval(window.face.timer);
        });
        $('#lighter').mousedown(function() {
          var wrapper;
          wrapper = function() {
            return window.face.incrementColors(-1);
          };
          return window.face.timer = setInterval(wrapper, window.face.repeat);
        }).bind('mouseup mouseleave', function() {
          return clearInterval(window.face.timer);
        });
        $('#thicker').mousedown(function() {
          var wrapper;
          wrapper = function() {
            if (window.face.diameter >= pickers.height() / 2) {
              return;
            }
            window.face.diameter += 1;
            return window.face.selectionDisplay();
          };
          return window.face.timer = setInterval(wrapper, window.face.repeat);
        }).bind('mouseup mouseleave', function() {
          return clearInterval(window.face.timer);
        });
        $('#thinner').mousedown(function() {
          var wrapper;
          wrapper = function() {
            if (window.face.diameter <= 2) {
              return;
            }
            window.face.diameter -= 1;
            return window.face.selectionDisplay();
          };
          return window.face.timer = setInterval(wrapper, window.face.repeat);
        }).bind('mouseup mouseleave', function() {
          return clearInterval(window.face.timer);
        });
        return $('#erase').click(function() {
          return window.face.erase();
        });
      } finally {
        window.face.selectionDisplay();
        elements.children().fadeIn("slow");
        if (typeof callback === 'function') {
          callback();
        }
      }
    },
    placeAudio: function(audio, callback) {
      var section;
      try {
        section = $('#audio');
        return $.each(audio, function(key, value) {
          return section.append('<audio id="audio-' + key + '" class="audio-clip"><source src="audio/' + value + '.ogg" type="audio/ogg"><source src="audio/' + value + '.mp3" type="audio/mp3"></audio>');
        });
      } finally {
        window.face['audioElements'] = document.getElementsByTagName('audio');
        if (typeof callback === 'function') {
          callback();
        }
      }
    },
    playAudio: function() {
      var element, elements;
      elements = window.face.audioElements;
      element = elements[Object.randomFromTo(0, elements.length - 1)];
      return element.play();
    },
    draw: function() {
      var ctx, draw, timer;
      timer = 0;
      draw = $('#draw');
      ctx = window.face.ctx;
      draw.mousedown(function() {
        clearTimeout(timer);
        timer = setTimeout(window.face.playAudio, 2000);
        return window.face.drawing = true;
      });
      draw.mouseup(function() {
        return window.face.drawing = false;
      });
      draw.mouseleave(function() {
        return window.face.drawing = false;
      });
      return draw.mousemove(function(e) {
        var x, y;
        if (window.face.drawing === false) {
          return;
        }
        x = e.clientX - window.face.offset.left;
        y = e.clientY - window.face.offset.top;
        ctx.beginPath();
        ctx.fillStyle = window.face.color;
        ctx.arc(x, y, window.face.diameter, 0, Math.PI * 2, true);
        return ctx.fill();
      });
    }
  };
  Object.size = function(obj) {
    var size;
    size = 0;
    $.each(obj, function(key, value) {
      return size += 1;
    });
    return size;
  };
  Object.randomize = function(obj) {
    var result;
    result = obj.sort(function(a, b) {
      return 0.5 - Math.random();
    });
    return result;
  };
  Object.randomFromTo = function(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  };
  $(document).ready(function() {
    $.post('/', function(audio) {
      window.face['audio'] = $.parseJSON(audio);
      console.log(window.face.audio);
      return window.face.placeAudio(window.face.audio);
    });
    window.face.parameters(function() {
      return window.face.elements(function() {
        return window.face.draw();
      });
    });
    return $(window).resize(function() {
      return window.face.parameters();
    });
  });
}).call(this);
