import parseUri from 'parse-uri';

class ConnectionManager {
    constructor(donutServer, streamUrl, videoElement) {
        console.log("Creating connection manager")
        this.peerConnection = null;
        this.donutServer = donutServer;
        this.videoElement = videoElement
        this.streamSource = this.parseSource(streamUrl);
        this.connect(this.donutServer, this.streamSource);
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
        console.log("about to connect to ", server, src);
        this.peerConnection = new RTCPeerConnection();
        this.peerConnection.addTransceiver('video', { direction: 'recvonly' })
        this.peerConnection.ontrack = (event) => {
            console.log("on track", event, document.getElementById('video'));
            this.videoElement.srcObject = event.streams[0];
        }
        this.peerConnection.createOffer()
            .then(offer => {
                this.peerConnection.setLocalDescription(offer)
                const signalingUrl = server + '/doSignaling';
                console.log("Hitting signaling url ", signalingUrl);
                return fetch(signalingUrl, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "srtHost": src.host, 
                        "srtPort": src.port, 
                        "srtStreamId": src.streamId, 
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