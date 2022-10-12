//Make the refresh button spin on click
function spinning() {
  const spinner = document.getElementById("spinner");
  spinner.classList.add("spinner");
  //Show notification when clicking the refresh button using toastr js
  const refreshButton = document.getElementById("refreshButton");
  refreshButton.blur();
  //remove the spin class again
  const spinTime = setTimeout(RemoveSpin, 1000);
  function RemoveSpin() {
    spinner.classList.remove("spinner");
  }
}

// refreshButton.onclick = function () {
//         toastr.success("Item added to your cart");
// }
refreshButton.addEventListener("click", function () {
  toastr.success("Item added to your cart");
});

toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};
