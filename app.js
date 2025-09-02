const video = document.getElementById("camera");
const statusText = document.getElementById("status");
const startButton = document.getElementById("startScan");

async function startScanner() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });
        video.srcObject = stream;

        const html5QrCode = new Html5Qrcode("camera");
        html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: 250
            },
            (qrCodeMessage) => {
                statusText.innerText = "QR hittad! Öppnar Swish...";
                if (qrCodeMessage.startsWith("swish://")) {
                    window.location.href = qrCodeMessage;
                } else {
                    alert("Ingen Swish-länk: " + qrCodeMessage);
                }
            },
            (errorMessage) => {
                console.log("Ingen QR kod ännu...", errorMessage);
            }
        );

    } catch (err) {
        alert("Kunde inte starta kamera: " + err);
    }
}

startButton.addEventListener("click", startScanner);
