# Craft Snippets

This extension lets you save Craft content as reusable snippets or templates that you can insert anytime later while editing a document.

![Craft Snippets](https://user-images.githubusercontent.com/2234706/144284895-be5f0ec3-7660-478f-9040-2fbd43e3ba77.gif)

## Building

Simply run `npm install` and than `npm run build` to generate the .craftX file which can be installed.
You can use `npm run dev` to test and debug in your local environment.

## As part of inspirations, Snippets showcase:

- using `storageApi` to persist & load extension data (Craft blocks in our case)
- using `editorAPI` to get current selection (saving a snippet)
- using `dataAPI` to insert blocks (inserting a snippet)
- dark mode handling: both via CSS in JS, and via CSS class based integration

## Technical Stack

Extensions can be written using various JS frameworks (or vanilla), Snippets was created with React / Typescript / Styled Components.

## Other Notes

To learn more about Craft eXtensions visit the [Craft X developer portal](https://developer.craft.do).
