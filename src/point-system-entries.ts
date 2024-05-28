export type LoyaltyPointEntry = {
    id: string;
    type: 'add' | 'subtract';
    count: number;
    status?: LoyaltyPointEntryStatus;
    reason: string;
    datetime: number;
    order?: string;
};

export type LoyaltyPointEntryStatus = 'approved' | 'rejected' | undefined;

export function countApprovedPoints(entries: LoyaltyPointEntry[]): number {
    return entries
        .filter((entry) => entry.status === 'approved')
        .reduce((total, entry) => {
            return entry.type === 'add' ? total + entry.count : total - entry.count;
        }, 0);
}
