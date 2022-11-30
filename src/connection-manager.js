import parseUri from 'parse-uri';

class ConnectionManager {
    constructor(videoElement) {
        this.peerConnection = null;
        this.videoElement = videoElement;
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

    connect(server, src) {
        let source = this.parseSource(src);
        this.peerConnection = new RTCPeerConnection();
        this.peerConnection.addTransceiver('video', { direction: 'recvonly' })
        this.peerConnection.ontrack = (event) => {
            this.videoElement.srcObject = event.streams[0];
            this.videoElement.onloadedmetadata = (e) => {
                this.videoElement.play();
            }
        }
        this.peerConnection.createOffer()
            .then(offer => {
                this.peerConnection.setLocalDescription(offer)
                const signalingUrl = server + '/doSignaling';
                return fetch(signalingUrl, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "srtHost": source.host,
                        "srtPort": source.port,
                        "srtStreamId": source.streamId,
                        offer
                    })
                })
            })
            .then(res => {
                if (res.status !== 200) {
                    res.text().then(err => {
                        window.alert(err)
                    })
                    return;
                }

                return res.json()
            })
            .then(res => {
                this.peerConnection.setRemoteDescription(res)
            })
            .catch(window.alert)
    }
}

export default ConnectionManager;