const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const statusText = document.getElementById("status");
const startButton = document.getElementById("startScan");

let scanning = false;

async function startScanner() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;
        video.setAttribute("playsinline", true); // iOS fix
        video.play();
        scanning = true;
        scanFrame();

    } catch (err) {
        alert("Kunde inte starta kamera: " + err);
    }
}

function scanFrame() {
    if (!scanning) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            scanning = false;
            statusText.innerText = "QR hittad! Öppnar Swish...";

            if (code.data.startsWith("swish://")) {
                window.location.href = code.data;
            } else {
                alert("Ingen giltig Swish-länk: " + code.data);
            }
            return;
        }
    }

    requestAnimationFrame(scanFrame);
}

startButton.addEventListener("click", startScanner);

// Register PWA service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(console.error);
}
