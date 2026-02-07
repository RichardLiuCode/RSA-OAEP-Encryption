document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("top-bar-generateKey-btn").addEventListener("click", function () {
        window.location.href = "./generateKeys.html";
    });
    document.getElementById("top-bar-encrypt-btn").addEventListener("click", function () {
        window.location.href = "./encrypt.html";
    });
    document.getElementById("top-bar-decrypt-btn").addEventListener("click", function () {
        window.location.href = "./decrypt.html";
    });
})