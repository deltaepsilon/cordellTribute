(function() {
  window['face'] = {
    drawing: false,
    draw: function() {
      var drawing;
      drawing = false;
      console.log("inside draw");
      $('#draw').mousedown(function() {
        window.face.drawing = true;
        return console.log("mousedown!");
      });
      $('#draw').mouseup(function() {
        window.face.drawing = false;
        return console.log("mouseup!");
      });
      $('#draw').mouseleave(function() {
        window.face.drawing = false;
        return console.log("mouseleave!");
      });
      return $('#draw').mousemove(function() {
        if (window.face.drawing === false) {
          return;
        }
        return console.log(this);
      });
    }
  };
  $(document).ready(function() {
    return window.face.draw();
  });
}).call(this);
