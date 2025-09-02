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

            let qrData = code.data.trim();

            // Om QR innehåller en Swish-länk, öppna direkt
            if (qrData.startsWith("swish://")) {
                window.location.href = qrData;
                return;
            }

            // Om QR innehåller ett telefonnummer
            if (/^\+?\d+$/.test(qrData)) {
                // Rensa telefonnumret
                if (!qrData.startsWith("+")) {
                    qrData = "+" + qrData;
                }

                // Skapa Swish-länk med standardbelopp 1 SEK
                const swishLink = `swish://payment?data=${encodeURIComponent(JSON.stringify({
                    version: 1,
                    payee: qrData,
                    amount: 1,
                    message: "Betalning"
                }))}`;

                window.location.href = swishLink;
                return;
            }

            alert("Ingen giltig Swish-länk eller telefonnummer: " + qrData);
            scanning = true;
            scanFrame();
        }
    }

    requestAnimationFrame(scanFrame);
}

startButton.addEventListener("click", startScanner);

// Register PWA service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(console.error);
}
