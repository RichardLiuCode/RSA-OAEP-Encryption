let localStorageData = {};
if (localStorage.getItem("Project:RSA-OAEP-Encryption")) {
    localStorageData = JSON.parse(localStorage.getItem("Project:RSA-OAEP-Encryption"));
    document.getElementById("input").value = localStorageData.inputOriginalMessageForEncrypt || "";
    document.getElementById("publicKey").value = localStorageData.inputPublicKeyForEncrypt || "";
    document.getElementById("result").value = localStorageData.encyptedMessage || "";
}
document.getElementById("input").addEventListener("input", function () {
    localStorageData.inputOriginalMessageForEncrypt = this.value;
    localStorage.setItem("Project:RSA-OAEP-Encryption", JSON.stringify(localStorageData));
});
document.getElementById("publicKey").addEventListener("input", function () {
    localStorageData.inputPublicKeyForEncrypt = this.value;
    localStorage.setItem("Project:RSA-OAEP-Encryption", JSON.stringify(localStorageData));
});
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
        RawKey = RawKey.substring(26, RawKey.length);
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
        }, 2000);
    } else {
        const binaryDerString = atob(RawKey);
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
                        let bytes = new Uint8Array(encryptedMessage);
                        let binary = "";
                        for (let i = 0; i < bytes.length; i++) {
                            binary = binary + String.fromCharCode(bytes[i]);
                        }
                        const readableEncryptedMessage = btoa(binary);
                        document.getElementById("result").value = readableEncryptedMessage;
                        localStorageData.encyptedMessage = document.getElementById("result").value;
                        localStorage.setItem("Project:RSA-OAEP-Encryption", JSON.stringify(localStorageData));
                    });
            });
    }

});