import fs from 'fs';
import { SaveFile } from './save-file.use-case';

describe('SaveFileUseCase', () => {

    const customOptions = {
        fileContent: 'custom content',
        fileDestination: 'custom-outputs/file-destination',
        fileName: 'custom-table-name'
    };

    const customFilePath = `${customOptions.fileDestination}/${customOptions.fileName}.txt`;

    const cleanOutputs = () => {
        ['outputs', 'custom-outputs'].forEach(folder => {
            try{
                if (fs.existsSync(folder)) {
                    fs.rmSync(folder, {
                        recursive: true,
                        force: true,
                        maxRetries: 5,
                        retryDelay: 150
                    });
                }
            } catch(error) {}
        });
    };

    beforeAll(() => {
        cleanOutputs();
    });

    afterAll(() => {
        cleanOutputs();
    });

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should save file with default values', () => {
        const saveFile = new SaveFile();
        const filePath = 'outputs/table.txt';
        const options = {
            fileContent: 'test content'
        };
        const result = saveFile.execute(options);
        const fileExists = fs.existsSync(filePath);
        const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

        expect(result).toBe(true);
        expect(fileExists).toBe(true);
        expect(fileContent).toBe(options.fileContent);
    });

    test('should save file with custom values', () => {
        const saveFile = new SaveFile();

        const result = saveFile.execute(customOptions);
        const fileExists = fs.existsSync(customFilePath);
        const fileContent = fs.readFileSync(customFilePath, { encoding: 'utf-8' });

        expect(result).toBe(true);
        expect(fileExists).toBe(true);
        expect(fileContent).toBe(customOptions.fileContent);
    });

    test('should return false if directry could not be created', () => {
        const saveFile = new SaveFile();
        const mkdirSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(
            () => { throw new Error('This is a custom error message from testing'); }
        );
        const result = saveFile.execute(customOptions);
        expect(result).toBe(false);
        // mkdirSpy.mockRestore();
    });

    test('should return false if file could not be created', () => {
        const saveFile = new SaveFile();
        const writeFileSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(
            () => { throw new Error('This is a custom error message from testing'); }
        );
        const result = saveFile.execute({ fileContent: 'Hola' });
        expect(result).toBe(false);
        // writeFileSpy.mockRestore();
    });

});