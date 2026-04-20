import { ServerApp } from "./presentation/server-app";

describe('Test App.ts', () => {
    test('should call Server.run with values', async () => {
        ServerApp.run = jest.fn();
        process.argv = ['node', 'app.ts', '-b', '10', '-l', '5', '-s', '-n', 'test-file', '-d', 'test-destination'];
        await import('./app');
        expect(ServerApp.run).toHaveBeenCalledWith({
            base: 10,
            limit: 5,
            showTable: true,
            fileDestination: 'test-destination',
            fileName: 'test-file'
        });
    });
});