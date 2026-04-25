### 1. **RMiT (Risk Management in Technology) - Monitoring & Detection**
Under the latest **BNM RMiT** guidelines, financial institutions must have a robust mechanism to detect and mitigate "Cyber-Threats" in real-time.
* **Compliance Link:** Your **behavioral modeling** directly fulfills the requirement for "continuous monitoring and detection of unauthorized activities."
* **Requirement:** You must ensure your system logs all "Flag 1" and "Flag 2" events for at least **3 years** to satisfy audit requirements.

### 2. **FTFC (Fair Treatment of Financial Consumers) - Transparency**
The **Fair Treatment of Financial Consumers (FTFC)** policy prohibits arbitrary freezing of accounts without a clear recovery path.
* **Compliance Link:** Your **Self-Reactivation Flow** (re-login, MFA, Face ID) is the "recovery mechanism" required by BNM.
* **Requirement:** You must ensure the notification sent to the user is clear and not misleading, and that the reactivation process is accessible (e.g., providing an alternative for users whose Face ID might fail).

### 3. **PDPA (Personal Data Protection Act) - Automated Decision Making**
The **PDPA Amendment Act (20242025)** and the **2026 Guidelines on AI** regulate how systems make automated decisions about individuals.
* **Compliance Link:** Since "Flag 1" (Auto-Freeze) is an automated decision, you must be transparent about it.
* **Requirement:** You must conduct a **Data Protection Impact Assessment (DPIA)** to prove your model isn't biased and that users have a right to "human intervention" (which is your "Flag 2: Review by Analyst").

### 4. **AML/CFT (Anti-Money Laundering) - Suspicious Transaction Reporting**
The **AMLA (Amendment) Act 2025** (effective March 2026) requires faster reporting of suspicious behaviors.
* **Compliance Link:** Your **Flag 3** (Study/Escalate) is critical here. It acts as the internal trigger for a **Suspicious Transaction Report (STR)**.
* **Requirement:** If an analyst confirms a Flag 2 or Flag 3 is indeed an ATO attempt, the compliance officer must be able to export that data to BNM’s **Financial Intelligence System (FINS)** within the next working day.

### 5. **Technology Requirements for Payment Services (2026)**
This is a **new policy** issued by BNM in March 2026 specifically for e-money issuers like TnG.
* **Compliance Link:** It mandates "Customer Empowerment" features in fraud management.
* **Requirement:** Your **Daily/Weekly/Monthly reports** for managers are a direct requirement of this policy’s Governance section, which requires the Board and Senior Management to have oversight of "fraudulent transaction trends and system effectiveness."