function showConsole() {
    const element = document.getElementById("consoleContent");
    const clearBtn = document.getElementById("consoleClear");
    const console = document.getElementById("console");
    if (element == null || clearBtn == null || console == null) {
        return;
    }
    element.style.display = "flex";
    clearBtn.style.visibility = "visible";
    console.style.minHeight = "30%";
    console.classList.add("surfaceShadow");
  }
  
  function hideConsole() {
    const element = document.getElementById("consoleContent");
    const clearBtn = document.getElementById("consoleClear");
    const console = document.getElementById("console");
    if (element == null || clearBtn == null || console == null) {
        return;
    }
    element.style.display = "none";
    clearBtn.style.visibility = "hidden";
    console.style.minHeight = "0";
    console.classList.remove("surfaceShadow");
  }
  
  function clearConsole() {
    const consoleItems = document.getElementById("consoleItems");
    const consoleItemCount = document.getElementById("consoleItemCount");
    if (consoleItems == null || consoleItemCount == null) {
        return;
    }
    consoleItems.innerHTML = "";
    consoleItemCount.style.visibility = "hidden";
  }
  
  
  export function logToInPageConsole(msg: string) {
    console.log(msg);
    let newElement = document.createElement("div");
    newElement.className = "consoleContentItem";
    newElement.innerHTML = msg;
    const consoleItemDiv = document.getElementById("consoleItems");
    const consoleMsgCountDiv = document.getElementById("consoleItemCount");
    if (consoleItemDiv == null || consoleMsgCountDiv == null) {
        return;
    }
    consoleItemDiv.append(newElement);
    consoleMsgCountDiv.style.visibility = "visible";
    consoleMsgCountDiv.style.visibility = "visible";
    consoleMsgCountDiv.innerHTML = consoleItemDiv.childNodes.length.toString();
}

export function initConsole() {
    const openConsole = document.getElementById("openConsole");
    const consoleClear = document.getElementById("consoleClear");
    
    if (openConsole != null) {
        openConsole.onclick = async () => {
            const consoleContent = document.getElementById("consoleContent");
            if (consoleContent == null) {
                return;
            }
            if (consoleContent.style.display == "none") {
                showConsole();
            } else {
                hideConsole();
            }
        }
        
        openConsole.onclick = async () => {
            const consoleContent = document.getElementById("consoleContent");
            if (consoleContent == null) {
                return;
            }
            if (consoleContent.style.display == "none") {
                showConsole(); 
            } 
            else {
                hideConsole();
            }
        }
    }
    
    if (consoleClear != null) {
        consoleClear.onclick = async () => {
            clearConsole();
        };
    }
}