import { countApprovedPoints, LoyaltyPointEntry } from '../src/point-system-entries';

describe('Loyalty Point Entry Functions', () => {
    it('should return 0 for an empty array', () => {
        const entries: LoyaltyPointEntry[] = [];
        const result = countApprovedPoints(entries);
        expect(result).toBe(0);
    });

    it('should correctly sum approved "add" entries', () => {
        const entries: LoyaltyPointEntry[] = [
            {
                id: '1',
                type: 'add',
                count: 10,
                status: 'approved',
                reason: 'purchase',
                datetime: 1625078400000,
            },
            {
                id: '2',
                type: 'add',
                count: 5,
                status: 'approved',
                reason: 'bonus',
                datetime: 1625164800000,
            },
        ];
        const result = countApprovedPoints(entries);
        expect(result).toBe(15);
    });

    it('should correctly sum approved "add" and "subtract" entries', () => {
        const entries: LoyaltyPointEntry[] = [
            {
                id: '1',
                type: 'add',
                count: 10,
                status: 'approved',
                reason: 'purchase',
                datetime: 1625078400000,
            },
            {
                id: '2',
                type: 'subtract',
                count: 4,
                status: 'approved',
                reason: 'return',
                datetime: 1625164800000,
            },
        ];
        const result = countApprovedPoints(entries);
        expect(result).toBe(6);
    });

    it('should ignore entries with status other than "approved"', () => {
        const entries: LoyaltyPointEntry[] = [
            {
                id: '1',
                type: 'add',
                count: 10,
                status: 'approved',
                reason: 'purchase',
                datetime: 1625078400000,
            },
            {
                id: '2',
                type: 'add',
                count: 5,
                status: 'rejected',
                reason: 'invalid',
                datetime: 1625164800000,
            },
            {
                id: '3',
                type: 'subtract',
                count: 2,
                status: undefined,
                reason: 'correction',
                datetime: 1625251200000,
            },
        ];
        const result = countApprovedPoints(entries);
        expect(result).toBe(10);
    });

    it('should handle mixed types and statuses correctly', () => {
        const entries: LoyaltyPointEntry[] = [
            {
                id: '1',
                type: 'add',
                count: 20,
                status: 'approved',
                reason: 'purchase',
                datetime: 1625078400000,
            },
            {
                id: '2',
                type: 'add',
                count: 10,
                status: 'approved',
                reason: 'bonus',
                datetime: 1625164800000,
            },
            {
                id: '3',
                type: 'subtract',
                count: 5,
                status: 'approved',
                reason: 'return',
                datetime: 1625251200000,
            },
            {
                id: '4',
                type: 'add',
                count: 15,
                status: 'rejected',
                reason: 'invalid',
                datetime: 1625337600000,
            },
            {
                id: '5',
                type: 'subtract',
                count: 3,
                status: undefined,
                reason: 'correction',
                datetime: 1625424000000,
            },
        ];
        const result = countApprovedPoints(entries);
        expect(result).toBe(25); // 20 + 10 - 5
    });
});
