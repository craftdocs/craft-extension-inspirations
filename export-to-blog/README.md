# Send To Blogs

## See it in action

![See it in action](https://user-images.githubusercontent.com/16385508/144405619-53b8c569-93f6-4d36-987f-8e257353f044.gif)

This extension showcases an example of communicating with external APIs. The
extension only runs in Craft App, since POST requests that do not have CORS
enabled are not supported by the web editor.

The extension uses two external services, [Medium.com](medium.com) and
[ghost.org](ghost.org). The client APIs can be found in the `backends/` folder.

The extension uses the Typescript/React/styled-components stack.

### A note on sending POST requests with CORS enabled
This extension relies heavily on using external APIs. Using these from Craft App is
not a problem, but when running the extension on docs.craft.do, depending on
what API you use, you might encounter problems related to access control or
cross-origin resource sharing. In short, the problem is that the API you use
only accepts requests from certain domains, every other requester is turned away
(a more detailed description is found at [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)).

A way to go around this is to deploy a [Proxy server](https://en.wikipedia.org/wiki/Proxy_server),
and use the API through this server. This extension does not contain a proxy
template, you have to come up with your own solution. A good starting point is
https://www.twilio.com/blog/node-js-proxy-server.

## Run this extension

For instructions how to get started and test this extension, visit its [CraftX introduction](https://www.craft.do/s/OhmDYXrBwI2wZS/b/46F75378-8323-4091-925B-EEFEE6EE6BFC/Ghost).

## Building and running

`npm run build` builds the extension to the `dist/` folder.

`npm run dev` run the extension in developer mode via Webpack at
`localhost:8080`.