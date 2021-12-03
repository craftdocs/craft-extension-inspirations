# Craft Snippets

This extension lets you save Craft content as reusable snippets or templates that you can insert anytime later while editing a document.

![Craft Snippets](https://user-images.githubusercontent.com/2234706/144433594-3f47b825-8e9d-4fb7-84ca-5b73f5bc7224.gif)

## Run this extension

For instructions how to get started and test this extension, visit its [CraftX introduction](https://www.craft.do/s/OhmDYXrBwI2wZS/b/0FD332FF-0D9E-4F09-8449-CE76B50820DB/Custom_Snippets).

## Building

Simply run `npm install` and then `npm run build` to generate the .craftX file which can be installed.
You can use `npm run dev` to test and debug in your local environment.

## As part of inspirations, Snippets showcases the following:

- usage of `storageApi` to persist & load extension data (Craft blocks in our case)
- usage of `editorAPI` to get current selection (saving a snippet)
- usage of `dataAPI` to insert blocks (inserting a snippet)
- dark mode handling: both via CSS in JS, and via CSS class based integration

## Technical Stack

Extensions can be written using various JS frameworks (or vanilla), Snippets was created with React / Typescript / Styled Components.

## Other Notes

To learn more about Craft eXtensions visit the [Craft X developer portal](https://developer.craft.do).
