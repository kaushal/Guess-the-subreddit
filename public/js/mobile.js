var socket = io.connect('/');
socket.on('connect', function() {
  socket.on("newQuestion", newQuestion);
});


function newQuestion(data) {
  $("#answer0").text(data.answers[0]);
  $("#answer1").text(data.answers[1]);
  $("#answer2").text(data.answers[2]);
  $("#answer3").text(data.answers[3]);
}

$(document).ready(function() {
  $("#answer0").click(function() {
    socket.emit("vote", {vote : 0});
    console.log("VOTE");
  });
  $("#answer1").click(function() {
    socket.emit("vote", {vote : 1});
  });
  $("#answer2").click(function() {
    socket.emit("vote", {vote : 2});
  });
  $("#answer3").click(function() {
    socket.emit("vote", {vote : 3});
  });

  socket.emit("currentQuestion");
});
