import { warrantyLines, CheckoutLine } from '../src/additional-warranties';

describe('Additional warranty functions', () => {

    const lines: CheckoutLine[] = [
        {
            id: '1',
            quantity: 1,
            undiscountedUnitPrice: { amount: 100 },
            variant: {
                id: 'v1',
                min_value: '10',
                max_value: '20',
                product: {
                    id: 'p1',
                    category: { id: 'cat1', ancestors: { edges: [] } },
                    collections: [],
                    productType: { category: 'warranty' }
                }
            }
        },
        {
            id: '2',
            quantity: 2,
            undiscountedUnitPrice: { amount: 200 },
            variant: {
                id: 'v2',
                min_value: '20',
                max_value: '30',
                product: {
                    id: 'p2',
                    category: { id: 'cat2', ancestors: { edges: [] } },
                    collections: [],
                    productType: { category: 'general' }
                }
            }
        }
    ];


    test('warrantyLines should return only lines with a warranty product type category', () => {
        const result = warrantyLines(lines);
        expect(result).toEqual([lines[0]]);
    });
});
