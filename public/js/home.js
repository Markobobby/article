document.addEventListener("DOMContentLoaded", function DOMReady() {
    const form = document.getElementById("formLogin");
    const inputLogin = document.getElementById("inputLogin");

    form.addEventListener("submit", function submit(event) {
        event.preventDefault();
        const login = inputLogin.value;
        console.log(`login: ${login}`);
        fetch("/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ login })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.error) {
                    // Exploiter l'erreur !
                    return;
                }
                window.location.href = "/create";
            });
        // Send HTTP Post request here!
    });

    // let x = 1;
    // setInterval(() => {
    //     console.log("rafaichissement : %s", x);
    //     x++;
    // }, 60000);
});
