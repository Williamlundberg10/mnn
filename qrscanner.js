class SwishQRCodeScanner {
    constructor(videoId = "camera", canvasId = "canvas", statusId = "status") {
        this.video = document.getElementById(videoId);
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.statusText = document.getElementById(statusId);
        this.scanning = false;
        this._resolve = null;
        this._timeoutId = null;
    }

    async start(timeout = 30000) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });

            this.video.srcObject = stream;
            this.video.setAttribute("playsinline", true); // iOS fix
            await this.video.play();

            this.scanning = true;

            if (timeout > 0) {
                this._timeoutId = setTimeout(() => {
                    this.stop();
                    if (this._resolve) this._resolve(null);
                    if (this.statusText) this.statusText.innerText = "Timeout – ingen QR hittad.";
                }, timeout);
            }

            requestAnimationFrame(() => this._scanFrame());
        } catch (err) {
            alert("Kunde inte starta kamera: " + err);
            if (this._resolve) this._resolve(null);
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
                const qrText = code.data.trim();
                if (this._isSwishURL(qrText)) {
                    this.stop();
                    if (this.statusText) this.statusText.innerText = "Swish QR hittad!";
                    const swishData = this._parseSwishURL(qrText);
                    if (this._resolve) this._resolve(swishData);
                    return;
                } else {
                    if (this.statusText) this.statusText.innerText = "QR hittad, men inte Swish.";
                }
            }
        }

        requestAnimationFrame(() => this._scanFrame());
    }

    stop() {
        this.scanning = false;
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
    }

    async GetData(timeout = 30000) {
        return new Promise(async (resolve) => {
            this._resolve = resolve;
            await this.start(timeout);
        });
    }

    async NavigateToForm(timeout = 30000) {
        const swishData = await this.GetData(timeout);
        if (swishData) {
            // Spara i sessionStorage
            sessionStorage.setItem("swishData", JSON.stringify(swishData));
            // Navigera till form.html
            window.location.href = "form.html";
        }
    }

    // Interna funktioner
    _isSwishURL(text) {
        return text.startsWith("https://app.swish.nu/") || text.startsWith("A");
    }

    _parseSwishURL(url) {
        console.log(url)
        if(url[0] != "A"){
            const params = new URL(url).searchParams;
            if(params.get("sw") == "1231143205"){
                return {
                    "Swish-nummer": params.get("sw") || "",
                    "$": parseFloat(params.get("amt")) || "",
                    "Mottagare": "Perslunda Café",
                    "cur": params.get("cur") || "",
                    "Företag_Namn": "OCKELBO KOMMUN",
                    "ff": 1,
                    "alt": Object.fromEntries(params.entries())
                };
            }
            return {
                "Swish-nummer": params.get("sw") || "",
                "$": parseFloat(params.get("amt")) || "",
                "Mottagare": "",
                "cur": params.get("cur") || "",
                "msg": params.get("msg") || "",
                "ff": 0,
                "alt": Object.fromEntries(params.entries())
            };
        }else{
            const phoneNumber = url.replace("A", "").trim();
            const ma = getContactByPhoneNumber(phoneNumber); // <-- await here
            return {
                "Swish-nummer": phoneNumber || "",
                "Mottagare": ma || "",
                "ff": 0

            };
        }

    }

    
}
async function getContactByPhoneNumber(phoneNumber) {
    if (!('contacts' in navigator && 'ContactsManager' in window)) {
        console.log("Contacts API not supported in this browser.");
        return null;
    }

    try {
        const props = ['name', 'tel'];
        const opts = { multiple: true };
        const contacts = await navigator.contacts.select(props, opts);

        const contact = contacts.find(c =>
            c.tel.some(t => t.replace(/\D/g, '') === phoneNumber.replace(/\D/g, ''))
        );

        if (contact) return contact.name[0];
        return null;
    } catch (err) {
        console.error("Error accessing contacts:", err);
        return null;
    }
}
// Export
window.SwishQRCodeScanner = SwishQRCodeScanner;
