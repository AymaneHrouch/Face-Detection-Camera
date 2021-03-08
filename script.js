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

  console.log(canvas.toDataURL());
  var x = document.getElementById("CANVAS");
  axios({
    method: "post",
    url: "http://localhost:2000",
    data: {
      img: canvas.toDataURL(),
    },
  });
  var ctx = x.getContext("2d");
  ctx.fillStyle = "#FF0000";
}

document.getElementById("get").addEventListener("click", () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "localhost:2000");
  xhr.send();
});
