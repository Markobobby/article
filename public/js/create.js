$(function() {
    $("#formulaireCreationArticle").on("submit", function(event) {
        event.preventDefault();
        const url="/save", 
            param = $(this).serialize();
        // $.post(url, param, function(){});
    });
    let x = 1;
    setInterval(() => {
        console.log("rafaichissement : %s", x);
        x++;
    }, 60000);
});
