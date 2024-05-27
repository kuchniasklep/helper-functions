import {
    LoyaltyPointSettings,
    valueToPoints,
    pointsToValue,
    maxPointsForOrderValue,
} from '../src/point-system-calculations';

describe('Loyalty Point Functions', () => {
    const settings: LoyaltyPointSettings = {
        points_to_value: 25,
        value_to_points_percentage: 50,
        max_order_value_percentage: 50,
    };

    describe('valueToPoints', () => {
        it('should calculate loyalty points based on the provided value and settings', () => {
            const value = 100;
            const expectedPoints = 50;
            expect(valueToPoints(value, settings)).toBe(expectedPoints);
        });
    });

    describe('pointsToValue', () => {
        it('should calculate monetary value based on the provided points and settings', () => {
            const points = 50;
            const expectedValue = 2;
            expect(pointsToValue(points, settings)).toBe(expectedValue);
        });
    });

    describe('maxPointsForOrderValue', () => {
        it('should calculate the maximum points allowed for the given order value and settings', () => {
            const orderValue = 100;
            const points = 2000;
            const expectedMaxPoints = 1250;
            expect(maxPointsForOrderValue(points, orderValue, settings)).toBe(expectedMaxPoints);
        });

        it('should return the same points if they are lower than the calculated max points', () => {
            const orderValue = 200;
            const points = 50;
            expect(maxPointsForOrderValue(points, orderValue, settings)).toBe(points);
        });

        it('should return 0 if the order value is 0', () => {
            const orderValue = 0;
            const points = 100;
            expect(maxPointsForOrderValue(points, orderValue, settings)).toBe(0);
        });
    });
});
