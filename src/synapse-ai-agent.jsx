import React, { useState, useEffect, useRef } from "react";

const SAMPLE_EMAILS = [
  {
    id: 1,
    from: "sarah.chen@globalcorp.com",
    subject: "URGENT: Q3 Proposal Due Tomorrow 9AM",
    preview: "Hi, just a reminder the client proposal for GlobalCorp must be submitted by 9AM tomorrow. The board is waiting...",
    body: "Hi,\n\nJust a reminder the client proposal for GlobalCorp must be submitted by 9AM tomorrow. The board is waiting on our numbers before they can proceed with the $2.4M contract. Please ensure the financial projections and timeline are included. This is critical — missing this deadline could cost us the deal.\n\nBest,\nSarah Chen\nVP Sales",
    time: "8:14 AM",
    unread: true,
  },
  {
    id: 2,
    from: "dev@team.internal",
    subject: "Weekly standup notes + action items",
    preview: "Here are the notes from today's standup. Action items assigned to you: 1. Review PR #482...",
    body: "Hi Team,\n\nHere are notes from today's standup. Action items assigned to you:\n1. Review PR #482 (authentication refactor) - due by EOD Friday\n2. Update the API documentation for v2.3 endpoints\n3. Schedule 1:1 with Marcus about the deployment pipeline issue\n\nNo blockers reported. Next standup Thursday 10AM.\n\nCheers,\nDev Team Bot",
    time: "9:02 AM",
    unread: true,
  },
  {
    id: 3,
    from: "marcus.williams@client.co",
    subject: "Re: Partnership Discussion — Can we talk?",
    preview: "Thank you for meeting last week. I've been thinking about our discussion and I'd love to reconnect...",
    body: "Hi,\n\nThank you for meeting last week. I've been thinking about our discussion and I'd love to reconnect this week if possible. We're seriously considering moving forward with the partnership — I just need a few clarifications on the pricing model and SLA terms before we can sign.\n\nAre you free Thursday afternoon or Friday morning?\n\nWarm regards,\nMarcus Williams\nCEO, Client.co",
    time: "10:33 AM",
    unread: false,
  },
  {
    id: 4,
    from: "hr@company.com",
    subject: "Performance Review Submission Deadline — This Friday",
    preview: "This is a reminder that all manager performance reviews must be submitted via the HR portal...",
    body: "Hi,\n\nThis is a reminder that all manager performance reviews must be submitted via the HR portal by Friday 5PM. Late submissions will affect your team's compensation review cycle. Please ensure you've completed self-assessments for each direct report.\n\nIf you have questions, contact HR directly.\n\nRegards,\nHR Department",
    time: "11:15 AM",
    unread: true,
  },
  {
    id: 5,
    from: "newsletter@techdigest.io",
    subject: "AI Trends: What's reshaping enterprise software in 2025",
    preview: "This week: OpenAI's new model announcement, Google's Gemini updates, and three tools every dev should know...",
    body: "This week in AI:\n\n- OpenAI released a new reasoning model focused on code\n- Google updated Gemini with multimodal improvements\n- 3 tools every developer should be using right now\n- Industry roundup: How Fortune 500s are adopting AI agents\n\nClick to read full digest.",
    time: "12:00 PM",
    unread: false,
  },
];





const PRIORITY_COLORS = {
  critical: { bg: "#FF3B30", light: "#FFF0EF", label: "🔴 Critical" },
  high: { bg: "#FF9500", light: "#FFF8EE", label: "🟠 High" },
  medium: { bg: "#007AFF", light: "#EFF6FF", label: "🔵 Medium" },
  low: { bg: "#34C759", light: "#EDFFF2", label: "🟢 Low" },
};

