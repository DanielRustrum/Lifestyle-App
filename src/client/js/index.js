let modal = new DialogControl(".modal-window")
let modal_button = document.querySelector("#open-modal")
modal_button.addEventListener('click', () => {
    modal.open()
})
let toast_button = document.querySelector("#open-toast")
toast_button.addEventListener('click', () => notify("clicked"))
