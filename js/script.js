(function() {
  window['face'] = {
    drawing: false,
    size: "small",
    color: "lime",
    offset: {},
    draw: function() {
      var draw;
      draw = $('#draw');
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
        var span;
        if (window.face.drawing === false) {
          return;
        }
        span = '<span class="' + window.face.size + ' ' + window.face.color + '" style="top: ' + (e.clientY - window.face.offset.top) + 'px; left: ' + (e.clientX - window.face.offset.left) + 'px;"></span>';
        return draw.append(span);
      });
    },
    parameters: function(callback) {
      var face, position;
      try {
        face = $('#face');
        position = face.position();
        window.face.offset['left'] = position.left + parseInt(face.css('margin-left'));
        return window.face.offset['top'] = position.top + parseInt(face.css('margin-top'));
      } finally {
        if (typeof callback === 'function') {
          callback();
        }
      }
    }
  };
  $(document).ready(function() {
    return window.face.parameters(function() {
      return window.face.draw();
    });
  });
  $(window).resize(function() {
    return window.face.parameters();
  });
}).call(this);
