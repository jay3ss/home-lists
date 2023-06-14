// To have a function called every time the localStorage is changed:
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
// /Using_the_Web_Storage_API#responding_to_storage_changes_with_the_storageevent
// window.addEventListener("storage", (e) => {
//   document.querySelector(".my-key").textContent = e.key;
//   document.querySelector(".my-old").textContent = e.oldValue;
//   document.querySelector(".my-new").textContent = e.newValue;
//   document.querySelector(".my-url").textContent = e.url;
//   document.querySelector(".my-storage").textContent = JSON.stringify(
//     e.storageArea
//   );
// });


function startApp(anchor = "#app") {
    if (!getAnchor()) {
        setAnchor(anchor);
        updateHighestKey();
    } else {
        displayList();
    }
    createForm();
}


function getAnchor() {
    return localStorage.getItem("anchor");
}


function setAnchor(anchor) {
    localStorage.setItem("anchor", anchor);
}


function displayList() {
    const listItems = getListItems()
    console.log(listItems);
    const ul = getList();
    ul.innerHTML = "";
    listItems.forEach(data => {
        const key = data[0];
        const item = data[1];

        const li = document.createElement("li");
        li.innerText = item;
        li.id = `list-item-${key}`;

        const deleteSpan = document.createElement("span");
        deleteSpan.innerText = "X";
        deleteSpan.className = "delete-span";
        deleteSpan.addEventListener("click", (e) => deleteListItem(e, key));

        li.appendChild(deleteSpan);
        ul.appendChild(li);
    });

    document.querySelector(getAnchor()).appendChild(ul)
    createResetButton();
}


function createResetButton() {
    let resetButton = document.querySelector("button[type='reset']");

    if (resetButton) {
        resetButton.remove();
    }

    resetButton = document.createElement("button");
    resetButton.setAttribute("type", "reset");
    resetButton.innerText = "Reset";
    resetButton.addEventListener("click", deleteList);
    document.querySelector(getAnchor()).appendChild(resetButton);
}


function getList() {
    let ul = document.querySelector("ul");
    if (!ul) {
        ul = document.createElement("ul");
    } else {
        ul.innerHTML = "";
    }

    return ul
}


function getListItems() {
    const listItems = Object.entries(localStorage).filter((data) => {
        const key = data[0];
        const item = data[1];

        if (!(key === "highestKey" || key == "anchor")) {
            return [key, item];
        }
    });
    // sort (descending) by key
    listItems.sort((d1, d2) => d1[0] - d2[0]);
    return listItems;
}


function addListItem(event) {
    event.preventDefault();
    try {
        const item = document.querySelector("input").value;
        const key = getHighestKey();
        localStorage.setItem(key, item);
        console.log(`INFO: Item '${item}' added!`);
        updateHighestKey();
        displayList();
    } catch (error) {
        console.error("ERROR: Couldn't add item", error);
    }
}


function deleteListItem(event, key) {
    event.preventDefault();
    try {
        localStorage.removeItem(key);
        console.log("INFO: Item deleted!");
        displayList();
    } catch (error) {
        console.error("ERROR: Couldn't delete item", error);
    }
}


function updateHighestKey() {
    if (!localStorage.getItem("highestKey")) {
        localStorage.setItem("highestKey", 2);
    } else {
        let highestKey = parseInt(localStorage.getItem("highestKey"));
        highestKey++;
        localStorage.setItem("highestKey", highestKey);
    }
}


function getHighestKey() {
    return localStorage.getItem("highestKey");
}


function createForm() {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.id = "newListItem";

    const label = document.createElement("label");
    label.setAttribute("for", "newListItem");
    label.innerText = "List Item";

    const button = document.createElement("button");
    button.setAttribute("type", "submit");
    button.innerText = "Add";
    button.addEventListener("click", (e) => addListItem(e));

    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(button);

    document.querySelector("#form").appendChild(form);
}


function deleteList(event) {
    event.preventDefault();
    localStorage.clear();
    displayList();
}


window.addEventListener("storage", displayList);
