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
    const privateKeyPem = document.getElementById("privateKey").value;
});