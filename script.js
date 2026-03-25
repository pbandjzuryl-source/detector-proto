const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

// Load the Tiny Face Detector model
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models')
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error("Error accessing webcam:", err);
    });
}

video.addEventListener('play', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const detectFace = async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach(det => {
      const { x, y, width, height } = det.box;
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    });

    requestAnimationFrame(detectFace);
  };

  detectFace();
});