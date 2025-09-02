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
            statusText.innerText = "QR hittad! Förbereder Swish...";

            let qrData = code.data.trim();

            // Rensa bort skräp → bara siffror och +
            qrData = qrData.replace(/[^0-9+]/g, "");

            // Om QR redan innehåller Swish-länk → öppna direkt
            if (code.data.startsWith("swish://")) {
                openSwish(code.data);
                return;
            }

            // Om QR ser ut som ett svenskt nummer → skapa Swish-länk
            if (/^\+46\d{7,10}$/.test(qrData)) {
                const swishJson = {
                    version: 1,
                    payee: qrData,
                    amount: 1,
                    message: "Betalning"
                };

                // OBS! Viktigt: Swish vill ha JSON → Base64 → URL
                const swishData = btoa(encodeURIComponent(JSON.stringify(swishJson)));
                console.log(swishJson)
                console.log(swishData)
                const swishLink = `swish://payment?data=${swishData}`;

                openSwish(swishLink);
                return;
            }

            alert("Ingen giltig Swish-länk eller telefonnummer: " + code.data);
            scanning = true;
            scanFrame();
        }
    }

    requestAnimationFrame(scanFrame);
}

// Viktigt: Öppna Swish på rätt sätt för iOS
function openSwish(link) {
    // iOS kräver att vi triggar Swish via user-gesture
    window.location.href = link;
}

startButton.addEventListener("click", startScanner);

// PWA service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(console.error);
}
