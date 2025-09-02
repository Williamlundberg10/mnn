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

            // Rensa bort allt skräp → bara siffror och +
            qrData = qrData.replace(/[^0-9+]/g, "");

            // Om QR redan innehåller Swish-länk → öppna direkt
            if (code.data.startsWith("swish://")) {
                openSwish(code.data);
                return;
            }

            // Kontrollera om vi har ett svenskt telefonnummer
            if (/^\+46\d{7,10}$/.test(qrData)) {
                // Bygg Swish JSON
                const swishJson = {
                    version: 1,
                    payee: qrData,
                    amount: 1, // standardbelopp
                    message: "Betalning"
                };

                // Swish kräver URL-enkodad JSON, inte Base64
                const swishLink = "swish://payment?data=" + JSON.stringify(swishJson);
                openSwish(swishLink);
                return;
            }

            // Om inget matchar → felmeddelande
            alert("Ingen giltig Swish-länk eller telefonnummer: " + code.data);
            scanning = true;
            scanFrame();
        }
    }

    requestAnimationFrame(scanFrame);
}

function openSwish(link) {
    // Viktigt på iOS: öppna via en användargesture
    setTimeout(() => {
        window.location.href = link;
    }, 300);
}

startButton.addEventListener("click", startScanner);

// PWA service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(console.error);
}