const EMOTION_MAP = {
  urgent: "⚡",
  stressed: "😰",
  friendly: "😊",
  neutral: "😐",
  positive: "✅",
  negative: "⚠️",
};
function analyzeEmailLocal(email) {
  const text = (email.subject + " " + email.body).toLowerCase();

  const tasks = [];

  if (text.includes("proposal")) {
    tasks.push({
      title: "Prepare client proposal",
      detail: "Prepare and submit GlobalCorp proposal",
      deadline: "Tomorrow 9AM",
      priority: "critical",
      emotion: "urgent",
      category: "Deadline",
      estimatedMinutes: 90
    });
  }

  if (text.includes("review") || text.includes("pr")) {
    tasks.push({
      title: "Review pull request",
      detail: "Review PR #482 authentication refactor",
      deadline: "Friday",
      priority: "high",
      emotion: "neutral",
      category: "Review",
      estimatedMinutes: 30
    });
  }

  if (text.includes("meeting") || text.includes("talk") || text.includes("schedule")) {
    tasks.push({
      title: "Schedule meeting",
      detail: "Reply and schedule meeting with Marcus",
      deadline: null,
      priority: "medium",
      emotion: "friendly",
      category: "Meeting",
      estimatedMinutes: 15
    });
  }

  if (text.includes("performance review")) {
    tasks.push({
      title: "Submit performance reviews",
      detail: "Complete HR review submissions",
      deadline: "Friday 5PM",
      priority: "high",
      emotion: "stressed",
      category: "Admin",
      estimatedMinutes: 60
    });
  }

  return {
    tasks,
    emailSentiment: "neutral",
    isActionable: tasks.length > 0,
    burnoutSignal: tasks.length
  };
}
export default function SynapseAI() {
  const [emails, setEmails] = useState(SAMPLE_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox");
  const [analysisLog, setAnalysisLog] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [customEmail, setCustomEmail] = useState({ subject: "", from: "", body: "" });
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [completedTodos, setCompletedTodos] = useState(new Set());
  const [burnoutScore, setBurnoutScore] = useState(null);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [analysisLog]);

  const log = (msg, type = "info") => {
    setAnalysisLog((prev) => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  async function analyzeAllEmails() {
    setAnalyzing(true);
    setTodos([]);
    setAnalysisLog([]);
    setBurnoutScore(null);
    setActiveTab("todos");

    log("🚀 SynapseAI agent starting analysis...", "system");
    log(`📬 Found ${emails.length} emails in inbox`, "info");

    const allTasks = [];

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      log(`🔍 Analyzing: "${email.subject}"`, "info");

      try {
        const parsed = analyzeEmailLocal(email);
        if (parsed && parsed.isActionable && parsed.tasks?.length > 0) {
          const enriched = parsed.tasks.map((t, idx) => ({
            ...t,
            id: `${email.id}-${idx}`,
            sourceEmail: email.subject,
            sourceFrom: email.from,
            emailSentiment: parsed.emailSentiment,
            burnoutSignal: parsed.burnoutSignal,
          }));
          allTasks.push(...enriched);
          log(`✅ Extracted ${enriched.length} task(s) from "${email.subject}"`, "success");
        } else {
          log(`ℹ️ No actionable tasks in "${email.subject}"`, "skip");
        }
      } catch (err) {
        log(`❌ Error analyzing email: ${err.message}`, "error");
      }
    }

    // Synthesize final prioritized list
    log("🧠 Synthesizing and prioritizing all tasks...", "system");
    if (allTasks.length > 0) {
      const avgBurnout = Math.round(allTasks.reduce((a, t) => a + (t.burnoutSignal || 0), 0) / allTasks.length);
      setBurnoutScore(avgBurnout);

      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const sorted = [...allTasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      setTodos(sorted);
      log(`🎯 Final TODO list ready: ${sorted.length} tasks`, "system");
      log(`🧠 Cognitive load score: ${avgBurnout}/10`, avgBurnout >= 7 ? "error" : "success");
    } else {
      log("📭 No actionable tasks found in any emails.", "info");
    }
    setAnalyzing(false);
  }

  async function analyzeEmailDetail(email) {
  setSelectedEmail({ ...email, loading: true, analysis: null });

  try {
    // Use local analyzer instead of Claude
    const parsed = analyzeEmailLocal(email);

    const analysis = {
      summary: email.preview || email.body.slice(0, 120) + "...",
      tone: "Professional",
      emotion: parsed.emailSentiment || "neutral",
      suggestedReply:
        "Hi,\n\nThank you for your email. I have received your message and will review the details shortly. I will get back to you with an update soon.\n\nBest regards.",
      keyPoints: [
        "Important message received",
        parsed.tasks.length > 0
          ? "This email contains actionable tasks"
          : "This email is mostly informational",
        "Consider responding if required"
      ],
      riskLevel: parsed.tasks.length > 0 ? "medium" : "low",
      recommendedAction:
        parsed.tasks.length > 0
          ? "Review the tasks generated in the TODO section and complete them."
          : "No immediate action required."
    };

    setSelectedEmail({
      ...email,
      loading: false,
      analysis
    });
  } catch (err) {
    setSelectedEmail({
      ...email,
      loading: false,
      analysis: null
    });
  }
}

  function addCustomEmail() {
    if (!customEmail.subject || !customEmail.body) return;
    const newEmail = {
      id: Date.now(),
      from: customEmail.from || "unknown@email.com",
      subject: customEmail.subject,
      preview: customEmail.body.slice(0, 80) + "...",
      body: customEmail.body,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      unread: true,
    };
    setEmails((prev) => [newEmail, ...prev]);
    setCustomEmail({ subject: "", from: "", body: "" });
    setShowAddEmail(false);
  }

  function toggleTodo(id) {
    setCompletedTodos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const unreadCount = emails.filter((e) => e.unread).length;
  const completedCount = completedTodos.size;
  const totalTime = todos.reduce((s, t) => s + (t.estimatedMinutes || 0), 0);

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: "#0A0A0F", color: "#E8E8F0", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0D0D1A 0%, #141428 100%)", borderBottom: "1px solid #1E1E3A", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6C63FF, #00D4FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px", background: "linear-gradient(90deg, #A78BFA, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SynapseAI</div>
            <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.5px" }}>AUTONOMOUS WORK INTELLIGENCE AGENT</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {burnoutScore !== null && (
            <div style={{ padding: "6px 14px", borderRadius: 20, background: burnoutScore >= 7 ? "#3B1219" : "#0F2A1A", border: `1px solid ${burnoutScore >= 7 ? "#FF3B30" : "#34C759"}`, fontSize: 12, color: burnoutScore >= 7 ? "#FF6B6B" : "#4ADE80" }}>
              🧠 Load: {burnoutScore}/10 {burnoutScore >= 7 ? "— Take a break!" : "— Manageable"}
            </div>
          )}
          <button onClick={() => { setShowAddEmail(!showAddEmail); setActiveTab("inbox"); }} style={{ padding: "7px 14px", borderRadius: 8, background: "#1E1E3A", border: "1px solid #2D2D4E", color: "#A78BFA", fontSize: 13, cursor: "pointer" }}>
            + Add Email
          </button>
          <button onClick={analyzeAllEmails} disabled={analyzing} style={{ padding: "7px 18px", borderRadius: 8, background: analyzing ? "#1E1E3A" : "linear-gradient(135deg, #6C63FF, #5B8AF5)", border: "none", color: analyzing ? "#6B7280" : "#fff", fontSize: 13, fontWeight: 600, cursor: analyzing ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
            {analyzing ? "⚙️ Analyzing..." : "⚡ Analyze All Emails"}
          </button>
        </div>
      </div>

      {/* Add Email Panel */}
      {showAddEmail && (
        <div style={{ background: "#0F0F1E", borderBottom: "1px solid #1E1E3A", padding: "16px 24px" }}>
          <div style={{ maxWidth: 700, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontWeight: 600, color: "#A78BFA", marginBottom: 4, fontSize: 13 }}>📧 Paste Your Own Email</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input placeholder="From (email)" value={customEmail.from} onChange={(e) => setCustomEmail({ ...customEmail, from: e.target.value })} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, background: "#1A1A2E", border: "1px solid #2D2D4E", color: "#E8E8F0", fontSize: 13 }} />
              <input placeholder="Subject *" value={customEmail.subject} onChange={(e) => setCustomEmail({ ...customEmail, subject: e.target.value })} style={{ flex: 2, padding: "8px 12px", borderRadius: 8, background: "#1A1A2E", border: "1px solid #2D2D4E", color: "#E8E8F0", fontSize: 13 }} />
            </div>
            <textarea placeholder="Email body *" value={customEmail.body} onChange={(e) => setCustomEmail({ ...customEmail, body: e.target.value })} rows={4} style={{ padding: "8px 12px", borderRadius: 8, background: "#1A1A2E", border: "1px solid #2D2D4E", color: "#E8E8F0", fontSize: 13, resize: "vertical" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={addCustomEmail} style={{ padding: "7px 20px", borderRadius: 8, background: "#6C63FF", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add to Inbox</button>
              <button onClick={() => setShowAddEmail(false)} style={{ padding: "7px 16px", borderRadius: 8, background: "#1A1A2E", border: "1px solid #2D2D4E", color: "#9CA3AF", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: "#0D0D1A", borderBottom: "1px solid #1E1E3A", padding: "0 24px", display: "flex", gap: 4, flexShrink: 0 }}>
        {[
          { id: "inbox", label: `📬 Inbox`, badge: unreadCount },
          { id: "todos", label: `✅ Daily TODO`, badge: todos.length > 0 ? todos.length : null },
          { id: "log", label: "🔍 Analysis Log", badge: null },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "12px 16px", background: "transparent", border: "none", borderBottom: activeTab === tab.id ? "2px solid #6C63FF" : "2px solid transparent", color: activeTab === tab.id ? "#A78BFA" : "#6B7280", fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
            {tab.label}
            {tab.badge ? <span style={{ background: "#6C63FF", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{tab.badge}</span> : null}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>

        {/* INBOX TAB */}
        {activeTab === "inbox" && (
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* Email List */}
            <div style={{ width: 340, borderRight: "1px solid #1E1E3A", overflowY: "auto", background: "#0A0A0F" }}>
              {emails.map((email) => (
                <div key={email.id} onClick={() => analyzeEmailDetail(email)} style={{ padding: "14px 18px", borderBottom: "1px solid #111122", cursor: "pointer", background: selectedEmail?.id === email.id ? "#14142A" : "transparent", transition: "background 0.1s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#111120"}
                  onMouseLeave={(e) => e.currentTarget.style.background = selectedEmail?.id === email.id ? "#14142A" : "transparent"}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#6C63FF", fontWeight: 600 }}>{email.from.split("@")[0]}</span>
                    <span style={{ fontSize: 11, color: "#4B5563" }}>{email.time}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: email.unread ? 600 : 400, color: email.unread ? "#E8E8F0" : "#9CA3AF", marginBottom: 4, lineHeight: 1.3 }}>{email.subject}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email.preview}</div>
                  {email.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6C63FF", marginTop: 8 }} />}
                </div>
              ))}
            </div>

            {/* Email Detail */}
            <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
              {!selectedEmail && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#4B5563" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>Select an email to analyze</div>
                  <div style={{ fontSize: 13, marginTop: 8 }}>SynapseAI will extract tasks and suggest replies</div>
                </div>
              )}
              {selectedEmail && (
                <div style={{ maxWidth: 700 }}>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#E8E8F0" }}>{selectedEmail.subject}</div>
                    <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>From: <span style={{ color: "#A78BFA" }}>{selectedEmail.from}</span></div>
                    <div style={{ background: "#111122", borderRadius: 10, padding: 16, fontSize: 13, color: "#C9C9D4", lineHeight: 1.7, whiteSpace: "pre-wrap", border: "1px solid #1E1E3A" }}>{selectedEmail.body}</div>
                  </div>

                  {selectedEmail.loading && (
                    <div style={{ textAlign: "center", padding: 32, color: "#6C63FF" }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>⚙️</div>
                      <div style={{ fontSize: 13 }}>SynapseAI is analyzing this email...</div>
                    </div>
                  )}

                  {selectedEmail.analysis && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div style={{ background: "#111122", border: "1px solid #1E1E3A", borderRadius: 10, padding: 16 }}>
                        <div style={{ fontSize: 11, color: "#6C63FF", fontWeight: 700, marginBottom: 8, letterSpacing: "0.5px" }}>AI SUMMARY</div>
                        <div style={{ fontSize: 13, color: "#C9C9D4", lineHeight: 1.6 }}>{selectedEmail.analysis.summary}</div>
                        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                          <span style={{ padding: "3px 10px", borderRadius: 12, background: "#1A1A2E", border: "1px solid #2D2D4E", fontSize: 12, color: "#A78BFA" }}>
                            {EMOTION_MAP[selectedEmail.analysis.emotion] || "😐"} {selectedEmail.analysis.emotion}
                          </span>
                          <span style={{ padding: "3px 10px", borderRadius: 12, background: selectedEmail.analysis.riskLevel === "high" ? "#3B1219" : "#0F2A1A", border: `1px solid ${selectedEmail.analysis.riskLevel === "high" ? "#FF3B30" : "#34C759"}`, fontSize: 12, color: selectedEmail.analysis.riskLevel === "high" ? "#FF6B6B" : "#4ADE80" }}>
                            Risk: {selectedEmail.analysis.riskLevel}
                          </span>
                        </div>
                      </div>

                      <div style={{ background: "#111122", border: "1px solid #1E1E3A", borderRadius: 10, padding: 16 }}>
                        <div style={{ fontSize: 11, color: "#6C63FF", fontWeight: 700, marginBottom: 10, letterSpacing: "0.5px" }}>KEY POINTS</div>
                        {selectedEmail.analysis.keyPoints?.map((kp, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "#C9C9D4" }}>
                            <span style={{ color: "#6C63FF" }}>→</span> {kp}
                          </div>
                        ))}
                      </div>

                      <div style={{ background: "#111122", border: "1px solid #1E1E3A", borderRadius: 10, padding: 16 }}>
                        <div style={{ fontSize: 11, color: "#34C759", fontWeight: 700, marginBottom: 8, letterSpacing: "0.5px" }}>✉️ SUGGESTED REPLY</div>
                        <div style={{ fontSize: 13, color: "#C9C9D4", lineHeight: 1.7, whiteSpace: "pre-wrap", fontStyle: "italic" }}>{selectedEmail.analysis.suggestedReply}</div>
                      </div>

                      <div style={{ background: "#111122", border: "1px solid #2D5A27", borderRadius: 10, padding: 16 }}>
                        <div style={{ fontSize: 11, color: "#34C759", fontWeight: 700, marginBottom: 8, letterSpacing: "0.5px" }}>⚡ RECOMMENDED ACTION</div>
                        <div style={{ fontSize: 13, color: "#C9C9D4" }}>{selectedEmail.analysis.recommendedAction}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TODO TAB */}
        {activeTab === "todos" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {todos.length === 0 && !analyzing && (
              <div style={{ textAlign: "center", padding: 60, color: "#4B5563" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>⚡</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: "#6B7280" }}>No tasks yet</div>
                <div style={{ fontSize: 13, marginTop: 8 }}>Click "Analyze All Emails" to generate your daily TODO list</div>
              </div>
            )}

            {todos.length > 0 && (
              <>
                {/* Stats bar */}
                <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  {[
                    { label: "Total Tasks", value: todos.length, color: "#A78BFA" },
                    { label: "Completed", value: completedCount, color: "#34C759" },
                    { label: "Est. Time", value: totalTime > 60 ? `${Math.round(totalTime / 60)}h ${totalTime % 60}m` : `${totalTime}m`, color: "#38BDF8" },
                    { label: "Critical", value: todos.filter((t) => t.priority === "critical").length, color: "#FF3B30" },
                  ].map((s) => (
                    <div key={s.label} style={{ flex: 1, background: "#111122", border: "1px solid #1E1E3A", borderRadius: 12, padding: "14px 18px" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tasks grouped by priority */}
                {["critical", "high", "medium", "low"].map((priority) => {
                  const group = todos.filter((t) => t.priority === priority);
                  if (group.length === 0) return null;
                  const pc = PRIORITY_COLORS[priority];
                  return (
                    <div key={priority} style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.8px", color: pc.bg, marginBottom: 10 }}>{pc.label.toUpperCase()}</div>
                      {group.map((task) => {
                        const done = completedTodos.has(task.id);
                        return (
                          <div key={task.id} onClick={() => toggleTodo(task.id)} style={{ background: done ? "#0D0D0D" : "#111122", border: `1px solid ${done ? "#1A1A2E" : pc.bg + "33"}`, borderRadius: 12, padding: "14px 18px", marginBottom: 10, cursor: "pointer", opacity: done ? 0.5 : 1, transition: "all 0.2s" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                              <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? "#34C759" : pc.bg}`, background: done ? "#34C759" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, fontSize: 13 }}>
                                {done ? "✓" : ""}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: done ? "#6B7280" : "#E8E8F0", textDecoration: done ? "line-through" : "none", marginBottom: 4 }}>{task.title}</div>
                                <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 8, lineHeight: 1.5 }}>{task.detail}</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                  {task.deadline && <span style={{ padding: "2px 9px", borderRadius: 10, background: "#1E1E3A", border: "1px solid #2D2D4E", fontSize: 11, color: "#F59E0B" }}>⏰ {task.deadline}</span>}
                                  <span style={{ padding: "2px 9px", borderRadius: 10, background: "#1E1E3A", border: "1px solid #2D2D4E", fontSize: 11, color: "#9CA3AF" }}>📂 {task.category}</span>
                                  {task.estimatedMinutes && <span style={{ padding: "2px 9px", borderRadius: 10, background: "#1E1E3A", border: "1px solid #2D2D4E", fontSize: 11, color: "#9CA3AF" }}>⌛ {task.estimatedMinutes}m</span>}
                                  <span style={{ padding: "2px 9px", borderRadius: 10, background: "#1E1E3A", border: "1px solid #2D2D4E", fontSize: 11, color: "#6B7280" }}>📧 {task.sourceEmail?.slice(0, 30)}...</span>
                                </div>
                              </div>
                              <div style={{ fontSize: 18 }}>{EMOTION_MAP[task.emailSentiment] || "📩"}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* LOG TAB */}
        {activeTab === "log" && (
          <div style={{ flex: 1, padding: 24, overflowY: "auto" }} ref={logRef}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
              {analysisLog.length === 0 && (
                <div style={{ color: "#4B5563", padding: 40, textAlign: "center" }}>No analysis run yet. Click "Analyze All Emails" to start.</div>
              )}
              {analysisLog.map((entry, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 6, color: entry.type === "error" ? "#FF6B6B" : entry.type === "success" ? "#4ADE80" : entry.type === "system" ? "#A78BFA" : entry.type === "skip" ? "#9CA3AF" : "#C9C9D4" }}>
                  <span style={{ color: "#4B5563", flexShrink: 0 }}>{entry.time}</span>
                  <span>{entry.msg}</span>
                </div>
              ))}
              {analyzing && (
                <div style={{ color: "#6C63FF", display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                  <span>▶</span>
                  <span style={{ animation: "pulse 1s infinite" }}>Processing...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0A0A0F; }
        ::-webkit-scrollbar-thumb { background: #1E1E3A; border-radius: 4px; }
        input::placeholder, textarea::placeholder { color: #4B5563; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
