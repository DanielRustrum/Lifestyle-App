
let modal_view_id = modal.addView(html`
    <p>Hello World</p>
    <button close-modal>Close</button>
`, {show_background: false})
let modal_button = document.querySelector("#open-modal")
modal_button.addEventListener('click', () => {
    modal.open(modal_view_id)
})
let toast_button = document.querySelector("#open-toast")
let toast_clicked = 0
toast_button.addEventListener('click', () => {
    toast_clicked++
    notify(`clicked ${toast_clicked} times`, "Medium")
})

let serious_toast_button = document.querySelector("#open-serious-toast")
serious_toast_button.addEventListener('click', () => {
    notify(`This Is Serious!`, "High")
})