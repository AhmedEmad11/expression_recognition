const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/expression_recognition/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/expression_recognition/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/expression_recognition/models')
]).then(startVideo)

function startVideo() {
  navigator.mediaDevices.getUserMedia({
    video: { width: 600, height: 400 },
    audio: false
  })
    .then((stream) => {

      this.video.srcObject = stream
    })
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})