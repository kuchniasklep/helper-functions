import { CatalogueEntry } from "./custom-shipping-exclusions";
import { chunk } from "./utility";

export interface CheckoutLine {
    id: string,
    quantity: number

    undiscountedUnitPrice: {
        amount: number
    }

    variant: {
        id: string
        min_value: string
        max_value: string

        product: {
            id: string
            category: {
                id: string
                ancestors: { edges: { node: {
                    id: string
                }}[]}
            }
            collections: {
                id: string
            }[]
            productType: {
                category: string
            }
        }
    }
}

export function warrantyLines(lines: CheckoutLine[]) {
    return lines.filter(l =>
        l.variant.product.productType.category === "warranty"
    ) ?? [];
}

export interface WarrantyUpdate {
    id: string;
    count: number;
}

export function warrantyUpdates(lines: CheckoutLine[], eligible_products: EligibleForWarranty[]): WarrantyUpdate[] {
    const added = warrantyLines(lines);
    if(added.length === 0) return [];

    const warranties = simplifyWarranties(added);
    const productMap = new Map(eligible_products.map(p => [p.id, p.quantity]));

    return warranties.map(warranty => {
        if(warranty.remove) return { id: warranty.id, count: 0 };

        const eligibleCount = eligible_products.filter(p => {
            const inRange = warranty.min <= p.price && p.price <= warranty.max;
            const quantity = productMap.get(p.id) ?? 0;

            if(!inRange || quantity == 0) return false;

            productMap.set(p.id, quantity - 1);
            return true;
        }).length;

        if(warranty.quantity > eligibleCount) return {
            id: warranty.id,
            count: eligibleCount
        };

        return null;
    }).filter(warranty => warranty !== null) as WarrantyUpdate[]
}

function simplifyWarranties(warranty_lines: CheckoutLine[]) {
    return warranty_lines.map(warranty => {
        const warranty_min_value = warranty.variant.min_value
        const warranty_max_value = warranty.variant.max_value

        return {
            id: warranty.id,
            quantity: warranty.quantity,
            remove: !warranty_min_value || !warranty_max_value,
            min: warranty_min_value ? parseFloat(warranty_min_value) : 0,
            max: warranty_max_value ? parseFloat(warranty_max_value) : 0,
        }
    });
}

export interface EligibleForWarranty {
    id: string;
    price: number;
    range: number[];
    quantity: number;
}

export interface EasyprotectSettings {
    enabled: boolean;
    catalogue: CatalogueEntry[];
    steps: number[];
}

export function eligibleProducts(lines: CheckoutLine[], settings: EasyprotectSettings) {
    if(settings.enabled == false) return [];
    const easyprotectCatalogue = settings.catalogue.map(cat => cat.id);

    const step_values = settings.steps.flatMap(step => [step, step]).slice(1, -1);
    const steps = chunk(step_values, 2);

    return lines?.filter(line => 
        productTypeIsGeneral(line) &&
        productInWarrantyRange(line, settings) &&
        productInCatalogue(line, easyprotectCatalogue)

    ).flatMap(line => {
        const price = line.undiscountedUnitPrice.amount;

        return {
            id: line.variant.id,
            price: price,
            range: steps.find(step => step[0] <= price && price <= step[1]),
            quantity: line.quantity
        }
    });
}

function productTypeIsGeneral(line: CheckoutLine) {
    return line.variant.product.productType.category == "general"
}

function productInWarrantyRange(line: CheckoutLine, settings: EasyprotectSettings) {
    const price = line.undiscountedUnitPrice.amount;
    return settings.steps[0] <= price && price <= (settings.steps.at(-1) ?? 0);
}

function productInCatalogue(line: CheckoutLine, catalogue: string[]) {
    return !catalogue || catalogue.some(id => [
        line.variant.id,
        line.variant.product.id,
        ...(line.variant.product.category ? [line.variant.product.category?.id] : []),
        ...(line.variant.product.category.ancestors.edges.map(c => c.node.id) ?? []),
        ...(line.variant.product.collections?.map(c => c.id) ?? []),
    ].includes(id));
}