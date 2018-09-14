document.addEventListener("DOMContentLoaded", function DOMReady() {
    const deco = document.getElementById("deco");
    const addArticle = document.getElementById("addArticle");

    deco.addEventListener("click", function deco(event) {
        fetch("/logout", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    return;
                }
            });
        location.reload();
    });

    addArticle.addEventListener("click", function addArticel() {
        window.location.href = "/create";
    });
});
