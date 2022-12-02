# donut-video element
A custom element (web component) for Donut (https://github.com/flavioribeiro/donut)

## How to use this?

You can import the player, point it to your donut server and pass the source you want to watch/monitor.

```html
<html>
  <head>
    <script type="module" src="https://unpkg.com/donut-video-element@0.0.1"></script>
  </head>
  <body>
    <donut-video server="http://localhost:8080" src="srt://[ip]:[port]/[stream-id]" controls autoplay />
  </body>
</html>
```
