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

            // 1. Nya Swish-länkar
            if (qrData.startsWith("https://app.swish.nu/")) {
                openSwish(qrData);
                return;
            }

            // 2. Gamla Swish deep links
            if (qrData.startsWith("swish://")) {
                openSwish(qrData);
                return;
            }

            // 3. Telefonnummer → bygg en Swish-länk
            qrData = qrData.replace(/[^0-9+]/g, "");
            if (/^\+46\d{7,10}$/.test(qrData) || /^07\d{8}$/.test(qrData)) {
                if (!qrData.startsWith("+")) {
                    qrData = "+46" + qrData.substring(1);
                }
                const swishUrl = `https://app.swish.nu/1/p/sw/?sw=${encodeURIComponent(qrData)}&amt=1&cur=SEK&msg=Betalning`;
                openSwish(swishUrl);
                return;
            }

            // 4. Ogiltig kod
            alert("Ingen giltig Swish-länk eller telefonnummer: " + code.data);
            scanning = true;
            scanFrame();
        }
    }

    requestAnimationFrame(scanFrame);
}

function openSwish(link) {
    // Viktigt på iOS: öppna i samma flik
    window.location.href = link;
}

startButton.addEventListener("click", startScanner);

// PWA service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(console.error);
}
