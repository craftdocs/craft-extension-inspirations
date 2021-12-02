
import { BlockLocation, CraftBlock, CraftBlockUpdate, CraftTextBlock, IndexLocation } from "@craftdocs/craft-extension-api";
import "./style.css";

/* ---- ENSURE DEV MODE WORKS ----- 
You can run this extension locally with `npm run dev` in order to have faster iteration cycles.
When running this way, the craft object won't be available and JS exception will occur
With this helper function you can ensure that no exceptions occur for craft api related calls.
/* ---------------------------------*/

function isCraftLibAvailable() {
  return typeof craft !== 'undefined'
}
/* ---------------------------------*/
/* ---- DARK/LIGHT MODE ----------- */
/* ---------------------------------*/

/*
According to tailwind documentation, see : https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
*/
if (isCraftLibAvailable() == true) {
  craft.env.setListener((env) => {
    if (env.colorScheme === 'dark' ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  });
}
  
/* ---------------------------------*/
/* ------------ CONSOLE ----------- */
/* ---------------------------------*/

function showConsole() {
  let element = document.getElementById("consoleContent")
  let clearBtn = document.getElementById("consoleClear")
  element.style.display = "block"
  clearBtn.style.visibility = "visible"
  document.getElementById("console").style.minHeight = "50%"
  document.getElementById("console").classList.add("surfaceShadow")
}

function hideConsole() {
  let element = document.getElementById("consoleContent")
  let clearBtn = document.getElementById("consoleClear")
  element.style.display = "none"
  clearBtn.style.visibility = "hidden"
  document.getElementById("console").style.minHeight = "0"
  document.getElementById("console").classList.remove("surfaceShadow")
}

function clearConsole() {
  document.getElementById("consoleItems").innerHTML = ""
  document.getElementById("consoleItemCount").style.visibility = "hidden"
}


function logInPageConsoleMessage(msg : string) {
  console.log("InPageConsole: " + msg)
  let newElement = document.createElement("div")
  newElement.className = "consoleContentItem"
  newElement.innerHTML = msg
  let consoleItemDiv = document.getElementById("consoleItems")
  let consoleMsgCountDiv = document.getElementById("consoleItemCount")
  consoleItemDiv.append(newElement)
  consoleMsgCountDiv.style.visibility = "visible"
  consoleMsgCountDiv.style.visibility = "visible"
  consoleMsgCountDiv.innerHTML = document.getElementById("consoleItems").childNodes.length.toString()
}


document.getElementById("openConsole").onclick = async () => {
  let element = document.getElementById("consoleContent")
  if (element.style.display == "none") {
    showConsole()
  } else {
    hideConsole()
  }
}

document.getElementById("openConsole").onclick = async () => {
  let element = document.getElementById("consoleContent")
  if (element.style.display == "none") {  showConsole();  } 
  else { hideConsole();}
}

document.getElementById("consoleClear").onclick = async () => {
  clearConsole()
}


/* ---------------------------------*/
/* ---------- NAVIGATION ---------- */
/* ---------------------------------*/

/*
Store the id of the DIV  currently displayed
*/
var currentSubPageDiv : string

function navigateToPage(divId : string, title:string) {
  currentSubPageDiv = divId
  document.getElementById("navBar_title").innerHTML = title
  document.getElementById("mainMenu").style.display = "none"
  document.getElementById(currentSubPageDiv).style.display = "block"
  document.getElementById("navBar_backButton").style.visibility = "visible"
}

function navigateBackFromPage() {
  document.getElementById("navBar_title").innerHTML = "Craft X Example"
  document.getElementById("mainMenu").style.display = "block"
  document.getElementById(currentSubPageDiv).style.display = "none"
  document.getElementById("navBar_backButton").style.visibility = "hidden"
  currentSubPageDiv = ""
}
document.getElementById("mainMenu_dataApi").onclick = async () => {
  navigateToPage("dataApiDetails", "Data APIs")
}

document.getElementById("mainMenu_editorApi").onclick = async () => {
  navigateToPage("editorApiDetails", "Editor APIs")
}

document.getElementById("mainMenu_storageApi").onclick = async () => {
  navigateToPage("storageApiDetails", "Storage APIs")
}

document.getElementById("navBar_backButton").onclick = async() => {
  navigateBackFromPage()
}

/* ---------------------------------*/
/* ---------- DATA API ------------ */
/* ---------------------------------*/
let loadedBlocks : CraftBlock[] = []

document.getElementById("button_lowercase").onclick = async () => {
  logInPageConsoleMessage("Updte Blocks Button Pressed")
  const result = await craft.dataApi.getCurrentPage();
  const pageBlock = result.data;
  let subBlocks = pageBlock.subblocks
  let updates : CraftBlockUpdate[] = [];
  subBlocks.forEach(element => {
    if (element.type == "textBlock") {
      element.content.forEach(run => {
        run.text = run.text.toLowerCase();
      });
      updates.push(element)
    }
  });
  craft.dataApi.updateBlocks(updates)
  logInPageConsoleMessage("Updte Blocks Success: " + updates.length + " blocks")
}

document.getElementById("get_page_button").onclick = async () => {
  logInPageConsoleMessage("Get Page Button Pressed")
  const result = await craft.dataApi.getCurrentPage();
  const pageBlock = result.data;
  loadedBlocks = pageBlock.subblocks;
  logInPageConsoleMessage("Get Page Result: " + loadedBlocks.length + " blocks" )
}

document.getElementById("insert_blocks_button").onclick = async () => {
  logInPageConsoleMessage("Insert Blocks Button Pressed")
  const blocks = loadedBlocks
  craft.dataApi.addBlocks(blocks)
  logInPageConsoleMessage("Insert Blocks Succeded: " + blocks.length + " blocks")
}

document.getElementById("button_moveLastToTop").onclick = async () => {
  logInPageConsoleMessage("Move Blocks Button Pressed")
  const result = await craft.dataApi.getCurrentPage();
  const subBlocks = result.data.subblocks;
  if (subBlocks.length < 2) {
    logInPageConsoleMessage("Less than two blocks, cannot move")
    return
  }
  await craft.dataApi.moveBlocks([subBlocks[subBlocks.length - 1].id], {type:"indexLocation", pageId : result.data.id, index:0})
  logInPageConsoleMessage("Move Blocks Succeded")
}

document.getElementById("delete_blocks_button").onclick = async () => {
  logInPageConsoleMessage("Delete Blocks Button Pressed")
  const result = await craft.dataApi.getCurrentPage();
  const subBlocks = result.data.subblocks;
  if (subBlocks.length == 0) {
    logInPageConsoleMessage("No Blocks to Delete")
    return
  }
  let blockToDelete = subBlocks[0];
  await craft.dataApi.deleteBlocks([blockToDelete.id])
  logInPageConsoleMessage("Deleted Block: " + blockToDelete.id )
}


/* ---------------------------------*/
/* ---------- EDITOR API ---------- */
/* ---------------------------------*/


document.getElementById("get_selection_button").onclick = async () => {
  logInPageConsoleMessage("Get Selection Button Pressed")
  const response = await craft.editorApi.getSelection()
  const selectedBlocks = response.data
  loadedBlocks = selectedBlocks
  logInPageConsoleMessage("Get Selection Result: " + loadedBlocks.length + " blocks" )
}


document.getElementById("get_text_selection_button").onclick = async () => {
  logInPageConsoleMessage("Get Text Selection Button Pressed")
  const response = await craft.editorApi.getTextSelection()
  const selectedText = response.data
  logInPageConsoleMessage("Get Text Selection Result: " + selectedText )
}

document.getElementById("select_blocks_button").onclick = async () => {
  logInPageConsoleMessage("Select Blocks Button Pressed")
  const response = await craft.dataApi.getCurrentPage()
  const blocks = response.data.subblocks
  let firstTwoBlocks = blocks.slice(0, 2);
  let firstTwoBlockIds : string[] = firstTwoBlocks.map( item => { return item.id})
  await craft.editorApi.selectBlocks(firstTwoBlockIds)
  logInPageConsoleMessage("Selected First Two Blocks")
}

document.getElementById("navigate_to_block").onclick = async () => {
  logInPageConsoleMessage("Navigate to Block Button Pressed")
  const response = await craft.dataApi.getCurrentPage()
  const blocks = response.data.subblocks
  let firstTextBlock = blocks.find( item => { return item.type == "textBlock"})
  if (firstTextBlock == undefined) {
    logInPageConsoleMessage("Couldn't find text block to navigate to")
    return
  }
  await craft.editorApi.navigateToBlockId(firstTextBlock.id)
  logInPageConsoleMessage("Navigated to block: " + firstTextBlock.id )
}



/* ---------------------------------*/
/* ---------- STORAGE API --------- */
/* ---------------------------------*/
document.getElementById("storageApi_store_button").onclick = async() => {
  let newValue = (<HTMLTextAreaElement>document.getElementById("textInput_store")).value;
  logInPageConsoleMessage("Setting Value " + newValue)
  await craft.storageApi.put("customKey", newValue); 
}

document.getElementById("storageApi_load_button").onclick = async() => {
  logInPageConsoleMessage("Loading Value for customKey");
  let result = await craft.storageApi.get("customKey");
  let loadedValue : string = result.data
  let textArea : HTMLTextAreaElement = (<HTMLTextAreaElement>document.getElementById("textInput_load"))
  textArea.value = loadedValue
  logInPageConsoleMessage("Loaded Value : " + loadedValue) 
}

document.getElementById("storageApi_clear_button").onclick = async() => {
    logInPageConsoleMessage("Clearing Value for customKey");
    let result = await craft.storageApi.delete("customKey");
    logInPageConsoleMessage("Cleared Value for customKey");
  }