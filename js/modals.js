const sample_slide = `{
    "title": "Untitled",
    "content": [
    ]
  }`
const edit_links = document.getElementById("edit-links");
const edit_links_content = document.getElementById("edit-links-content");
const edit_link = document.getElementById("edit-link");
const edit_link_content = document.getElementById("edit-link-content");
const edit_link_title = document.getElementById("edit-link-title");
const input_text = document.getElementById("input-text");
const input_link = document.getElementById("input-link");
const preview_card = document.getElementById("preview-card");
const notification = document.getElementById("notification");
const input_title = document.getElementById("input-title");
const input_hint = document.getElementById("input-hint");
const input_link_hint = document.getElementById("input-link-hint");
const maxSlideLength = getCssVariable("slide-rows") * getCssVariable("slide-cols");
const confirm_dialog = document.getElementById("confirm-dialog");
const confirm_text = document.getElementById("confirm-text");
const confirm_positive = document.getElementById("confirm-positive");
const confirm_negative = document.getElementById("confirm-negative");
const editable_slides = document.getElementById("editable-slides");
const edit_links_prev = document.getElementById("edit-links-prev");
const edit_links_next = document.getElementById("edit-links-next");

var current_link = {};
var current_editable_slide = 0;
var can_scroll_modals = true;
var currently_dragging_slide_i = -1;
var currently_dragging_link_i = -1;

editable_slides.addEventListener("wheel", changeEditableSlidesByWheel);
document.addEventListener("keydown", keyPressed);
onLoadCheck();
showEditableSlides();

// INITIALIZATION

function onLoadCheck() {
    if (window.location.hash == "#restored") {
        showNotification("Default links were restored.", false, 3000);
        window.location.hash = "";
    }
}

function changeEditableSlidesByWheel(event) {
    event.preventDefault();
    input_title.blur();
    if (can_scroll_modals) {
        if (event.deltaY > 0) {
            nextEditableSlide();
        } else {
            previousEditableSlide();
        }
        can_scroll_modals = false;
        Promise.all(
            editable_slides.getAnimations().map((animation) => animation.finished),
        ).then(() => { can_scroll_modals = true; })
    }
}

function keyPressed(event) {
    if (event.target.nodeName == "BODY" && !event.repeat) {
        if (confirm_dialog.classList.contains("confirm-opened")) {
            if (keybinding.confirm_negative.includes(event.key)) {
                confirm_negative.click();
            } else if (keybinding.confirm_positive.includes(event.key)) {
                confirm_positive.click();
            }
        } else if (edit_link.classList.contains("modal-opened")) {
            if (keybinding.preview.includes(event.key)) {
                preview_card.click();
            } else if (keybinding.close.includes(event.key)) {
                hideEditLink();
            }
        } else if (edit_links.classList.contains("modal-opened")) {
            if (!isNaN(event.key)) {
                let n = Number(event.key);
                if (n == 0)
                    n = 10;
                n -= 1;
                if (n < maxSlideLength) {
                    getLinkOnSlide(current_editable_slide, n).click();
                }
            } else if (event.ctrlKey && event.key == 's') {
                event.preventDefault();
                saveLinks();
            } else if (keybinding.next_slide.includes(event.key)) {
                nextEditableSlide();
            } else if (keybinding.previous_slide.includes(event.key)) {
                previousEditableSlide();
            } else if (keybinding.close.includes(event.key)) {
                hideEditLinks();
            } else if (keybinding.add_slide.includes(event.key)) {
                addSlide();
            } else if (keybinding.remove_slide.includes(event.key)) {
                removeSlide();
            } else if (keybinding.import_links.includes(event.key)) {
                importLinks();
            } else if (keybinding.export_links.includes(event.key)) {
                exportLinks();
            } else if (keybinding.reset_links.includes(event.key)) {
                removeLinks();
            }
        } else {
            if (!isNaN(event.key)) {
                let n = Number(event.key);
                if (n == 0)
                    n = 10;
                n -= 1;
                if (n < maxSlideLength) {
                    slides.children[current_slide].children[n].click();
                }
            } else if (keybinding.next_slide.includes(event.key)) {
                nextSlide();
            } else if (keybinding.previous_slide.includes(event.key)) {
                previousSlide();
            } else if (keybinding.open_edit_links.includes(event.key)) {
                showEditLinks();
            } else if (keybinding.focus_on_search.includes(event.key)) {
                event.preventDefault();
                search_bar.focus();
            }
        }
    }
}

