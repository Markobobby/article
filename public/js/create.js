document.addEventListener("DOMContentLoaded", function DOMReady() {
    const deco = document.getElementById("deco");
    const form = document.getElementById("formulaireCreationArticle");
    const cancel = document.getElementById("cancel");
    // const test = document.getElementById("test");
    function request(isAutoSaved = false) {
        const inputName = document.getElementById("inputName").value;
        const inputPrix = document.getElementById("inputPrix").value;
        const desc = document.getElementById("description").value;
        const formData = { article: {} };
        formData.article.name = inputName;
        formData.article.prix = inputPrix;
        formData.article.desc = desc;

        formData.article.isAutoSave = isAutoSaved;

        console.log(formData);
        fetch("/save", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("data : ");
                console.log(data);
                if (data.error) {
                    return;
                }
                if (!data.isAutoSave) {
                    window.location.href = "/list";
                }
            });
    }
    // sauvegarde automatique toutes les minutes
    let x = 1;
    setInterval(() => {
        console.log("rafaichissement : %s", x);
        request(true);
        x++;
    }, 60000);

    form.addEventListener("submit", function submit(event) {
        event.preventDefault();
        request();
    });

    cancel.addEventListener("click", function cancel(event) {
        event.preventDefault();
        window.location.href = "list";
    });
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
});
