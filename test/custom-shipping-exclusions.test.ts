import { excluded_by_metafields, ShippingMethod } from '../src/custom-shipping-exclusions';

describe('excluded_by_metafields', () => {
    it('should return exclusions for catalogue items required when no catalogue entries match', () => {
        const availableMethods: ShippingMethod[] = [
            {
                id: '1',
                name: 'Method 1',
                metafields: {
                    'catalogue-entries': JSON.stringify([
                        {
                            label: 'Item A',
                            value: JSON.stringify({
                                name: 'Item A',
                                id: 'A',
                                type: 'type1',
                            }),
                        },
                    ]),
                },
            },
        ];
        const catalogueIds = [['B']];
        const result = excluded_by_metafields(availableMethods, catalogueIds, false, true);
        expect(result).toEqual([{ id: '1', reason: 'CATALOGUE_ITEMS_REQUIRED' }]);
    });

    it('should return exclusions for catalogue items excluded when all catalogue entries match and exclusions are true', () => {
        const availableMethods: ShippingMethod[] = [
            {
                id: '2',
                name: 'Method 2',
                metafields: {
                    'catalogue-entries': JSON.stringify([
                        {
                            label: 'Item B',
                            value: JSON.stringify({
                                name: 'Item B',
                                id: 'B',
                                type: 'type2',
                            }),
                        },
                    ]),
                    'catalogue-exclusions': 'true',
                },
            },
        ];
        const catalogueIds = [['B']];
        const result = excluded_by_metafields(availableMethods, catalogueIds, false, true);
        expect(result).toEqual([{ id: '2', reason: 'CATALOGUE_ITEMS_EXCLUDED' }]);
    });

    it('should return exclusions for catalogue items required when catalogue-entries is not provided', () => {
        const availableMethods: ShippingMethod[] = [
            {
                id: '8',
                name: 'Method 8',
                metafields: {
                    'catalogue-exclusions': 'false',
                },
            },
        ];
        const catalogueIds = [['A']];
        const result = excluded_by_metafields(availableMethods, catalogueIds, false, true);
        expect(result).toEqual([]);
    });

    it('should return exclusions for pallet shipping required when pallet shipping is not available', () => {
        const availableMethods: ShippingMethod[] = [
            {
                id: '3',
                name: 'Method 3',
                metafields: {
                    'pallet-shipping': 'false',
                },
            },
        ];
        const result = excluded_by_metafields(availableMethods, [[]], true, true);
        expect(result).toEqual([{ id: '3', reason: 'PALLET_SHIPPING_REQUIRED' }]);
    });

    it('should return exclusions for pallet shipping only when necessary', () => {
        const availableMethods: ShippingMethod[] = [
            {
                id: '4',
                name: 'Method 4',
                metafields: {
                    'pallet-shipping': 'true',
                },
            },
        ];
        const result = excluded_by_metafields(availableMethods, [[]], false, true);
        expect(result).toEqual([{ id: '4', reason: 'PALLET_SHIPPING_ONLY_WHEN_NECESSARY' }]);
    });

    it('should return exclusions for parcel locker not available', () => {
        const availableMethods: ShippingMethod[] = [
            {
                id: '5',
                name: 'Method 5',
                metafields: {
                    'parcel-locker': 'true',
                },
            },
        ];
        const result = excluded_by_metafields(availableMethods, [[]], false, false);
        expect(result).toEqual([{ id: '5', reason: 'PARCEL_LOCKER_NOT_AVAILABLE' }]);
    });

    it('should return multiple exclusions when multiple reasons are present', () => {
        const availableMethods: ShippingMethod[] = [
            {
                id: '6',
                name: 'Method 6',
                metafields: {
                    'parcel-locker': 'true',
                    'pallet-shipping': 'true',
                },
            },
        ];
        const result = excluded_by_metafields(availableMethods, [[]], false, false);
        expect(result).toEqual([
            {
                id: '6',
                reason: 'PALLET_SHIPPING_ONLY_WHEN_NECESSARY, PARCEL_LOCKER_NOT_AVAILABLE',
            },
        ]);
    });

    it('should return empty array when no methods are excluded', () => {
        const availableMethods: ShippingMethod[] = [
            {
                id: '7',
                name: 'Method 7',
                metafields: {},
            },
        ];
        const result = excluded_by_metafields(availableMethods, [[]], false, true);
        expect(result).toEqual([]);
    });

    it('should return empty array when no metafields are defined', () => {
        const availableMethods: ShippingMethod[] = [
            {
                id: '7',
                name: 'Method 7',
            },
        ];
        const result = excluded_by_metafields(availableMethods, [[]], false, true);
        expect(result).toEqual([]);
    });

    it('should return empty array when catalogue-entries json is invalid', () => {
        const availableMethods: ShippingMethod[] = [
            {
                id: '7',
                name: 'Method 7',
                metafields: {
                    'catalogue-entries': 'invalid-json',
                },
            },
        ];
        const catalogueIds = [['B']];
        const result = excluded_by_metafields(availableMethods, catalogueIds, false, true);
        expect(result).toEqual([]);
    });

    it('should return empty array when catalogue-entries value json is invalid', () => {
        const availableMethods: ShippingMethod[] = [
            {
                id: '7',
                name: 'Method 7',
                metafields: {
                    'catalogue-entries': JSON.stringify([
                        { label: 'Item B', value: 'invalid-json' },
                    ]),
                },
            },
        ];
        const catalogueIds = [['B']];
        const result = excluded_by_metafields(availableMethods, catalogueIds, false, true);
        expect(result).toEqual([]);
    });

    it('should return empty array when metafields json is invalid', () => {
        const availableMethods: ShippingMethod[] = [
            {
                id: '7',
                name: 'Method 7',
                metafields: {
                    'catalogue-entries': 'invalid-json',
                },
            },
        ];
        const result = excluded_by_metafields(availableMethods, [[]], false, true);
        expect(result).toEqual([]);
    });

    it('should return empty array when no methods are present', () => {
        const availableMethods: ShippingMethod[] = [];
        const result = excluded_by_metafields(availableMethods, [[]], false, true);
        expect(result).toEqual([]);
    });
});
