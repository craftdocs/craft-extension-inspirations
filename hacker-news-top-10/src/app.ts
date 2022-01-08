import {
  BlockLocation,
  CraftBlock,
  CraftBlockUpdate,
  CraftTextBlock,
  CraftTextRun,
  IndexLocation,
} from "@craftdocs/craft-extension-api";
import {encode} from 'html-entities';

/* ---- ENSURE DEV MODE WORKS -----
You can run this extension locally with `npm run dev` in order to have faster iteration cycles.
When running this way, the craft object won't be available and JS exception will occur
With this helper function you can ensure that no exceptions occur for craft api related calls.
/* ---------------------------------*/

/* ---------------------------------*/
/* ---- DARK/LIGHT MODE ----------- */
/* ---------------------------------*/

/*
According to tailwind documentation, see : https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
*/
function initColorSchemeHandler() {
  craft.env.setListener((env) => {
    if (env.colorScheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });
}

/* ---------------------------------*/
/* ------- RENDER STORIES --------- */
/* ---------------------------------*/

function renderStories(stories: Object[]) {
  const articlesDiv = document.getElementById("articles");
  articlesDiv.innerHTML = "";
  stories.forEach((element) => {
    const htmlToInsert: Node = createHTMLForStory(element);
    articlesDiv.appendChild(htmlToInsert);
  });
}

function createHTMLForStory(story: Object): Node {
  let numberOfCommens = 0;
  if (story["kids"] != undefined) {
    numberOfCommens = story["kids"].length;
  }
  const storyUrl: string = story["url"];
  const id: string = story["id"];
  const discusssionUrl: string = `https://news.ycombinator.com/item?id=${encodeURIComponent(id)}`;
  const htmlString: string = `
  <div class="gridItem">
    <h3 class="text-sm font-medium select-none">
      ${encode(story["title"])}
    </h3>
    ${
      story["url"] != null
        ? `<div>
      <a href="${encode(storyUrl)}" onclick="window.openURL(this.getAttribute('href')); return false;" class="underline text-sm text-secondaryText dark:text-secondaryText-dark" >
        ${encode(new URL(story["url"]).hostname)}
      </a>
    </div>`
        : ""
    }
    <div>
      <a href="${encode(discusssionUrl)}" onclick="window.openURL(this.getAttribute('href')); return false;" class="text-xs text-secondaryText dark:text-secondaryText-dark">
        ${encode(story["by"])} | ${encode(story["score"])} points | ${numberOfCommens} comments
      </a>
    </div>
  </div>`;
  return new DOMParser().parseFromString(htmlString, "text/html").body
    .childNodes[0];
}

let loadedStoryDetails: Object[] = [];
/* ---------------------------------*/
/* -------- Click Handler---------- */
/* ---------------------------------*/

function initInsertButtonHandler() {
  document.getElementById("insert_button").onclick = async () => {
    console.log("Insert, " + loadStoryDetails.length);
    const items = loadedStoryDetails.map((element) => {
      let numberOfComments = 0;
      if (element["kids"] != undefined) {
        numberOfComments = element["kids"].length;
      }
      const discusssionUrl: string = `https://news.ycombinator.com/item?id=${encodeURIComponent(element["id"])}`;
      const articleUrl = element["url"];
      const content: CraftTextRun[] =
        articleUrl != null
          ? [
              { text: element["title"], isBold: true },
              { text: "\n" },
              {
                text: new URL(element["url"]).hostname,
                isCode: true,
                link: { url: element["url"], type: "url" },
              },
              { text: " " },
              {
                text: `↑ ${element["score"]}`,
                isCode: true,
                link: { url: discusssionUrl, type: "url" },
              },
            ]
          : [
              { text: element["title"], isBold: true },
              { text: "\n" },
              { text: " " },
              {
                text: `↑ ${element["score"]}`,
                isCode: true,
                link: { url: discusssionUrl, type: "url" },
              },
            ];

      const branchBlock = craft.blockFactory.textBlock({
        content,
        listStyle: { type: "numbered" },
      });
      return branchBlock;
    });
    await craft.dataApi.addBlocks(items);
  };
}

/* ---------------------------------*/
/* ----------- HN API ------------- */
/* ---------------------------------*/

async function loadTopStoryIds(): Promise<string[]> {
  let ids: string[] = [];
  try {
    const data = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    ).then((res) => res.json());
    ids = data;
  } catch (err) {
    console.error(err);
  }
  /* We want to get the top 10 stories, but there might be jobs or other inside  - so load more */
  let top10ids: string[] = ids.slice(0, 20);
  return top10ids;
}

async function loadStoryDetails(id: string): Promise<Object> {
  let retData: Object = [];
  try {
    const data = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${escape(id)}.json`
    ).then((res) => res.json());
    retData = data;
  } catch (err) {
    console.error(err);
  }
  return retData;
}

async function loadTop10StoryDetails(): Promise<Object[]> {
  let ids = await loadTopStoryIds();
  const promises = ids.map((storyId) => loadStoryDetails(storyId));
  const storyDetails = await Promise.all(promises);
  /* Filter for story types*/
  let storyTypeStories = storyDetails.filter(
    (story) => story["type"] == "story"
  );
  return storyTypeStories.slice(0, 10);
}

async function loadAndRenderStories() {
  loadedStoryDetails = await loadTop10StoryDetails();
  renderStories(loadedStoryDetails);
  document.getElementById("spinner").style.visibility = "hidden";
  document.getElementById("spinner").style.display = "none";
  document.getElementById("footer").style.display = "block";
}

function addCustomWindowOpen() {
  window["openURL"] = function (url) {
    console.log("openURL");
    craft.editorApi.openURL(url);
  };
}

export function initApp() {
  initColorSchemeHandler();
  initInsertButtonHandler();

  addCustomWindowOpen();
  loadAndRenderStories();
}
