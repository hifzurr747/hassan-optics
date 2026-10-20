export interface PromoResult {
  valid: boolean;
  code: string;
  discount: number;
  message: string;
  isFreeShipping?: boolean;
}

export function validatePromoCode(rawCode: string, subtotal: number): PromoResult {
  const code = rawCode.trim().toUpperCase();

  if (!code) {
    return { valid: false, code: "", discount: 0, message: "Please enter a promo code." };
  }

  if (code === "WELCOME500") {
    if (subtotal < 2000) {
      return {
        valid: false,
        code,
        discount: 0,
        message: "WELCOME500 requires a minimum order of Rs. 2,000.",
      };
    }
    return {
      valid: true,
      code,
      discount: 500,
      message: "🎉 WELCOME500 applied! You saved Rs. 500.",
    };
  }

  if (code === "MIANWALI") {
    const discount = Math.round(subtotal * 0.1); // 10% off
    return {
      valid: true,
      code,
      discount: Math.min(discount, 800),
      message: `🎉 MIANWALI 10% special discount applied! Saved Rs. ${Math.min(discount, 800)}.`,
    };
  }

  if (code === "HASSAN10") {
    const discount = Math.round(subtotal * 0.1);
    return {
      valid: true,
      code,
      discount: Math.min(discount, 1000),
      message: `🎉 HASSAN10 discount applied! Saved Rs. ${Math.min(discount, 1000)}.`,
    };
  }

  if (code === "FREESHIP") {
    return {
      valid: true,
      code,
      discount: 0,
      isFreeShipping: true,
      message: "🎉 FREESHIP applied! Delivery is 100% Free on this order.",
    };
  }

  return {
    valid: false,
    code,
    discount: 0,
    message: "Invalid promo code. Check spelling and try again.",
  };
}
