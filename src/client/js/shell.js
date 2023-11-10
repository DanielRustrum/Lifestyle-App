class DialogControl {
    constructor(selector, soft_close = true) {
        let dialog_element = document.querySelector("dialog"+selector)
        if(soft_close) {
            dialog_element.addEventListener("click", event => {
                if (event.target === dialog_element) {
                    dialog_element.close()
                }
            })
        }

        this.element = dialog_element
    }

    open() {
        this.element.show()
    }
    close() {
        this.element.close()
    }
}

{
    let toast = new DialogControl(".toast-window", false)
    let toasts = Shelf.signals.signal([])
    let toast_list_element = document.querySelector("ul.toast-list") 

    function notify(message) {
        if(toasts.value.length === 0) {
            toast.open()
        }

        toasts.value.push(message)
        let current_index = toasts.value.length - 1
        let message_element = Shelf.template.quick`
            <li class="toast-item">
                ${message}
                <button [click]=${()=>{
                    message_element.remove()
                }}>X</button>
            </li>
        `
        toast_list_element.append(message_element)

        setTimeout(() => {
            toasts.value.pop()
            toast_list_element.removeChild(toast_list_element.firstChild)

            if(toasts.value.length === 0) {
                toast.close()
            }
        }, 10000)
    }
    
    globalThis.notify = notify
}

notify("Hello")
setTimeout(()=>{
    notify("Hello Worldsdfsdfsdfsdfsd")

}, 1000)
setTimeout(()=>{

    notify("Hello You")
}, 2000)