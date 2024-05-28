export interface LoyaltyPointSettings {
    enabled: boolean;
    points_to_value: number;
    value_to_points_percentage: number;
    max_order_value_percentage: number;
    min_order_value: number;
}

export function valueToPoints(value: number, settings: LoyaltyPointSettings): number {
    return Math.ceil(value * (settings.value_to_points_percentage / 100));
}

export function pointsToValue(points: number, settings: LoyaltyPointSettings): number {
    return parseFloat((Math.ceil((points / settings.points_to_value) * 100) / 100).toFixed(2));
}

export function maxPointsForOrderValue(
    points: number,
    orderValue: number,
    settings: LoyaltyPointSettings,
): number {
    const maxValueAllowed = orderValue * (settings.max_order_value_percentage / 100);
    const maxPointsAllowed = Math.floor(maxValueAllowed * settings.points_to_value);
    return Math.min(points, maxPointsAllowed);
}
