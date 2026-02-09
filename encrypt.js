document.getElementById("encryptBtn").addEventListener("click", function () {
    if (document.getElementById("input").value == "") {
        return;
    }
    if (document.getElementById("publicKey").value == "") {
        return;
    }
    const invalidKeyMsg = "Invalid Public Key";
    let invalidKey = false;
    const inputMessage = document.getElementById("input").value;
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(inputMessage);
    const inputPublicKey = document.getElementById("publicKey").value;
    let RawKey = inputPublicKey;
    if (RawKey.substring(0, 26) == "-----BEGIN PUBLIC KEY-----") {
        RawKey = RawKey.substring(26, RawKey.length)
    } else {
        invalidKey = true;
    }
    if (RawKey.substring(RawKey.length - 24, RawKey.length) == "-----END PUBLIC KEY-----") {
        RawKey = RawKey.substring(0, RawKey.length - 24);
    } else {
        invalidKey = true;
    }
    if (invalidKey) {
        document.getElementById("status").innerText = invalidKeyMsg;
        setTimeout(function () {
            document.getElementById("status").innerText = "";
        }, 2000)
    } else {
        const binaryDerString = atob(RawKey)
        const binaryDer = new Uint8Array(binaryDerString.length);
        for (let i = 0; i < binaryDerString.length; i++) {
            binaryDer[i] = binaryDerString.charCodeAt(i);
        }
        const buffer = binaryDer.buffer;
        window.crypto.subtle.importKey(
            "spki",
            buffer,
            {
                name: "RSA-OAEP", hash: "SHA-256"
            },
            true,
            ["encrypt"]
        )
            .then(function (importedKey) {
                window.crypto.subtle.encrypt(
                    { name: "RSA-OAEP" },
                    importedKey,
                    encodedMessage)
                    .then(function (encryptedMessage) {
                        const encryptedMessageUint8Array = new Uint8Array(encryptedMessage);
                        const encryptedMessageHex = encryptedMessageUint8Array.map(b => b.toString(16).padStart(2, "0")).join("");
                        document.getElementById("result").value = encryptedMessageHex;
                    })
            })
    }

})