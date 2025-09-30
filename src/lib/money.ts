export const toCents = (n:number) => Math.round(n*100);
export const fmt = (cents:number, currency:string="CAD") =>
  (cents/100).toLocaleString("en-CA",{ style:"currency", currency });