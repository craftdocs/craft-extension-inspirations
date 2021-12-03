# Send To Apps

The **Send To Apps** extension lets you quickly send a Craft document to another
app. See `src/ExportApp.tsx` for the list of currently supported apps.

## See it in action

![See it in action](https://user-images.githubusercontent.com/16385508/144403275-91d70ec7-eeb9-4b44-ba5d-a8cb26165d0b.gif)

## Run this extension

For instructions how to get started and test this extension, visit its [CraftX introduction](https://www.craft.do/s/OhmDYXrBwI2wZS/b/86CAE18D-5616-4DE3-85B5-5078FF132EEC/Things).

## Architecture

The extension relies on [x-callback-urls](http://x-callback-url.com) to send
content to other apps. The basic idea of `x-callback-url` is that data can be
sent to a 3rd party app by opening a specially constructed link, which encodes
the information you want to send to the app. The x-callback-url specification can
be found at http://x-callback-url.com, and it's implemented in
`src/DeepLinks.ts`. Not all apps have the same calling convention, so some of
these are handled specially. Not all apps use Markdown: Things 3 uses `JSON`,
and OmniFocus uses TaskPaper. A very bare-bones implementation for these are in
`src/ThingsJSON` and `src/TaskPaper.ts`, respectively.

## Design

This extension uses `styled-components` to create a UI library, and the UI
components are built up from these elements. The atomic building blocks are in
`src/ui.tsx`, and the larger, compound components are in `src/Fragments.tsx`.
