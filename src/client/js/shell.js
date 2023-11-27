const html = Shelf.template.quick

//TODO: Hotkeys

//* Toasts
{
    // TODO: General Notification Tracking
    let toasts = [],
        toast_list_element = document.querySelector("ul.toast-list"),
        toast_queue = [],
        toast_limit = 5, 
        toast_duration = 10000,
        ispaused = false


    const toast_notify = (message, criticality) => {
        if(toasts.length === toast_limit)
            toast_queue.push([message, criticality]);
        else {
            toasts.push(message)

            const is_serious = criticality === "High"

            let message_container = html`
                    <li class="toast-item"></li>
                `.firstChild

            if(is_serious) message_container.setAttribute("style-serious", "")
            
            let message_content = html`
                <p class="toast-message">${message}</p>
                <button class="close-button" [click]=${()=>{
                    message_container.remove()
                }}>
                    X
                </button>
            `

            message_container.append(message_content)
            toast_list_element.append(message_container)

            setTimeout(() => {
                toasts.pop()
                
                if(toast_list_element.children.length !== 0)
                    toast_list_element.removeChild(toast_list_element.firstChild);

                if(toast_queue.length > 0) 
                    notify(...toast_queue.shift());

            }, toast_duration)
        }
    }

    function pauseToastNotifications() {
        ispaused = true
    }

    function unpauseToastNotifications() {
        ispaused = false
    }

    function notify(message, criticality = "Low") {
        switch(criticality) {
            case "High":
            case "Medium":
                toast_notify(message, criticality)
            case "Low":
                break
            default:
        }
    }
}

function formatContent(content) {
    let container = document.createElement("div")
    container.append(content)
    return container.childNodes
}

function mountContent(parent, content) {
    for(let content_node of content) {
        parent.append(content_node.cloneNode(true))
    }
}

//* Modal
{
    let modal_element = document.querySelector("dialog.modal-window"),
        content_element = document.querySelector(".modal-content"),
        toast_container_element = document.querySelector(".toast-window"),
        visible = false,
        content_map = new Map()

    const addContent = (content, options = {}) => {
        let content_options = {
            show_background: true,
            ...options
        }

        let content_uuid = Symbol("Content UUID")
        
        content_map.set(content_uuid, {
            content: formatContent(content),
            options: content_options
        })

        return content_uuid
    }

    const openModal = (content_id) => {
        if(!content_map.has(content_id)) return;
        content_element.innerHTML = ""

        let content = content_map.get(content_id)

        if(!content.options.show_background) {
            content_element.setAttribute("style-hide-background", "")
        }

        mountContent(content_element, content.content)
        let close_buttons = content_element.querySelectorAll("[close-modal]")
        for(let button of close_buttons) {
            button.addEventListener("click", () => {
                closeModal()
            })
        }
        
        toast_container_element.classList.toggle("hide-toast-window")
        modal_element.show()
        pauseToastNotifications()
        visible = true
    }

    const closeModal = () => {
        toast_container_element.classList.toggle("hide-toast-window")
        modal_element.close()
        unpauseToastNotifications()
        visible = false
    }

    const isOpen = () => visible

    modal_element.addEventListener("click", event => {
        if (event.target === modal_element) {
            closeModal()
        }
    })


    globalThis.modal = {
        open: openModal,
        close: closeModal,
        isOpen,
        addView: addContent
    }
}


//* View Sizer
{
    let sizebar = document.querySelector(".content-sizebar"),
        sidebar = document.querySelector(".content-sidebar"),
        viewer = document.querySelector(".content-viewer"),
        container = document.querySelector("main")

    const primary_bar_width = Number(getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-bar-depth')
        .slice(0,-2))
    const bar_width = Number(getComputedStyle(document.documentElement)
        .getPropertyValue('--bar-depth')
        .slice(0,-2))
    const snap_padding = Number(getComputedStyle(document.documentElement)
        .getPropertyValue('--snap-padding')
        .slice(0,-2))


    let pressed = false,
        starting_horizontal_position = 0,
        mouse_horizontal_translation = 400

    let container_width = container.getBoundingClientRect().width - (
        primary_bar_width + bar_width
    )

    sizebar.addEventListener("mousedown", event => {
        pressed = true
        container.style.cursor = "grabbing"


        starting_horizontal_position = event.offsetX

        container_width = container.getBoundingClientRect().width - (
            primary_bar_width + bar_width
        )

        mouse_horizontal_translation = sidebar.getBoundingClientRect().width
        viewer.getBoundingClientRect().width
        sizebar.style.cursor = "grabbing"



    })
    sizebar.addEventListener("mouseup", _ => {
        sizebar.style.cursor = "grab"
    })
    window.addEventListener("mousedown", _ => {
        if(!pressed) return;
        sizebar.style.cursor = "grabbing"

    })

    window.addEventListener("mouseup", _ => {
        pressed = false
        container.style.cursor = "auto"

    })
    
    container.addEventListener("mousemove", event => {
        if(!pressed) return;

        event.preventDefault()

        mouse_horizontal_translation = event.clientX - primary_bar_width

        if(mouse_horizontal_translation < snap_padding) { 
            mouse_horizontal_translation = 0
            sizebar.style["border-left"] = "5px solid var(--color-mantle)"
            sidebar.style.display = "none"
        } else if(
            mouse_horizontal_translation > 
            (container_width + primary_bar_width - bar_width) - snap_padding
        ) { 
            mouse_horizontal_translation = container_width + primary_bar_width;
            sizebar.style["border-right"] = "5px solid var(--color-base)"
            viewer.style.display = "none"

        } else {
            sizebar.style["border"] = "0px"
            viewer.style.display = "block"
            sidebar.style.display = "block"
        }

        document
            .documentElement
            .style
            .setProperty('--max-sidebar-width', `${mouse_horizontal_translation}px`)
    })
}

//* Modes
{ 
    let mode = "action"

    let ContainerElement = document.querySelector(".mode-toggle"),
        TextElement = ContainerElement.querySelector("p")

    ContainerElement.addEventListener("click", _ => {
        switch(mode) {
            case "action":
                mode = "structure"
                TextElement.innerText = "Structure Mode"
                break
            case "structure":
                mode = "action"
                TextElement.innerText = "Action Mode"
                break
        }
    })

    function getMode() {return mode}
}