// UNIVERSAL FUNCTIONS

function parseId(id_string) {
    match = id_string.match(/^link([0-9]+)-([0-9]+)$/);
    if (match) {
        return [Number(match[1]), Number(match[2])];
    }
}

function getLinkOnSlide(slide_i, link_i) {
    return document.getElementById(`link${slide_i}-${link_i}`);
}

// NOTIFICATIONS AND CONFIRM

function showNotification(message, is_warning, delay) {
    if (notification.classList.contains("notification-opened")) {
        hideNotification();
        Promise.all(
            notification.getAnimations().map((animation) => animation.finished),
        ).then(() => showNotification(message, is_warning, delay));
    } else {
        let creation_date = String(new Date().getTime())
        notification.dataset.creationDate = creation_date;
        notification.classList.add("notification-opened");
        if (is_warning) {
            notification.classList.add("notification-warning");
        }
        notification.innerHTML = message;

        if (!delay) {
            delay = 10000;
        }
        new Promise(resolve => setTimeout(resolve, delay)).then(() => hideNotification(creation_date));
    }
}

function hideNotification(creation_date) {
    if (!creation_date || notification.dataset.creationDate == creation_date) {
        notification.classList = ["notification"];
        delete notification.dataset.creationDate;
    }
}

function showConfirmDialog(message, positive_callback = () => { }, negative_callback = () => { }, positive_label = "Yes", negative_label = "No") {
    confirm_text.innerHTML = message;
    confirm_positive.innerHTML = positive_label;
    confirm_negative.innerHTML = negative_label;
    confirm_positive.onclick = () => {
        positive_callback();
        hideConfirmDialog();
    };
    confirm_negative.onclick = () => {
        negative_callback();
        hideConfirmDialog();
    };
    confirm_dialog.classList.add("confirm-opening");
    new Promise(resolve => setTimeout(resolve, 1)).then(() => {
        confirm_dialog.classList.add("confirm-opened");
    });
}

function hideConfirmDialog() {
    confirm_dialog.classList.remove("confirm-opened");
    Promise.all(
        confirm_dialog.getAnimations().map((animation) => animation.finished),
    ).then(() => { confirm_dialog.classList.remove("confirm-opening") })
}

// MODALS

function showModal(modal, modal_content) {
    modal.classList.add("modal-opening");
    modal_content.classList.add("modal-content-opening");
    new Promise(resolve => setTimeout(resolve, 1)).then(() => {
        modal.classList.add("modal-opened");
        modal_content.classList.remove("modal-content-opening");
    });
}

function hideModal(modal, modal_content) {
    modal.classList.remove("modal-opened");
    modal_content.classList.add("modal-content-opening");
    Promise.all(
        modal.getAnimations().map((animation) => animation.finished),
    ).then(() => {
        modal.classList.remove("modal-opening");
        modal_content.classList.remove("modal-content-opening");
    });
}

function clickedModalBackground(event) {
    if (!config.force_x_button) {
        if (event.target.id == "edit-link-background") {
            hideEditLink();
        } else if (event.target.id == "edit-links-background") {
            hideEditLinks();
        }
    }
}

// EDIT LINKS DIALOG

function showEditLinks() {
    goToEditableSlide(current_slide);
    showModal(edit_links, edit_links_content);
    loadEditableLinks();
    updateSlideButtons();
}

function hideEditLinks() {
    generateLinks();
    goToSlide(current_editable_slide);
    hideModal(edit_links, edit_links_content);
}

function loadEditableLinks() {
    let item = storage.getItem("links");
    if (item) {
        links = JSON.parse(item);
        generateEditableLinks();
    }
    else {
        links = default_links;
        generateEditableLinks();
    }
}

