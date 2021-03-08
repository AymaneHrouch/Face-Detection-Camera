const video = document.getElementById("video");

Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("/models")]).then(
  startVideo
);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions()
    );
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
  }, 100);
});

document.getElementById("capture").addEventListener("click", myFunction);

async function myFunction() {
  console.log("pressed!");
  const canvas = faceapi.createCanvasFromMedia(video);

  var x = document.getElementById("CANVAS");
  const name = prompt("What should we call you?");
  axios({
    method: "post",
    url: "https://stormy-wave-62951.herokuapp.com/",
    data: {
      img: canvas.toDataURL(),
      name: name,
    },
  });

  alert(`You're now registered dear ${name}. See ya!`);

  var ctx = x.getContext("2d");
  ctx.fillStyle = "#FF0000";
}

axios({
  method: "get",
  url: "https://stormy-wave-62951.herokuapp.com/count",
}).then(function (response) {
  console.log(response);
  document.getElementById("number").innerHTML = `${response.data}`;
});
