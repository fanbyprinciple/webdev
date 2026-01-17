<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Friendly AI Pushup Coach</title>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils"></script>
  <style>
    :root { --primary: #4ade80; --warning: #fbbf24; --bg: #0f172a; }
    body { font-family: 'Segoe UI', sans-serif; background: var(--bg); color: white; margin: 0; display: flex; flex-direction: column; align-items: center; }
    
    .app-container { display: flex; gap: 20px; padding: 20px; flex-wrap: wrap; justify-content: center; }
    .video-section { position: relative; border-radius: 20px; overflow: hidden; border: 4px solid #334155; }
    canvas { position: absolute; left: 0; top: 0; }
    video { transform: rotateY(180deg); background: #000; }

    .sidebar { width: 320px; background: #1e293b; padding: 25px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .stat-card { background: #0f172a; padding: 15px; border-radius: 12px; text-align: center; margin-bottom: 15px; border-left: 5px solid var(--primary); }
    .stat-value { font-size: 3rem; font-weight: bold; color: var(--primary); }
    
    #coach-feedback { font-weight: bold; padding: 15px; border-radius: 8px; background: #334155; margin-top: 10px; text-align: center; font-size: 1.1rem; }
    .instruction-list { font-size: 0.9rem; color: #cbd5e1; padding-left: 20px; }
  </style>
</head>
<body>

  <h1>Friendly Pushup Counter</h1>

  <div class="app-container">
    <div class="video-section">
      <video id="input_video" width="640" height="480" autoplay></video>
      <canvas id="output_canvas" width="640" height="480"></canvas>
    </div>

    <div class="sidebar">
      <div class="stat-card">
        <div>TOTAL REPS</div>
        <div class="stat-value" id="count">0</div>
      </div>

      <div id="coach-feedback">Setting up...</div>

      <h3 style="margin-top:25px;">How to use:</h3>
      <ul class="instruction-list">
        <li>Show your <b>whole body</b> in the camera.</li>
        <li>Stand <b>sideways</b> (profile view).</li>
        <li>Go down until you feel a good stretch.</li>
        <li>Don't worry about being perfect!</li>
      </ul>
    </div>
  </div>

  <script>
    const videoElement = document.getElementById('input_video');
    const canvasElement = document.getElementById('output_canvas');
    const canvasCtx = canvasElement.getContext('2d');
    const countDisplay = document.getElementById('count');
    const feedback = document.getElementById('coach-feedback');

    let counter = 0;
    let stage = "up"; 

    function calculateAngle(A, B, C) {
      let radians = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
      let angle = Math.abs(radians * 180.0 / Math.PI);
      if (angle > 180.0) angle = 360 - angle;
      return angle;
    }

    function onResults(results) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (results.poseLandmarks) {
        const lm = results.poseLandmarks;
        
        // Right Side Points
        const angleElbow = calculateAngle(lm[12], lm[14], lm[16]);
        const angleBody = calculateAngle(lm[12], lm[24], lm[26]);

        // LENIENT LOGIC
        // 1. Is the user horizontal? (Increased tolerance to 0.45)
        const isHorizontal = Math.abs(lm[12].y - lm[24].y) < 0.45;
        // 2. Is the body "straight enough"? (Lowered to 135 degrees)
        const isStraight = angleBody > 135;

        if (!isHorizontal) {
          feedback.innerText = "Try to get lower to the floor";
          feedback.style.color = "#fbbf24";
        } else if (!isStraight) {
          feedback.innerText = "Try to keep your hips steady";
          feedback.style.color = "#fbbf24";
        } else {
          feedback.innerText = "Doing great! Keep moving.";
          feedback.style.color = "#4ade80";

          // COUNTING LOGIC (Lenient thresholds)
          if (angleElbow > 150) { // Doesn't need full 180 lock
            stage = "up";
          }
          if (angleElbow < 110 && stage === "up") { // Doesn't need deep 90
            stage = "down";
            counter++;
            countDisplay.innerText = counter;
          }
        }

        drawConnectors(canvasCtx, lm, POSE_CONNECTIONS, {color: isStraight ? '#4ade80' : '#fbbf24', lineWidth: 4});
        drawLandmarks(canvasCtx, lm, {color: '#fff', lineWidth: 1, radius: 2});
      }
      canvasCtx.restore();
    }

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
    pose.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => { await pose.send({image: videoElement}); },
      width: 640, height: 480
    });
    camera.start();
  </script>
</body>
</html>