import CustomVideoElement from 'custom-video-element';
import ConnectionManager from './connection-manager';

const template = document.createElement('template');

template.innerHTML = `
<style>
  :host {
    width: 640px;
    height: 360px;
  }
</style>
`;

class DonutVideoElement extends CustomVideoElement {
  constructor() {
    super();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.nativeEl.onplay = this.onplay.bind(this);
    this.connectionManager = new ConnectionManager(this.nativeEl)
    if (this.nativeEl.autoplay) {
      this.onplay();
    }
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

  onplay() {
    if (this.connectionManager && !this.connectionManager.connected && this.src) {
      this.connectionManager.connect(this.server, this.src);
    }
  }
}

if (!window.customElements.get('donut-video')) {
  window.customElements.define('donut-video', DonutVideoElement);
  window.DonutVideoElement = DonutVideoElement;
}

export default DonutVideoElement;
