let localStorageData = {};
window.addEventListener("load", function () {
    if (localStorage.getItem("Project:RSA-OAEP-Encryption")) {
        localStorageData = JSON.parse(localStorage.getItem("Project:RSA-OAEP-Encryption"));
        document.getElementById("input").value = localStorageData.inputEncryptedMessageForDecrypt || "";
        document.getElementById("privateKey").value = localStorageData.inputPrivateKeyForDecrypt || "";
    }
});
document.getElementById("input").addEventListener("input", function () {
    localStorageData.inputEncryptedMessageForDecrypt = document.getElementById("input").value;
    localStorage.setItem("Project:RSA-OAEP-Encryption", JSON.stringify(localStorageData));
});
document.getElementById("privateKey").addEventListener("input", function () {
    localStorageData.inputPrivateKeyForDecrypt = document.getElementById("privateKey").value;
    localStorage.setItem("Project:RSA-OAEP-Encryption", JSON.stringify(localStorageData));
});
document.getElementById("encryptBtn").addEventListener("click", function () {
    const encryptedMessage = document.getElementById("input").value;
    const binaryString = atob(encryptedMessage);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const encryptedBuffer = bytes.buffer;
    /* --------------------------------- */
    const privateKeyPem = document.getElementById("privateKey").value;
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = privateKeyPem.substring(pemHeader.length, privateKeyPem.length - pemFooter.length).replace("\n", "").replace("\n", "");
    const binaryDerString = atob(pemContents);
    const buf = new ArrayBuffer(binaryDerString.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0; i < binaryDerString.length; i++) {
        bufView[i] = binaryDerString.charCodeAt(i);
    }
    window.crypto.subtle.importKey(
        "pkcs8",
        buf,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["decrypt"])
        .then(function (importedPrivateKey) {
            window.crypto.subtle.decrypt(
                {
                    name: "RSA-OAEP"
                },
                importedPrivateKey,
                encryptedBuffer
            )
                .then(function (decryptedMessage) {
                    const decoder = new TextDecoder();
                    document.getElementById("result").value = decoder.decode(decryptedMessage);
                });
        });
});