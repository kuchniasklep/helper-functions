import { safeJsonParse } from '../src/utility';

describe('safeJsonParse', () => {
    it('should return parsed object for valid JSON string', () => {
        const jsonString = '{"name":"Item A","id":"A","type":"type1"}';
        const result = safeJsonParse<{ name: string; id: string; type: string }>(jsonString);
        expect(result).toEqual({ name: 'Item A', id: 'A', type: 'type1' });
    });

    it('should return null for invalid JSON string', () => {
        const jsonString = '{"name":"Item A","id":"A","type":"type1"'; // Missing closing brace
        const result = safeJsonParse<{ name: string; id: string; type: string }>(jsonString);
        expect(result).toBeNull();
    });

    it('should return null for nullish or empty input', () => {
        const a = safeJsonParse<{ name: string; id: string; type: string }>(undefined);
        expect(a).toBeNull();

        const b = safeJsonParse<{ name: string; id: string; type: string }>(null);
        expect(b).toBeNull();

        const c = safeJsonParse<{ name: string; id: string; type: string }>('');
        expect(c).toBeNull();
    });
});
