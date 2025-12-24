export const MIN_ORDER_AREA = 2; // Minimum 2 m²

export interface PriceResult {
  area: number;
  chargedArea: number;
  totalPrice: number;
  isMinApplied: boolean;
}

export const calculatePrice = (
  width: number, 
  height: number, 
  unitPrice: number
): PriceResult => {
  const area = width * height;
  
  // Eğer alan 2m²'den küçükse 2m² olarak al
  const chargedArea = Math.max(area, MIN_ORDER_AREA);
  
  const totalPrice = chargedArea * unitPrice;

  return {
    area: Number(area.toFixed(2)),
    chargedArea: Number(chargedArea.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
    isMinApplied: area < MIN_ORDER_AREA
  };
};