class QRCodeScanner {
    constructor(videoId = "camera", canvasId = "canvas", statusId = "status") {
        this.video = document.getElementById(videoId);
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.statusText = document.getElementById(statusId);
        this.scanning = false;
        this._resolve = null; // Promise resolver
    }

    async start() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });

            this.video.srcObject = stream;
            this.video.setAttribute("playsinline", true); // iOS fix
            await this.video.play();

            this.scanning = true;
            requestAnimationFrame(() => this._scanFrame());
        } catch (err) {
            alert("Kunde inte starta kamera: " + err);
        }
    }

    _scanFrame() {
        if (!this.scanning) return;

        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

            const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const code = jsQR(imageData.data, this.canvas.width, this.canvas.height);

            if (code) {
                this.scanning = false;
                if (this.statusText) {
                    this.statusText.innerText = "QR hittad!";
                }

                if (this._resolve) {
                    this._resolve(code.data.trim());
                }
                return;
            }
        }

        requestAnimationFrame(() => this._scanFrame());
    }

    async GetData() {
        return new Promise(async (resolve) => {
            this._resolve = resolve;
            await this.start();
        });
    }
}

// Export for usage
window.QRCodeScanner = QRCodeScanner;
