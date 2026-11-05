# Privacy Policy for Flows

**Last Updated:** November 5, 2026  
**Effective Date:** November 5, 2026  
**Website:** [https://yugal.one/flows](https://yugal.one/flows)  
**Contact:** [contact@yugal.one](mailto:contact@yugal.one)

---

## 1. Overview

**Flows** ("we", "our", or "the Service"), created and maintained by **Yugal**, is a minimal, client-side and Google Apps Script document and label mail-merge studio. Flows enables users to connect data sources (Google Sheets, Google Forms, and Google Drive CSVs), design print and document layouts on a visual canvas, and export print-ready PDFs and Markdown files.

We believe your data belongs exclusively to you. Flows is architected with a strict **zero-retention, privacy-by-design model**: we do not operate external application databases, we do not store or inspect your documents, and your business records never touch any third-party infrastructure outside your own Google Workspace environment.

---

## 2. Information We Access and How It Is Used

Flows operates within your authenticated Google Workspace session via the Google Apps Script execution environment. The Service requests only the permissions strictly required to execute core functionality:

### A. Google Sheets Data (`spreadsheets.readonly`)
* **Access:** When you enter a Google Sheets URL or file ID, Flows reads the sheet tab names, column headers, and row data.
* **Purpose:** To render merge field tokens, populate live canvas previews, and generate merged documents or labels.
* **Storage:** Data is read during your active browser session and held in memory temporarily to perform the merge. No row data or cell content is ever copied to an external server or saved outside your personal workspace.

### B. Google Forms Data (`forms.readonly`)
* **Access:** If you connect a Google Form, Flows reads question titles and submitted response values.
* **Purpose:** To merge form survey results, tickets, or registration submissions into documents.
* **Storage:** Form responses are processed on-demand and are never stored on external databases.

### C. Google Drive Files & Folders (`drive` / `drive.file`)
* **Access:** Flows creates and accesses dedicated folders in your personal Google Drive:
  * `Flows/Projects/`: Stores your saved template definitions and canvas settings as lightweight `.json` files.
  * `Flows/Files/`: Stores your exported PDF documents, Markdown files, or `.zip` archives when you click "Save to Google Drive".
* **Purpose:** To provide persistent project saving and direct file export without relying on third-party cloud storage.
* **Storage:** All project definitions and generated files remain entirely inside your personal Google Drive account under your direct ownership and control.

### D. User Identity (`userinfo.email`)
* **Access:** Your Google account email address.
* **Purpose:** Displayed in the studio header badge solely to confirm your active authenticated Google session.

---

## 3. Data Processing Architecture & Security

* **No External Servers:** Flows does not route your data through any intermediate proxy, tracking server, or proprietary backend. All compute execution occurs within Google Apps Script infrastructure and your local web browser.
* **Zero Google Docs API Quotas:** Document and PDF rendering occurs using client-side HTML/CSS rendering engines and Apps Script native PDF conversions, bypassing Google Docs API storage entirely.
* **Encryption in Transit:** All interactions between your browser and Google services are encrypted using industry-standard TLS 1.3 / HTTPS.

---

## 4. Google API Services User Data Policy (Limited Use Disclosure)

Flows' use and transfer to any other app of information received from Google APIs will adhere to the **[Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy)**, including the **Limited Use** requirements:

1. **Human Inspection:** No human at Flows reads, views, or accesses your Google Sheets data, Google Form responses, project files, or exported documents.
2. **No Data Transfers for Advertising:** Your data is never shared with, sold to, or transferred to data brokers, advertising networks, or third-party service providers.
3. **No Machine Learning Model Training:** Data accessed via Google APIs is never utilized to train, retrain, or fine-tune artificial intelligence or machine learning models.

---

## 5. Third-Party Services & Analytics

* **Web Analytics on yugal.one:** Our informational product website (`https://yugal.one/flows`) utilizes standard Google Analytics 4 (`G-ZXEJWQXCP9`) to evaluate aggregate page visits. No personal data or document content from inside the Flows studio is sent to Google Analytics.
* **External CDN Resources:** Flows loads standard Google Material Symbols and webfonts. No personal document data is transmitted to these asset endpoints.

---

## 6. Data Retention, Portability, and Deletion

* **Full User Ownership:** You retain complete ownership of all project files and exported documents.
* **Deleting Projects:** You can delete any saved project directly from the Flows interface or by deleting the corresponding file in your Google Drive `Flows/Projects/` folder.
* **Revoking Access:** You may revoke Flows' access to your Google account at any time by visiting **[Google Account Permissions](https://myaccount.google.com/permissions)**. Revoking access immediately severs all permissions without deleting existing files in your Google Drive.

---

## 7. Children's Privacy

Flows is designed for general productivity and professional use. We do not knowingly collect personal information from children under the age of 13 (or under 16 in the European Economic Area).

---

## 8. Updates to This Policy

We may update this Privacy Policy from time to time to reflect operational or regulatory improvements. Any modifications will be posted to this document with a revised "Last Updated" date. Continued use of Flows following an update constitutes acceptance of the revised policy.

---

## 9. Contact Us

If you have questions, feedback, or concerns regarding this Privacy Policy or your personal data, please contact:

* **Name:** Yugal
* **Website:** [https://yugal.one](https://yugal.one)
* **Email:** [contact@yugal.one](mailto:contact@yugal.one)
