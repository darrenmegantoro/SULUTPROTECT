/**
 * Regression checks for APIS domain-first routing.
 * Run: npx --yes tsx scripts/test-apis-routing.ts
 */
import { getChatbotResponse } from "../src/lib/faqSearch";
import { analyzeQuery, isBiPaymentOrFraudFaq } from "../src/lib/apisRouting";
import { faqBloomItems } from "../src/data/faqBloom";

type Case = {
  name: string;
  query: string;
  expectType: string;
  mustNotInclude?: string[];
  mustInclude?: string[];
};

const cases: Case[] = [
  {
    name: "Insurance fraud routes to authority",
    query: "Saya terkena penipuan asuransi. Apa yang harus saya lakukan?",
    expectType: "authority",
    mustInclude: ["OJK", "asuransi"],
    mustNotInclude: ["transfer dana terindikasi fraud", "alat pembayaran saya hilang"],
  },
  {
    name: "Insurance claim to BI routes authority/mixed not payment fraud FAQ",
    query: "Klaim asuransi saya ditolak, apakah bisa lapor BI?",
    expectType: "authority",
    mustInclude: ["asuransi", "OJK"],
  },
  {
    name: "Illegal investment routes to authority",
    query: "Saya terkena penipuan investasi ilegal.",
    expectType: "authority",
    mustInclude: ["investasi", "OJK"],
    mustNotInclude: ["transfer dana"],
  },
  {
    name: "Transfer to scam account may use FAQ",
    query: "Saya transfer uang ke rekening penipu.",
    expectType: "answer",
    mustInclude: ["transfer", "fraud"],
  },
  {
    name: "Generic fraud asks clarification",
    query: "Saya ditipu.",
    expectType: "clarification",
    mustInclude: ["transfer dana", "asuransi"],
  },
  {
    name: "Insurance premium via QRIS is mixed",
    query: "Saya bayar premi asuransi lewat QRIS dan dananya tidak masuk.",
    expectType: "mixed",
    mustInclude: ["asuransi", "QRIS"],
  },
];

let passed = 0;
let failed = 0;

for (const testCase of cases) {
  const result = getChatbotResponse(testCase.query);
  const signals = analyzeQuery(testCase.query);
  const text = JSON.stringify(result);
  const errors: string[] = [];

  if (result.type !== testCase.expectType) {
    errors.push(`expected type ${testCase.expectType}, got ${result.type}`);
  }

  for (const phrase of testCase.mustInclude ?? []) {
    if (!text.toLowerCase().includes(phrase.toLowerCase())) {
      errors.push(`missing phrase: ${phrase}`);
    }
  }

  if (result.type === "clarification" && result.relatedQuestions) {
    const chips = result.relatedQuestions.join(" ").toLowerCase();
    for (const phrase of testCase.mustNotInclude ?? []) {
      if (chips.includes(phrase.toLowerCase())) {
        errors.push(`clarification chip should not include: ${phrase}`);
      }
    }
  }

  if (result.type === "authority" && result.relatedQuestions) {
    const chips = result.relatedQuestions.join(" ").toLowerCase();
    for (const phrase of testCase.mustNotInclude ?? []) {
      if (chips.includes(phrase.toLowerCase())) {
        errors.push(`authority chip should not include: ${phrase}`);
      }
    }
  }

  if (result.type === "answer" && "item" in result) {
    if (shouldSuppressInsuranceFraud(result, signals)) {
      errors.push("matched BI payment/fraud FAQ for outside-BI insurance query");
    }
  }

  if (errors.length) {
    failed += 1;
    console.error(`FAIL: ${testCase.name}`);
    errors.forEach((error) => console.error(`  - ${error}`));
  } else {
    passed += 1;
    console.log(`PASS: ${testCase.name}`);
  }
}

function shouldSuppressInsuranceFraud(
  result: ReturnType<typeof getChatbotResponse>,
  signals: ReturnType<typeof analyzeQuery>
) {
  if (result.type !== "answer") return false;
  return (
    signals.hasOutsideBiDomain &&
    !signals.hasBiDomain &&
    isBiPaymentOrFraudFaq(result.item)
  );
}

const suppressedCount = faqBloomItems.filter((item) =>
  isBiPaymentOrFraudFaq(item)
).length;

console.log(`\nBI payment/fraud FAQ markers: ${suppressedCount} items`);
console.log(`Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
