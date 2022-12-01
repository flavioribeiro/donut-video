import ConnectionManager from '../src/connection-manager';

describe('ConnectionManager', () => {
    it('should be initiated with a videoElement', () => {
        const videoElement = document.createElement('video');
        const connectionManager = new ConnectionManager(videoElement);
        expect(connectionManager).toBeInstanceOf(ConnectionManager);
    })
})