function generateEditableLinks() {
    if (config.auto_save) {
        saveLinks(true);
    }
    editable_slides.innerHTML = "";
    let slides_i = 0;
    links.forEach((slide) => {
        let res_div = document.createElement("div");
        res_div.classList.add("slide");
        let res_html = "";
        let link_i = 0;
        slide.content.forEach((link) => {
            res_html += `
        <a id="link${slides_i}-${link_i}"
           href="#"
           onclick="showEditLink(${slides_i}, ${link_i})"
           class="card"
           draggable=true
           ondragstart="editLinksDragStart(event)"
           ondragend="editLinksDragEnd(event)"
           ondrop="editLinksDrop(event)"
           ondragover="allowEditLinksDrop(event)"
           ondragenter="editLinksDragEnter(event)"
           ondragleave="editLinksDragLeave(event)"
           >
          ${link.value}
        </a>`;
            link_i += 1;
        });

        if (slide.content.length < maxSlideLength) {
            res_html += `
                <a id="link${slides_i}-${slide.content.length}"
                   href="#"
                   onclick="createNewLink(${slides_i})"
                   class="card new-link"
                   draggable=false
                   ondrop="editLinksDrop(event)"
                   ondragenter="newLinkDragEnter(event)"
                   ondragleave="newLinkDragLeave(event)"
                   ondragover="allowEditLinksDrop(event)"
                   >
                   樂
                </a>`;
        }

        res_div.innerHTML = res_html;
        editable_slides.append(res_div);
        slides_i += 1;
    });
}

function createNewLink(slide_i) {
    let slide = links[slide_i].content;
    if (slide.length < maxSlideLength) {
        slide.push({ link: "https://example.com", value: "" });
        showEditLink(slide_i, slide.length - 1);
    } else {
        showNotification("Cannot create the link: this slide is full.", true, 3000);
    }
}

function showEditableSlides() {
    var links_slides = editable_slides;
    if (current_editable_slide > links.length - 1) {
        current_editable_slide = 0;
    }
    if (current_editable_slide < 0) {
        current_editable_slide = links.length - 1;
    }
    input_title.value = links[current_editable_slide].title;
    links_slides.style.transform = `translateY(
        calc(-${current_editable_slide} * (var(--slide-cols) * var(--slide-col-height)
             + var(--slide-gap) * (var(--slide-cols) - 1) + var(--slide-padding) * 2)))`;
}

function nextEditableSlide() {
    current_editable_slide += 1;
    showEditableSlides();
}

function previousEditableSlide() {
    current_editable_slide -= 1;
    showEditableSlides();
}

function goToEditableSlide(n) {
    current_editable_slide = n;
    showEditableSlides();
}

function addSlide() {
    links.splice(current_editable_slide + 1, 0, JSON.parse(sample_slide));
    generateEditableLinks();
    updateSlideButtons();
    nextEditableSlide();
}

function removeSlide() {
    if (links[current_editable_slide].content.length == 0) {
        confidentlyRemoveSlide();
    } else {
        showConfirmDialog("This will remove this slide. Are you sure?", confidentlyRemoveSlide);
    }
}

function confidentlyRemoveSlide() {
    if (links.length > 1) {
        let c_slide = current_editable_slide;
        previousEditableSlide();
        links.splice(c_slide, 1);
        generateEditableLinks();
        if (c_slide == 0) {
            Promise.all(
                editable_slides.getAnimations().map((animation) => animation.finished),
            ).then(previousEditableSlide);
        }
    } else {
        addSlide()
        links.splice(0, 1);
        generateEditableLinks();
        Promise.all(
            editable_slides.getAnimations().map((animation) => animation.finished),
        ).then(previousEditableSlide);
    }
    updateSlideButtons();
}

function updateSlideTitle() {
    if (input_title.value) {
        links[current_editable_slide].title = input_title.value;
    }
    generateEditableLinks();
}

function updateSlideButtons() {
    if (links.length <= 1) {
        edit_links_prev.style.color = "var(--fg-faint)"
        edit_links_next.style.color = "var(--fg-faint)"
        edit_links_prev.style.cursor = "default"
        edit_links_next.style.cursor = "default"
    }
    else {
        edit_links_prev.style.color = "var(--fg)"
        edit_links_next.style.color = "var(--fg)"
        edit_links_prev.style.cursor = "pointer"
        edit_links_next.style.cursor = "pointer"
    }
}

// EDIT LINKS DRAG & DROP

function editLinksDragStart(event) {
    ids = parseId(event.target.id);
    currently_dragging_slide_i = ids[0];
    currently_dragging_link_i = ids[1];
    event.dataTransfer.setData("text", ids[0] + ";" + ids[1]);
    event.target.classList.add("dragging");
}

function editLinksDragEnd(event) {
    event.target.style.transitionDuration = "0s";
    event.target.classList.remove("dragging");
    Promise.all(
        event.target.getAnimations().map((animation) => animation.finished),
    ).then(() => event.target.style.transitionDuration = "");
}

