export interface ShippingMethod {
    id: string
    name: string
    minimumOrderPrice?: {amount: number, currency: string},
    maximumOrderPrice?: {amount: number, currency: string},
    metafields?: any
}

export interface CatalogueEntry {
    name: string,
    id: string,
    type: string
}

export interface AvailabilityOption {
    label: string,
    value: string
}

export function excluded_by_metafields(availableMethods: ShippingMethod[], catalogueIds: string[], pallet_shipping_required: boolean, parcel_locker_available: boolean) {
    return availableMethods?.map(method => {
        let reasons = [];
        
        const catalogue_exclusions = method.metafields?.['catalogue-exclusions'] == 'true';
        const catalogue_entries: CatalogueEntry[] = method.metafields?.['catalogue-entries'] ?
          (JSON.parse(method.metafields?.['catalogue-entries']) as AvailabilityOption[])
            .map(entry => ({name: entry.label, ...(JSON.parse(entry.value))}) )
          : [];

        const catalogue_match = catalogue_entries.some(entry => catalogueIds?.some(ids => ids.includes(entry.id)));
    
        if(catalogue_entries?.length > 0 && !catalogue_match && !catalogue_exclusions)
          reasons.push("CATALOGUE_ITEMS_REQUIRED");
    
        if(catalogue_entries?.length > 0 && catalogue_match && catalogue_exclusions)
          reasons.push("CATALOGUE_ITEMS_EXCLUDED");
    
        const parcel_locker = method.metafields?.['parcel-locker'] == 'true';
        const pallet_shipping = method.metafields?.['pallet-shipping'] == 'true';
    
        if(pallet_shipping_required && !pallet_shipping)
          reasons.push("PALLET_SHIPPING_REQUIRED");
    
        if(!pallet_shipping_required && pallet_shipping)
          reasons.push("PALLET_SHIPPING_ONLY_WHEN_NECESSARY");
    
        if(!parcel_locker_available && parcel_locker)
          reasons.push("PARCEL_LOCKER_NOT_AVAILABLE");
    
        return {id: method.id, reason: reasons.join(", ")};
      }).filter(item => item.reason.length > 0);
}