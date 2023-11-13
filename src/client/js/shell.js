{
    let toasts = Shelf.signals.signal([]),
        toast_list_element = document.querySelector("ul.toast-list"),
        toast_queue = [],
        toast_limit = 5,
        ispaused = false,
        pause_time = null,
        max_wait_time = 20

    let html = Shelf.template.quick

    const toast_notify = message => {
        if(toasts.value.length === toast_limit)
            toast_queue.push(message);
        else {
            toasts.value.push(message)
            
            let message_container = html`<li class="toast-item"></li>`.firstChild
            let message_content = html`
                <p>${message}</p>
                <button class="close-button" [click]=${()=>{
                    message_container.remove()
                }}>
                    X
                </button>
            `

            message_container.append(message_content)
            toast_list_element.append(message_container)


            setTimeout(() => {
                toasts.value.pop()
                toast_list_element.removeChild(toast_list_element.firstChild)

                if(toast_queue.length > 0) 
                    notify(toast_queue.shift());

            }, 10000)
        }
    }

    function pauseToastNotifications() {}
    function unpauseToastNotifications() {}

    function notify(message, criticality = "Low") {
        toast_notify(message)
    }
}

{
    let modal_element = document.querySelector("dialog.modal-window"),
        content_element = document.querySelector(".modal-content"),
        visible = false,
        content_map = new Map()

    modal_element.addEventListener("click", event => {
        if (event.target === modal_element) {
            modal_element.close()
        }
    })

    const addContent = (content) => {
        let content_uuid = null
        do {
            content_uuid = crypto.randomUUID()
        } while (content_uuid === null || content_map.has(content_uuid))
        
        let container = document.createElement("div")
        container.append(content)

        content_map.set(content_uuid, container.childNodes)
        return content_uuid
    }

    const openModal = (content_id) => {
        if(!content_map.has(content_id)) return;
        content_element.innerHTML = ""

        let modal_content = content_map.get(content_id)
        
        for(let content_node of modal_content) {
            content_element.append(content_node.cloneNode(true))
        }

        modal_element.show()
        pauseToastNotifications()
        visible = true

    }
    const closeModal = () => {
        modal_element.close()
        unpauseToastNotifications()
        visible = false
    }
    const isOpen = () => visible

    globalThis.modal = {
        open: openModal,
        close: closeModal,
        isOpen,
        content: addContent
    }
}

