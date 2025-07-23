import React, { useState } from 'react';

export default function RBACLLMTheories() {
  const [role, setRole] = useState("intern");
  const [messages, setMessages] = useState([]);
  const [lastQuery, setLastQuery] = useState(null);
  const [flowStep, setFlowStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const handleQuery = (query) => {
    const userMessage = {
      sender: "user",
      text: query,
    };

    const normalizedQuery = query.toLowerCase().includes("audit") ? "audit" : query.toLowerCase().includes("revenue") ? "revenue" : "unknown";
    const systemResponse = getResponse(role, normalizedQuery);

    setMessages((prev) => [...prev, userMessage]);
    setFlowStep(1);
    setLastQuery(normalizedQuery);
    setIsTyping(false);

    // Simulate step-by-step flow with timed updates
    setTimeout(() => setFlowStep(2), 600);
    setTimeout(() => setFlowStep(3), 1200);
    setTimeout(() => setFlowStep(4), 1800);
    setTimeout(() => {
      setFlowStep(5);
      setIsTyping(true);
    }, 2400);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, systemResponse]);
    }, 3600);
  };

  const getResponse = (role, query) => {
    const responses = {
      intern: {
        audit: "🧠 Nova: Sorry! Interns aren't allowed to view full audit logs. Try asking your supervisor!",
        revenue: "🧠 Nova: Nope — that's financial data, and you're not cleared for that as an intern."
      },
      engineer: {
        audit: "🧠 Nova: Here's the audit log access for your assigned services only. Stay sharp.",
        revenue: "🧠 Nova: Access denied. Financial data is out of scope for engineering roles."
      },
      manager: {
        audit: "🧠 Nova: Full Q2 audit summary retrieved. All systems passed compliance checks.",
        revenue: "🧠 Nova: Our Q2 revenue is approximately $2.4M. Let me know if you'd like a breakdown."
      }
    };

    return {
      sender: "nova",
      text: responses[role][query] || "🧠 Nova: I'm not sure how to answer that yet."
    };
  };

  const flowSteps = [
    "User submits query",
    "Token issued with scopes",
    "Query sent to LLM",
    "LLM filters response",
    "Nova returns response"
  ];

  const tokenScopes = {
    intern: [],
    engineer: ["audit:view_team"],
    manager: ["audit:view_all", "finance:read"]
  };

  return (
    <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6">
      {/* Chat Interface */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <h3 className="text-indigo-300 font-semibold mb-4">🤖 Nova Chat Simulation</h3>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Select Role:</label>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setMessages([]);
              setLastQuery(null);
              setFlowStep(0);
              setIsTyping(false);
            }}
            className="bg-gray-800 text-white p-2 rounded border border-gray-600 w-full"
          >
            <option value="intern">Intern</option>
            <option value="engineer">Engineer</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleQuery("Show audit logs")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
          >
            “Show audit logs”
          </button>
          <button
            onClick={() => handleQuery("What’s our revenue?")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
          >
            “What’s our revenue?”
          </button>
        </div>

        <div className="bg-black p-4 rounded-lg space-y-4 max-h-96 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-green-400 font-mono text-sm">🧠 Nova: Ask me something, and I'll reply based on your role.</div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`text-sm font-mono whitespace-pre-wrap ${msg.sender === "user" ? "text-blue-300" : "text-green-400"}`}>
              {msg.sender === "user" ? `👤 You: ${msg.text}` : msg.text}
            </div>
          ))}
          {isTyping && <div className="text-green-400 font-mono text-sm animate-pulse">🧠 Nova is thinking...</div>}
        </div>
      </div>

      {/* Flow Visualization */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 h-fit">
        <h3 className="text-indigo-400 font-semibold mb-4">🔎 Query Flow</h3>
        <ul className="space-y-3">
          {flowSteps.map((step, index) => (
            <li
              key={index}
              className={`flex items-center gap-2 ${flowStep > index ? "text-green-400" : flowStep === index ? "text-yellow-300 animate-pulse" : "text-gray-500"}`}
            >
              <div className={`w-3 h-3 rounded-full ${flowStep > index ? "bg-green-400" : flowStep === index ? "bg-yellow-300" : "bg-gray-600"}`}></div>
              <span>{step}</span>
            </li>
          ))}
        </ul>
        {flowStep >= 2 && tokenScopes[role].length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tokenScopes[role].map((scope, idx) => (
              <span key={idx} className="bg-gray-800 text-green-300 border border-green-500 px-2 py-1 rounded text-xs font-mono">
                {scope}
              </span>
            ))}
          </div>
        )}
        {lastQuery && flowStep === flowSteps.length && (
          <div className="mt-4 border-t border-gray-700 pt-2 text-xs italic text-gray-400">
            Query path: {role} → token(scope) → LLM → filtered response
          </div>
        )}
      </div>
    </div>
  );
}
