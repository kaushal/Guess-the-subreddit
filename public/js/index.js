var socket = io.connect('/');
var question;
socket.on('connect', function() {
  socket.on("newQuestion", newQuestion);
});

socket.on("update", function(data) {
  $("#score0").text((data.scores[0] / data.total * 100) + "%");
  $("#score1").text((data.scores[1] / data.total * 100) + "%");
  $("#score2").text((data.scores[2] / data.total * 100) + "%");
  $("#score3").text((data.scores[3] / data.total * 100) + "%");
});


function newQuestion(data) {
  if (question) {
    alert("Correct answer was: " + question.correct);
  }
  question = data;
  $("#title").text(data.title);
  $("#image").attr("src", data.image);
  $("#answer0").text(data.answers[0]);
  $("#answer1").text(data.answers[1]);
  $("#answer2").text(data.answers[2]);
  $("#answer3").text(data.answers[3]);
  $("#score0").empty();
  $("#score1").empty();
  $("#score2").empty();
  $("#score3").empty();
}

$(document).ready(function() {
  $("#new").click(function() {
    socket.emit("getQuestion");
  });
});

if (screen.width <= 699) {
    document.location = "mobile";
}
