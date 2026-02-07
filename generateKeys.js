document.getElementById("generateKeyBtn").addEventListener("click", function () {
    window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: parseFloat(document.getElementById("KeySizeSelector").value),
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        }
        , true, ["encrypt", "decrypt"])
        .then(function (keyPair) {
            window.crypto.subtle.exportKey("spki", keyPair.publicKey)
                .then(function (exportedPublicKey) {
                    const exportedAsString = String.fromCharCode.apply(null, new Uint8Array(exportedPublicKey));
                    const exportedAsBase64 = btoa(exportedAsString);
                    const FullExportedPublicKey = "-----BEGIN PUBLIC KEY-----" + "\n" + exportedAsBase64 + "\n" + "-----END PUBLIC KEY-----";
                    console.log(FullExportedPublicKey)
                });
            window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
                .then(function (exportedPrivateKey) {
                    const exportedAsString = String.fromCharCode.apply(null, new Uint8Array(exportedPrivateKey));
                    const exportedAsBase64 = btoa(exportedAsString);
                    const FullExportedPrivateKey = "-----BEGIN PRIVATE KEY-----" + "\n" + exportedAsBase64 + "\n" + "-----END PRIVATE KEY-----";
                    console.log(FullExportedPrivateKey);
                })
        })
});