function editLinksDragEnter(event) {
    event.preventDefault();
    ids = parseId(event.target.id);
    let is_left = false;
    if (ids[0] != currently_dragging_slide_i && links[ids[0]].content.length >= maxSlideLength)
        return;
    if (ids[0] == currently_dragging_slide_i) {
        is_left = ids[1] > currently_dragging_link_i;
    }
    event.target.style.transform = `translate(calc(${is_left ? -1 : 1} * var(--slide-gap) / 2))`;
}

function editLinksDragLeave(event) {
    event.preventDefault();
    event.target.style.transform = ""
}

function allowEditLinksDrop(event) {
    event.preventDefault();
}

function editLinksDrop(event) {
    event.preventDefault();
    let parsed_ids = parseId(event.target.id);
    let slides_i = parsed_ids[0];
    let link_i = parsed_ids[1];
    let text = event.dataTransfer.getData("text");
    if (text.match(/^[0-9]+;[0-9]+$/)) {
        let ids = text.split(";");
        if (ids[0] == slides_i || links[slides_i].content.length < maxSlideLength) {
            let dragged = links[ids[0]].content.splice(ids[1], 1)[0];
            links[slides_i].content.splice(link_i, 0, dragged);
            animateInsertingLink(Number(ids[0]), Number(ids[1]), slides_i, link_i);
        } else {
            showNotification("Cannot move the link: this slide is full.", true, 3000);
            goToEditableSlide(ids[0]);
        }
    }
}

function slideControlDragEnter(event) {
    if (can_scroll_modals) {
        let which_way = event.target.parentElement.classList[0];
        if (which_way == "next") {
            nextEditableSlide();
        } else if (which_way == "prev") {
            previousEditableSlide();
        }
        can_scroll_modals = false;
        Promise.all(
            editable_slides.getAnimations().map((animation) => animation.finished),
        ).then(() => { can_scroll_modals = true; })
    }
}

function modalDragEnter(event) {
    event.target.style.backgroundColor = "var(--warn)";
    event.target.style.opacity = "80%";
}

function modalDragLeave(event) {
    event.target.style.backgroundColor = "";
    event.target.style.opacity = "";
}

function allowModalDrop(event) {
    event.preventDefault();
}

function modalDrop(event) {
    event.preventDefault();
    let text = event.dataTransfer.getData("text");
    if (text.match(/^[0-9]+;[0-9]+$/)) {
        let ids = text.split(";");
        showConfirmDialog("This will remove the link. Are you sure?", () => {
            links[ids[0]].content.splice(ids[1], 1);
            animateRemovingLink(Number(ids[0]), Number(ids[1]));
        });
    }
    event.target.style.backgroundColor = "";
    event.target.style.opacity = "";
}

// EDIT LINKS MENU

function saveLinks(quiet) {
    storage.setItem("links", JSON.stringify(links));
    if (!quiet) {
        if (config.auto_save) {
            showNotification(`Saved!<br><br>Notice: "auto save" is on.<br>You don't need to save manually.`, false, 10000);
        } else {
            showNotification("Saved!", false, 3000);
        }
    }
}

function exportLinks() {
    let blob_file = new Blob([JSON.stringify(links)], { type: "text/plain" });
    let url = window.URL.createObjectURL(blob_file);
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "links.json";
    a.click();
    window.URL.revokeObjectURL(url);
}

function loadLinksFromFile(event) {
    try {
        links = JSON.parse(event.target.result);
        if (links) {
            generateEditableLinks();
            showNotification("Links were imported successfully!", false, 3000);
        } else {
            showNotification("Nothing was imported.", true, 3000);
        }
    } catch (e) {
        showNotification(e.message, true, 10000);
    }
}

function importLinks() {
    let file_input = document.createElement('input');
    file_input.type = 'file';
    file_input.onchange = uploadFile;
    file_input.click();
}

function uploadFile(event) {
    let file_reader = new FileReader();
    file_reader.onload = loadLinksFromFile;
    file_reader.readAsText(event.target.files[0], 'UTF-8');
}

function removeLinks() {
    showConfirmDialog("This will restore default links. Are you sure?", () => {
        storage.clear();
        loadEditableLinks();
        window.location.hash = "#restored";
        window.location.reload();
    });
}

// EDIT LINK DIALOG

function showEditLink(slides_i, link_i) {
    current_link = links[slides_i].content[link_i];

    edit_link_title.innerHTML = "Edit Link #" + (slides_i + 1) + ";" + (link_i + 1);
    input_text.value = current_link.value;
    input_link.value = current_link.link;

    showModal(edit_link, edit_link_content);
    updatePreview();
}

