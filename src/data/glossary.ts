// Shared glossary terms surfaced across the public site (FAQ, chatbot, results).

export const FRAUD_DEFINITION =
  "Fraud (penipuan, pengelabuan, manipulasi dan/atau pengambilalihan rekening/akun dengan menggunakan berbagai modus operandi dan dapat menimbulkan kerugian)";

// Whether a piece of customer-facing text references "fraud".
export function mentionsFraud(...texts: Array<string | undefined>): boolean {
  return texts.some((t) => (t ?? "").toLowerCase().includes("fraud"));
}
