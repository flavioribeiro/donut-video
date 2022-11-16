import CustomVideoElement from 'custom-video-element';
import ConnectionManager from './connection-manager';


class DonutVideoElement extends CustomVideoElement {
  constructor() {
    super();
    this.player = null;
    this.connectionManager = null;
    this.videoEl = document.createElement('video');
    this.startConnectionManager();
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(val) {
    if (val !== this.src) {
      this.setAttribute('src', val);
    }
  }

  get server() {
    return this.getAttribute('server');
  }

  set server(val) {
    if (val !== this.server) {
      this.setAttribute('server', val);
    }
  }

  async load() {
    if (!this.src) {
      this.player.unload();
    } else {
      try {
        await this.player.load(this.src);
      } catch (e) {
        onError(e);
      }
    }
  }

  startConnectionManager() {
    if (this.src) {
      console.log("got src, video element???", this.videoEl)
      this.connectionManager = new ConnectionManager(this.server, this.src, this.videoEl)
    }
  }

  connectedCallback() {
    if (this.player && this.src) {
      this.load();
    }
  }

  disconnectedCallback() {
    this.player && this.player.unload();
  }
}

if (!window.customElements.get('donut-video')) {
  window.customElements.define('donut-video', DonutVideoElement);
  window.DonutVideoElement = DonutVideoElement;
}

export default DonutVideoElement;
