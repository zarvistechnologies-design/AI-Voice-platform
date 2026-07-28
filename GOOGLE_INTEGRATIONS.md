# Google Calendar and Sheets setup

## Google Cloud configuration

1. Create or select a Google Cloud project.
2. Enable **Google Calendar API** and **Google Sheets API**.
3. Configure the OAuth consent screen and add the production domain.
4. Create a **Web application** OAuth client.
5. Add the exact backend callback URL as an authorized redirect URI:
   `https://YOUR_BACKEND/api/integrations/google/callback`
6. Configure the backend environment:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_OAUTH_REDIRECT_URI=https://YOUR_BACKEND/api/integrations/google/callback
```

Google may require OAuth app verification before accounts outside the test-user
list can grant Calendar and Sheets scopes.

## Customer flow

1. Open **Dashboard → Integrations → Google Workspace → Connect Google**.
2. Approve Calendar and Sheets access.
3. Open **Manage resources** and create a test calendar event.
4. Paste a spreadsheet URL, verify it, and append a test row.
5. Open **Dashboard → Agents → select agent → Tools → Native Google tools**.
6. Enter the chosen Calendar ID and/or Spreadsheet ID and sheet tab.
7. Enable the required tools and save the agent.

Enabled agents receive these runtime tools:

- `check_google_calendar_availability`
- `book_google_calendar_appointment`
- `append_google_sheet_lead`

The Sheets tool appends columns in this order:

`timestamp, customer name, phone, email, outcome, notes, call ID`
