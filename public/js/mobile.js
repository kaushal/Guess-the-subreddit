var socket = io('/');
socket.on('connect', function() {
  socket.on("newQuestion", newQuestion(data));
});


function newQuestion(data) {
  $("#answer0").text(data.answers[0]);
  $("#answer1").text(data.answers[1]);
  $("#answer2").text(data.answers[2]);
  $("#answer3").text(data.answers[3]);
}

$(document).ready(function() {
  $("#answer0").click(function() {
    socket.emit({vote : 0});
  });
  $("#answer1").click(function() {
    socket.emit({vote : 1});
  });
  $("#answer2").click(function() {
    socket.emit({vote : 2});
  });
  $("#answer3").click(function() {
    socket.emit({vote : 3});
  });
});
