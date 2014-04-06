var socket = io.connect('/');
socket.on('connect', function() {
  socket.on("newQuestion", newQuestion);
});

socket.on("update", function(data) {
  $("#score0").text(data.scores[0]);
  $("#score1").text(data.scores[1]);
  $("#score2").text(data.scores[2]);
  $("#score3").text(data.scores[3]);
});


function newQuestion(data) {
  $("#title").text(data.title);
  $("#image").attr("src", data.image);
  $("#answer0").text(data.answers[0]);
  $("#answer1").text(data.answers[1]);
  $("#answer2").text(data.answers[2]);
  $("#answer3").text(data.answers[3]);
  console.log(data);
}

$(document).ready(function() {
  $("#new").click(function() {
    socket.emit("getQuestion");
  });
});

if (screen.width <= 699) {
    document.location = "mobile";
}
