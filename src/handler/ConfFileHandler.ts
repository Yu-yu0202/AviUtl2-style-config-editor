import fs from 'fs';
import path from 'path';

export class ConfFileHandler {
    private confFilePath: string;
    
    constructor(confFilePath: string) {
        this.confFilePath = confFilePath;
    }
    
    readConfFile(): string {
        if (!fs.existsSync(this.confFilePath)) {
            throw new Error(`Configuration file not found at ${this.confFilePath}`);
        }
        return fs.readFileSync(this.confFilePath, 'utf-8');
    }
    
    writeConfFile(data: string): void {
        fs.writeFileSync(this.confFilePath, data, 'utf-8');
    }
    
    getConfFileDir(): string {
        return path.dirname(this.confFilePath);
    }

    parseConfFile(confText: string): Record<string, Record<string, string>> {
        const result: Record<string, Record<string, string>> = {};
        let currentSection: string | null = null;
        const lines = confText.split(/\r?\n/);
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(';')) continue;
            const sectionMatch = trimmed.match(/^\[(.+)\]$/);
            if (sectionMatch) {
                currentSection = sectionMatch[1];
                result[currentSection] = {};
                continue;
            }
            const kvMatch = trimmed.match(/^([^=]+)=(.*)$/);
            if (kvMatch && currentSection) {
                const key = kvMatch[1].trim();
                const value = kvMatch[2].trim();
                result[currentSection][key] = value;
            }
        }
        return result;
    }

    setConfFile(confJson: Record<string, Record<string, string>>): string {
        let result = '';
        for (const section in confJson) {
            result += `[${section}]\n`;
            for (const key in confJson[section]) {
                result += `${key}=${confJson[section][key]}\n`;
            }
            result += '\n';
        }
        return result.trim();
    }
}