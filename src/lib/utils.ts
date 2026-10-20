import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString("en-PK")}`;
}

export const FREE_SHIPPING_THRESHOLD = 3000;
export const FLAT_SHIPPING_FEE = 250;

export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}

export const PAKISTAN_CITIES = [
  "Mianwali (Local Delivery)",
  "Bhakkar",
  "Khushab / Jauharabad",
  "Sargodha",
  "Rawalpindi",
  "Islamabad",
  "Lahore",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Gujranwala",
  "Sialkot",
  "Gujrat",
  "Bahawalpur",
  "Rahim Yar Khan",
  "Dera Ismail Khan (D.I. Khan)",
  "Dera Ghazi Khan (D.G. Khan)",
  "Karachi",
  "Hyderabad",
  "Sukkur",
  "Quetta",
  "Abbottabad",
  "Muzaffarabad",
  "Other City in Pakistan",
];
