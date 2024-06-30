import { chunk, safeJsonParse } from '../src/utility';

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


describe('chunk', () => {
    test('chunks array correctly with size 2', () => {
        const input = [1, 2, 3, 4, 5];
        const output = [[1, 2], [3, 4], [5]];
        expect(chunk(input, 2)).toEqual(output);
    });

    test('chunks array correctly with size 3', () => {
        const input = [1, 2, 3, 4, 5, 6, 7];
        const output = [[1, 2, 3], [4, 5, 6], [7]];
        expect(chunk(input, 3)).toEqual(output);
    });

    test('returns empty array when input array is empty', () => {
        const input: number[] = [];
        expect(chunk(input, 2)).toEqual([]);
    });

    test('returns empty array when size is 0', () => {
        const input = [1, 2, 3];
        expect(chunk(input, 0)).toEqual([]);
    });

    test('returns empty array when size is negative', () => {
        const input = [1, 2, 3];
        expect(chunk(input, -1)).toEqual([]);
    });

    test('returns the original array as the only chunk when size is larger than array length', () => {
        const input = [1, 2, 3];
        const output = [[1, 2, 3]];
        expect(chunk(input, 10)).toEqual(output);
    });
});