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
        canvas.attr('width', canvas.width());
        canvas.attr('height', canvas.height());
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
    incrementColors: function(sign) {
      return $.each(window.face.colors, function(name, value) {
        var incremented, newHsl, number, re, text;
        re = /0*\.*0*\d*\)/;
        text = re.exec(value);
        number = parseFloat(text[0]);
        console.log(number);
        incremented = sign * .05 + number;
        incremented = Math.min(incremented, 1);
        incremented = Math.max(incremented, .05);
        newHsl = value.replace(re, incremented + ")");
        console.log(incremented);
        console.log(newHsl);
        window.face.colors[name] = newHsl;
        return $('#' + name).css('background-color', newHsl);
      });
    },
    elements: function(callback) {
      var elements, pickers;
      try {
        elements = $('#elements');
        $.each(window.face.colors, function(name, value) {
          console.log(value);
          return elements.prepend('<span id="' + name + '" class="color-picker" style="display: none; background: ' + value + ';"></span>');
        });
        pickers = $('.color-picker');
        pickers.click(function() {
          var color;
          color = $(this).css('background-color');
          return window.face.color = color;
        });
        $('#darker').click(function() {
          return window.face.incrementColors(1);
        });
        return $('#lighter').click(function() {
          return window.face.incrementColors(-1);
        });
      } finally {
        elements.children().fadeIn("slow");
        if (typeof callback === 'function') {
          callback();
        }
      }
    }
  };
  $(document).ready(function() {
    console.log("inside ready");
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
