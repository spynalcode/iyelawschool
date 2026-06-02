// Course + topic metadata. Lessons live in lessons.js, questions in questions/.
export const COURSES = [
  {
    id: "civil", name: "Civil Litigation", short: "Civil", icon: "⚖",
    tint: "#C8A06A", deep: "#6E4A1F",
    topics: [
      { id: "c01", title: "Overview, Jurisdiction & ADR" },
      { id: "c02", title: "Parties to an Action" },
      { id: "c03", title: "Pre-Action Considerations & Magistrate Court" },
      { id: "c04", title: "Commencement of Actions in the High Court" },
      { id: "c05", title: "Interlocutory Applications & Orders" },
      { id: "c06", title: "Summary Judgment & Default Judgment" },
      { id: "c07", title: "Pleadings" },
      { id: "c08", title: "Pre-Trial Proceedings & Evidence" },
      { id: "c09", title: "Trial Evidence & Examination of Witnesses" },
      { id: "c10", title: "Constitutional Safeguards & Fair Trial" },
      { id: "c11", title: "Sources of Civil Procedure" },
      { id: "c12", title: "Courts with Civil Jurisdiction" },
    ],
  },
  {
    id: "criminal", name: "Criminal Litigation", short: "Criminal", icon: "§",
    tint: "#B0855C", deep: "#5A3216",
    topics: [
      { id: "cr01", title: "Introduction, Scope & Sources" },
      { id: "cr02", title: "Laws Applicable in Various Courts" },
      { id: "cr03", title: "Types, Sittings & Settings of Courts" },
      { id: "cr04", title: "Searches, Arrest & Constitutional Rights" },
      { id: "cr05", title: "Pre-Trial Investigation & Police Interview" },
      { id: "cr06", title: "Jurisdiction & Venue of Criminal Trials" },
      { id: "cr07", title: "Institution of Criminal Proceedings" },
      { id: "cr08", title: "Charges I — Form, Contents & Rules" },
      { id: "cr09", title: "Charges II — Drafting & Defective Charges" },
      { id: "cr10", title: "Bail Pending Trial" },
    ],
  },
  {
    id: "ethics", name: "Professional Ethics & Skills", short: "Ethics", icon: "❧",
    tint: "#7FA06A", deep: "#35531F",
    topics: [
      { id: "e01", title: "Overview of RPC & History of Legal Profession" },
      { id: "e02", title: "Regulatory Bodies & Exclusive Rights" },
      { id: "e03", title: "History & Content of the RPC (1967–2023)" },
      { id: "e04", title: "Duties of Counsel to Client" },
      { id: "e05", title: "Duties to Court, State, Colleagues & Profession" },
      { id: "e06", title: "Contempt of Court" },
      { id: "e07", title: "Anti-Money Laundering & Terrorism Financing" },
      { id: "e08", title: "Advertisement & Improper Attraction of Business" },
      { id: "e09", title: "Interviewing & Counselling Skills" },
      { id: "e10", title: "Drafting II — Letters, Minutes, Memo & CV" },
      { id: "e11", title: "Law Office Management & ICT" },
    ],
  },
  {
    id: "property", name: "Property Law Practice", short: "Property", icon: "⌂",
    tint: "#A37C5B", deep: "#4A2E18",
    topics: [
      { id: "p01", title: "Overview & Applicable Laws (TRELLS)" },
      { id: "p02", title: "Deeds & Power of Attorney" },
      { id: "p03", title: "Sale of Land I — Pre-Contract to Contract" },
      { id: "p04", title: "Sale of Land II — Completion & Perfection" },
      { id: "p05", title: "Leases & Tenancies I" },
      { id: "p06", title: "Leases & Tenancies II" },
      { id: "p07", title: "Mortgages I" },
      { id: "p08", title: "Mortgages II" },
      { id: "p09", title: "Wills, Codicils & Probate" },
      { id: "p10", title: "Personal Representatives & Intestacy" },
      { id: "p11", title: "Lands Registration Law (Lagos)" },
    ],
  },
  {
    id: "corporate", name: "Corporate Law Practice", short: "Corporate", icon: "▦",
    tint: "#6E8CA0", deep: "#1F3848",
    topics: [
      { id: "co01", title: "Legal Framework & Regulatory Bodies" },
      { id: "co02", title: "Formation & Incorporation of Companies" },
      { id: "co03", title: "Business Names, Partnerships & Incorporated Trustees" },
      { id: "co04", title: "Post-Incorporation Matters" },
      { id: "co05", title: "Corporate Governance I — Directors & Secretaries" },
      { id: "co06", title: "Corporate Governance II — Meetings & Resolutions" },
      { id: "co07", title: "Corporate Governance III — Financial Statements & Audits" },
      { id: "co08", title: "Corporate Governance IV — Minority Protection" },
      { id: "co09", title: "Winding Up & Insolvency" },
      { id: "co10", title: "Foreign Participation in Business" },
      { id: "co11", title: "CAC & SEC Registration" },
    ],
  },
];

export const ALL_TOPICS = COURSES.flatMap((c) =>
  c.topics.map((t) => ({ ...t, courseId: c.id }))
);
export const TOTAL_TOPICS = ALL_TOPICS.length;
