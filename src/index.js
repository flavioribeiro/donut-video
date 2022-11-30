import CustomVideoElement from 'custom-video-element';
import ConnectionManager from './connection-manager';


class DonutVideoElement extends CustomVideoElement {
  constructor() {
    super();
    this.player = null;
    this.connectionManager = null;
    this.videoEl = this.createVideoElement();
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

  createVideoElement() {
    document.createElement('video')
    let v = this.shadowRoot.querySelector("video");
    v.autoplay = true;
    v.controls = true;
    v.muted = true;
    return v
  }

  startConnectionManager() {
    if (this.src) {
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
