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

            // Rensa bort ALLT utom siffror och +
            qrData = qrData.replace(/[^0-9+]/g, "");

            // Om QR innehåller en giltig Swish-länk redan → öppna direkt
            if (code.data.startsWith("swish://")) {
                window.location.href = code.data;
                return;
            }

            // Kolla om det ser ut som ett svenskt telefonnummer
            if (/^\+46\d{7,10}$/.test(qrData)) {
                const swishLink = `swish://payment?data=${encodeURIComponent(JSON.stringify({
                    version: 1,
                    payee: qrData,
                    amount: 1,
                    message: "Betalning"
                }))}`;

                window.location.href = swishLink;
                return;
            }

            // Felmeddelande om QR inte är giltig
            alert("Ingen giltig Swish-länk eller telefonnummer: " + code.data);
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
