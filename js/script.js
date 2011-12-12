(function() {
  window.face = {
    drawing: false,
    size: "small",
    color: "hsla(0, 0%, 100%, .9)",
    colors: {
      white: "hsla(0, 0%, 100%, .9)",
      red: "hsla(0, 66%, 49%, .9)",
      blue: "hsla(196, 90%, 39%, .9)",
      purple: "hsla(280, 22%, 40%, .9)",
      eggplant: "hsla(201, 36%, 25%, .9)",
      green: "hsla(90, 92%, 31%, .9)",
      tangerine: "hsla(25, 98%, 51%, .9)"
    },
    diameter: 10,
    offset: {},
    timer: 0,
    repeat: 100,
    draw: function() {
      var ctx, draw;
      draw = $('#draw');
      ctx = window.face.ctx;
      draw.mousedown(function() {
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
    },
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
    }
  };
  $(document).ready(function() {
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
