var socket = io('/');
socket.on('connect', function() {
  socket.on("newQuestion", newQuestion(data));
});


function newQuestion(data) {
  $("#title").text(data.title);
  $("#image").attr("src", data.image);
  $("#answer0").text(data.answers[0]);
  $("#answer1").text(data.answers[1]);
  $("#answer2").text(data.answers[2]);
  $("#answer3").text(data.answers[3]);
}

if (screen.width <= 699) {
    document.location = "mobile";
}
