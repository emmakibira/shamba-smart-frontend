export interface SmsTemplate {
  id: string;
  nameEn: string;
  nameSw: string;
  bodyEn: string;
  bodySw: string;
}

export const SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: "welcome",
    nameEn: "Welcome",
    nameSw: "Karibu",
    bodyEn: "Welcome to Shamba Smart, {{name}}! Access market prices and farm advisories.",
    bodySw: "Karibu Shamba Smart, {{name}}! Pata bei za mazao na ushauri wa kilimo.",
  },
  {
    id: "advisory",
    nameEn: "New advisory",
    nameSw: "Ushauri mpya",
    bodyEn: "New advisory: {{title}}. Open Shamba Smart for details.",
    bodySw: "Ushauri mpya: {{title}}. Fungua Shamba Smart kwa maelezo.",
  },
  {
    id: "market",
    nameEn: "Price update",
    nameSw: "Bei mpya",
    bodyEn: "{{crop}} national avg: TZS {{price}}/kg (week {{week}}).",
    bodySw: "{{crop}} wastani wa nchi: TZS {{price}}/kg (wiki {{week}}).",
  },
  {
    id: "weather",
    nameEn: "Weather alert",
    nameSw: "Tahadhari ya hali ya hewa",
    bodyEn: "Weather alert for {{region}}: {{message}}",
    bodySw: "Tahadhari ya hali ya hewa {{region}}: {{message}}",
  },
  {
    id: "emergency",
    nameEn: "Emergency",
    nameSw: "Dharura",
    bodyEn: "URGENT: {{message}}",
    bodySw: "MUHIMU: {{message}}",
  },
];

export function fillTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replace(new RegExp(`{{${key}}}`, "g"), value),
    template,
  );
}
