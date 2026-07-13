type CampaignLead = {
  row: number;
  phone: string;
  name: string;
  email: string;
  company: string;
  customFields: Record<string, string>;
};

type CampaignCsvWorkerRequest = {
  text: string;
};

type CampaignCsvWorkerResponse =
  | { ok: true; leads: CampaignLead[] }
  | { ok: false; message: string };

type CampaignCsvWorkerScope = {
  onmessage: ((event: MessageEvent<CampaignCsvWorkerRequest>) => void) | null;
  postMessage: (message: CampaignCsvWorkerResponse) => void;
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
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
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function parseCampaignCsv(text: string): CampaignLead[] {
  const rows = parseCsvRows(text);
  if (rows.length < 2) throw new Error("CSV needs a header row and at least one contact.");

  const rawHeaders = rows[0];
  const headers = rawHeaders.map(normalizeHeader);
  const phoneIndex = headers.findIndex((header) => ["phone", "phonenumber", "mobile", "mobilenumber", "number", "contact"].includes(header));
  if (phoneIndex < 0) throw new Error("CSV must include a phone or phone_number column.");

  const nameIndex = headers.findIndex((header) => ["name", "fullname", "customername", "leadname"].includes(header));
  const emailIndex = headers.findIndex((header) => ["email", "emailaddress"].includes(header));
  const companyIndex = headers.findIndex((header) => ["company", "business", "organization"].includes(header));

  return rows.slice(1).map((row, index) => {
    const customFields: Record<string, string> = {};
    rawHeaders.forEach((header, headerIndex) => {
      if ([phoneIndex, nameIndex, emailIndex, companyIndex].includes(headerIndex)) return;
      const value = row[headerIndex]?.trim();
      if (header && value) customFields[header.trim()] = value;
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
}

const workerScope = globalThis as unknown as CampaignCsvWorkerScope;

workerScope.onmessage = (event) => {
  try {
    workerScope.postMessage({ ok: true, leads: parseCampaignCsv(event.data.text) });
  } catch (error) {
    workerScope.postMessage({
      ok: false,
      message: error instanceof Error ? error.message : "The request could not be completed.",
    });
  }
};

export {};
