import CustomVideoElement from 'custom-video-element';
import ConnectionManager from './connection-manager';


class DonutVideoElement extends CustomVideoElement {
  constructor() {
    super();
    this.nativeEl.onplay = this.onplay.bind(this);
    this.connectionManager = new ConnectionManager(this.nativeEl)
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
    if (this.connectionManager && this.src) {
      this.connectionManager.connect(this.server, this.src);
    }
  }
}

if (!window.customElements.get('donut-video')) {
  window.customElements.define('donut-video', DonutVideoElement);
  window.DonutVideoElement = DonutVideoElement;
}

export default DonutVideoElement;
