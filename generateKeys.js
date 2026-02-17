let localStorageData = {};
window.addEventListener("load", function () {
    if (localStorage.getItem("Project:RSA-OAEP-Encryption")) {
        localStorageData = JSON.parse(localStorage.getItem("Project:RSA-OAEP-Encryption"));
        document.getElementById("resultWrapper").style.display = "revert";
        document.getElementById("publicKeyDisplayArea").innerText = localStorageData.generatedPublicKey || "";
        document.getElementById("PublicKeyCopyButton").addEventListener("click", function () {
            if (navigator.clipboard.writeText) {
                navigator.clipboard.writeText(localStorageData.generatedPublicKey || "");
                document.getElementById("publicKeyCopyStatus").style.display = "flex";
                document.getElementById("publicKeyCopyStatus").innerText = "Key copied";
            } else {
                document.getElementById("publicKeyCopyStatus").innerText = "Failed to copy key";
            }
            setTimeout(function () {
                document.getElementById("publicKeyCopyStatus").innerText = "";
                document.getElementById("publicKeyCopyStatus").style.display = "none";
            }, 3000);
        });
        document.getElementById("privateKeyDisplayArea").innerText = localStorageData.generatedPrivateKey || "";
        document.getElementById("PrivateKeyCopyButton").addEventListener("click", function () {
            if (navigator.clipboard.writeText) {
                navigator.clipboard.writeText(localStorageData.generatedPrivateKey || "");
                document.getElementById("privateKeyCopyStatus").style.display = "flex";
                document.getElementById("privateKeyCopyStatus").innerText = "Key copied";
            } else {
                document.getElementById("privateKeyCopyStatus").innerText = "Failed to copy key";
            }
            setTimeout(function () {
                document.getElementById("privateKeyCopyStatus").innerText = "";
                document.getElementById("privateKeyCopyStatus").style.display = "none";
            }, 3000);
        });
    } else {
        document.getElementById("resultWrapper").style.display = "none";
    }
});
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
                    const copyKey = function () {
                        if (navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(FullExportedPublicKey);
                            document.getElementById("publicKeyCopyStatus").style.display = "flex";
                            document.getElementById("publicKeyCopyStatus").innerText = "Key copied";
                        } else {
                            document.getElementById("publicKeyCopyStatus").innerText = "Failed to copy key";
                        }
                        setTimeout(function () {
                            document.getElementById("publicKeyCopyStatus").innerText = "";
                            document.getElementById("publicKeyCopyStatus").style.display = "none";
                        }, 3000);

                    };
                    localStorageData.generatedPublicKey = FullExportedPublicKey;
                    localStorage.setItem("Project:RSA-OAEP-Encryption", JSON.stringify(localStorageData));
                    document.getElementById("PublicKeyCopyButton").removeEventListener("click", copyKey);
                    document.getElementById("PublicKeyCopyButton").addEventListener("click", copyKey);
                    document.getElementById("publicKeyDisplayArea").innerText = FullExportedPublicKey;
                    document.getElementById("resultWrapper").style.display = "revert";
                });
            window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
                .then(function (exportedPrivateKey) {
                    const exportedAsString = String.fromCharCode.apply(null, new Uint8Array(exportedPrivateKey));
                    const exportedAsBase64 = btoa(exportedAsString);
                    const FullExportedPrivateKey = "-----BEGIN PRIVATE KEY-----" + "\n" + exportedAsBase64 + "\n" + "-----END PRIVATE KEY-----";
                    const copyKey = function () {
                        if (navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(FullExportedPrivateKey);
                            document.getElementById("privateKeyCopyStatus").style.display = "flex";
                            document.getElementById("privateKeyCopyStatus").innerText = "Key copied";
                        } else {
                            document.getElementById("privateKeyCopyStatus").innerText = "Failed to copy key";
                        }
                        setTimeout(function () {
                            document.getElementById("privateKeyCopyStatus").innerText = "";
                            document.getElementById("privateKeyCopyStatus").style.display = "none";
                        }, 3000);
                    };
                    localStorageData.generatedPrivateKey = FullExportedPrivateKey;
                    localStorage.setItem("Project:RSA-OAEP-Encryption", JSON.stringify(localStorageData));
                    document.getElementById("PrivateKeyCopyButton").removeEventListener("click", copyKey);
                    document.getElementById("PrivateKeyCopyButton").addEventListener("click", copyKey);
                    document.getElementById("privateKeyDisplayArea").innerText = FullExportedPrivateKey;
                });
        });
});