function hideEditLink() {
    hideModal(edit_link, edit_link_content);
    current_link.value = input_text.value;
    current_link.link = input_link.value;
    generateEditableLinks();
}

function fixProtocol() {
    input_link.value = "https://" + input_link.value;
    updatePreview();
}

function updatePreview() {
    preview_card.innerHTML = input_text.value;
    if (input_link.value.match(/\w+:/gi)) {
        input_link_hint.classList.remove("input-hint-enabled");
    } else {
        input_link_hint.classList.add("input-hint-enabled");
    }
    preview_card.href = input_link.value;
}

// EDIT LINK DRAG & DROP

function newLinkDragEnter(event) {
    event.preventDefault();
    event.target.style.opacity = "30%";
}

function newLinkDragLeave(event) {
    event.preventDefault();
    event.target.style.opacity = "";
}

function editLinkDrop(event) {
    event.preventDefault();
    let text = event.dataTransfer.getData("text");
    event.target.value = text;
    updatePreview();
}

// ANIMATIONS

function moveCardToPosition(src_slide, src_link, dest_slide, dest_link) {
    let slide_rows = parseInt(getCssVariable("slide-rows"));
    let slide_cols = parseInt(getCssVariable("slide-cols"));
    let link = getLinkOnSlide(src_slide, src_link);
    let delta_x = dest_link % slide_rows - src_link % slide_rows;
    let delta_y = Math.floor(dest_link / slide_rows) - Math.floor(src_link / slide_rows)
    let delta_slide = slide_cols * (dest_slide - src_slide);
    link.style.transform = `translate(
                calc(${delta_x} * (var(--slide-row-width) + var(--slide-gap))),
                calc(${delta_y + delta_slide} * (var(--slide-col-height) + var(--slide-gap))
                   + ${dest_slide - src_slide} * var(--slide-gap)))`;
}

function moveCardBack(src_slide, src_link) {
    if (src_link <= 0) {
        return;
    }
    moveCardToPosition(src_slide, src_link, src_slide, src_link - 1);
}

function moveCardForward(src_slide, src_link) {
    if (src_link >= (maxSlideLength - 1)) {
        return;
    }
    moveCardToPosition(src_slide, src_link, src_slide, src_link + 1);
}

function clearAllCardTransforms() {
    Array.from(document.getElementsByClassName("card")).forEach((card) => {
        card.style.transitionDuration = "0s";
        card.style.transform = "";
        Promise.all(
            card.getAnimations().map((animation) => animation.finished),
        ).then(() => card.style.transitionDuration = "")
    })
}

function animateInsertingLink(src_slide, src_link, dest_slide, dest_link) {
    if (src_slide == dest_slide) {
        if (src_link < dest_link) {
            for (i = src_link + 1; i <= dest_link; i++) {
                moveCardBack(src_slide, i);
            }
        }
        else {
            for (i = dest_link; i < src_link; i++) {
                moveCardForward(src_slide, i);
            }
        }
        getLinkOnSlide(src_slide, src_link).style.transitionDuration = "0s";
    } else {
        for (i = dest_link; i < links[dest_slide].content.length; i++) {
            moveCardForward(dest_slide, i)
        }
    }
    moveCardToPosition(src_slide, src_link, dest_slide, dest_link);
    Promise.all(getLinkOnSlide(dest_slide, dest_link).getAnimations().map(
        (animation) => animation.finished)).then(() => generateEditableLinks());
}

function animateRemovingLink(src_slide, src_link) {
    for (i = src_link; i <= links[src_slide].content.length; i++) {
        moveCardBack(src_slide, i);
    }
    getLinkOnSlide(src_slide, src_link).style.transform = "translateX(-9999px)";
    if (links[src_slide].content.length == maxSlideLength - 1) {
        Promise.all(getLinkOnSlide(src_slide, maxSlideLength - 2).getAnimations().map(
            (animation) => animation.finished)).then(() => generateEditableLinks());
    } else {
        let new_link = getLinkOnSlide(src_slide, links[src_slide].content.length + 1);
        moveCardBack(src_slide, links[src_slide].content.length + 1)
        Promise.all(new_link.getAnimations().map(
            (animation) => animation.finished)).then(() => generateEditableLinks());
    }
}