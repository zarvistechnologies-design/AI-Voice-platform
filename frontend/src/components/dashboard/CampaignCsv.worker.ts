type CampaignLead = {
  row: number;
  phone: string;
  name: string;
  email: string;
  company: string;
  customFields: Record<string, string>;
};

type CampaignCsvField = {
  header: string;
  storedKey: string;
  promptVariable: string;
  sample: string;
  kind: "standard" | "custom";
};

type CampaignCsvWorkerRequest = {
  buffer: ArrayBuffer;
};

type CampaignCsvWorkerResponse =
  | { ok: true; leads: CampaignLead[]; fields: CampaignCsvField[] }
  | { ok: false; message: string };

type CampaignCsvWorkerScope = {
  onmessage: ((event: MessageEvent<CampaignCsvWorkerRequest>) => void) | null;
  postMessage: (message: CampaignCsvWorkerResponse) => void;
};

const maxCampaignLeads = 100_000;

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function customFieldKey(value: string) {
  const cleaned = value.trim().replace(/[^a-zA-Z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
  if (!cleaned) return "";
  const key = /^[a-zA-Z]/.test(cleaned) ? cleaned : `Field_${cleaned}`;
  return key.slice(0, 80);
}

function parseCsvRows(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "\"") {
      if (quoted && next === "\"") {
        cell += "\"";
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) {
        rows.push(row);
        if (rows.length > maxCampaignLeads + 1) {
          throw new Error(`CSV can contain at most ${maxCampaignLeads.toLocaleString("en-IN")} contacts.`);
        }
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());
  if (row.some(Boolean)) {
    rows.push(row);
    if (rows.length > maxCampaignLeads + 1) {
      throw new Error(`CSV can contain at most ${maxCampaignLeads.toLocaleString("en-IN")} contacts.`);
    }
  }
  return rows;
}

function parseCampaignCsv(text: string): { leads: CampaignLead[]; fields: CampaignCsvField[] } {
  const rows = parseCsvRows(text);
  if (rows.length < 2) throw new Error("CSV needs a header row and at least one contact.");

  const rawHeaders = rows[0];
  const headers = rawHeaders.map(normalizeHeader);
  const phoneIndex = headers.findIndex((header) => ["phone", "phonenumber", "mobile", "mobilenumber", "number", "contact"].includes(header));
  if (phoneIndex < 0) throw new Error("CSV must include a phone or phone_number column.");

  const nameIndex = headers.findIndex((header) => ["name", "fullname", "customername", "leadname"].includes(header));
  const emailIndex = headers.findIndex((header) => ["email", "emailaddress"].includes(header));
  const companyIndex = headers.findIndex((header) => ["company", "business", "organization"].includes(header));

  const fieldForIndex = (header: string, headerIndex: number): CampaignCsvField | null => {
    const sample = rows.slice(1).map((row) => row[headerIndex]?.trim() ?? "").find(Boolean) ?? "";
    if (headerIndex === phoneIndex) return { header, storedKey: "phone", promptVariable: "LeadPhone", sample, kind: "standard" };
    if (headerIndex === nameIndex) return { header, storedKey: "name", promptVariable: "LeadName", sample, kind: "standard" };
    if (headerIndex === emailIndex) return { header, storedKey: "email", promptVariable: "LeadEmail", sample, kind: "standard" };
    if (headerIndex === companyIndex) return { header, storedKey: "company", promptVariable: "LeadCompany", sample, kind: "standard" };
    const key = customFieldKey(header);
    return key ? { header, storedKey: `customFields.${key}`, promptVariable: key, sample, kind: "custom" } : null;
  };
  const fields = rawHeaders
    .map(fieldForIndex)
    .filter((field): field is CampaignCsvField => Boolean(field))
    .filter((field, index, all) => all.findIndex((candidate) => candidate.promptVariable === field.promptVariable) === index);

  const leads = rows.slice(1).map((row, index) => {
    const customFields: Record<string, string> = {};
    rawHeaders.forEach((header, headerIndex) => {
      if ([phoneIndex, nameIndex, emailIndex, companyIndex].includes(headerIndex)) return;
      const value = row[headerIndex]?.trim();
      const key = customFieldKey(header);
      if (key && value) customFields[key] = value;
    });

    return {
      row: index + 2,
      phone: (row[phoneIndex] ?? "").replace(/[^\d+]/g, ""),
      name: nameIndex >= 0 ? row[nameIndex] ?? "" : "",
      email: emailIndex >= 0 ? row[emailIndex] ?? "" : "",
      company: companyIndex >= 0 ? row[companyIndex] ?? "" : "",
      customFields,
    };
  }).filter((lead) => lead.phone);
  return { leads, fields };
}

const workerScope = globalThis as unknown as CampaignCsvWorkerScope;

workerScope.onmessage = (event) => {
  try {
    const text = new TextDecoder().decode(event.data.buffer);
    const parsed = parseCampaignCsv(text);
    workerScope.postMessage({ ok: true, ...parsed });
  } catch (error) {
    workerScope.postMessage({
      ok: false,
      message: error instanceof Error ? error.message : "The request could not be completed.",
    });
  }
};

export {};
