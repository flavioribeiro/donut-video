import parseUri from 'parse-uri';

class ConnectionManager {
    constructor(videoElement, stats) {
        this.peerConnection = null;
        this.videoElement = videoElement;
        this.stats = stats;
        this.connected = false;
        this.currentCue = null;
    }

    parseSource(streamUrl) {
        const source = parseUri(streamUrl);
        return {
            protocol: source.protocol,
            host: source.host,
            port: source.port,
            streamId: source.path.replace('/', '')
        };
    }

    buildPayload(offer, src) {
        let source = this.parseSource(src);
        return JSON.stringify({
            "srtHost": source.host,
            "srtPort": source.port,
            "srtStreamId": source.streamId,
            offer
        });
    }

    async fetchRemoteDescription(server, src, offer) {
        const signalingUrl = server + '/doSignaling';
        return fetch(signalingUrl, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: this.buildPayload(offer, src)
        }).then(res => {
            if (res.status !== 200) {
                res.text().then(err => {
                    window.alert(err)
                })
                return;
            }
            return res.json()
        })
    }

    displayCue(caption) {
        let startTime = this.videoElement.currentTime;
        let cue = new VTTCue(startTime, startTime + 100, caption.Text);
        if (this.currentCue !== null) {
            this.metadataTrack.removeCue(this.currentCue);
        }
        this.metadataTrack.addCue(cue);
        this.currentCue = cue;
    }

    connect(server, src) {
        this.peerConnection = new RTCPeerConnection();
        this.peerConnection.addTransceiver('video', { direction: 'recvonly' })
        this.dataChannel = this.peerConnection.createDataChannel('metadata');
        this.peerConnection.ontrack = (event) => {
            this.videoElement.srcObject = event.streams[0];
            this.connected = true;
        }
        this.peerConnection.ondatachannel = (event) => {
            this.metadataTrack = this.videoElement.addTextTrack('captions', '608/708', 'en');
            this.metadataTrack.mode = "showing";
            event.channel.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                if (msg.Type == "captions") {
                    this.displayCue(msg);
                } else {
                    this.stats.add(msg.Message)
                }
            }
        }
        this.peerConnection.createOffer()
            .then(offer => {
                this.peerConnection.setLocalDescription(offer)
                return this.fetchRemoteDescription(server, src, offer);
            })
            .then(res => {
                this.peerConnection.setRemoteDescription(res)
            })
            .catch(window.alert)
    }
}

export default ConnectionManager;