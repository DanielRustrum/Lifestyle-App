notify("Hello")
setTimeout(()=>{
    notify("Hello Worldsdfsdfsdfsdfsd")
}, 1000)
setTimeout(()=>{
    notify("Hello You")
}, 2000)

let modal_content_id = modal.content(Shelf.template.quick`<p>Hello World</p>`)
let modal_button = document.querySelector("#open-modal")
modal_button.addEventListener('click', () => {
    modal.open(modal_content_id)
})
let toast_button = document.querySelector("#open-toast")
let toast_clicked = 0
toast_button.addEventListener('click', () => {
    toast_clicked++
    notify(`clicked ${toast_clicked} times`)
})
