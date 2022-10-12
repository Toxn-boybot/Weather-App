//Make the refresh button spin on click 
function spinning() {
    const spinner = document.getElementById("spinner");
    spinner.classList.add("spinner");
    const refreshButton = document.getElementById("refreshButton");
    refreshButton.blur();
    //remove the spin class again
    const spinTime = setTimeout(RemoveSpin, 1000);
    function RemoveSpin() {
        spinner.classList.remove("spinner");
    }
}