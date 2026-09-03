import React, { useRef, useState, useEffect } from "react";
import "./App.css";

const LAST_LOGIN = `Last login: ${new Date().toDateString()} on ttys001`;
const WELCOME = `Welcome to Sudharshan's portfolio terminal.\nType \"tutorial\" for a beginner guide or \"help\" to see all commands.`;
const PROMPT = "sudharshan@cyber:~$";

const SECTIONS = {
  about: `I'm Sudharshan, a Computer Science student specializing in Blue Team security operations, threat detection, and SOC monitoring. Experienced with incident analysis, evaluation of vulnerabilities, hands-on defense tooling, and collaborating in high-impact CTF & hackathon environments. This terminal demonstrates my focus on proactive defense, monitoring, security automation, and collaborative cyber resilience.`,
  aboutme: `Name: Sudharshan\nChennai Institute of Technology, Computer Science (2023-2027)\nCGPA: 8.41/10`,
  education: `Bachelor of Engineering in Computer Science and Engineering\nChennai Institute of Technology, Chennai, India\n2023 - 2027\nCGPA: 8.41/10`,
  certifications: `- CompTIA Security+\n- ISC2 Certified in Cybersecurity (CC)\n- Microsoft SC-200 Security Operations Analyst`,
  experience: [
    {text: "Cybersecurity Intern (Skolar)", bold: true},
    {text: "May 2024 \u2013 Jul 2024"},
    {text: "\u2022 Top 5 of 200 interns, strong performance"},
    {text: "\u2022 Linux pentesting, SOC monitoring, alert investigation, 50+ hrs defense/offense"},
    {text: ""},
    {text: "Developer Intern (Gurkul Soft)", bold: true},
    {text: "Dec 2024 \u2013 Jan 2025"},
    {text: "\u2022 Built and contributed to internal full stack application features using React.js, Flask for product related workflows."},
    {text: "\u2022 Built reusable product card components and implemented dynamic rendering for product based listings."},
    {text: "\u2022 Collaborated on code reviews, security analysis and maintenance activities across internal application features."},
  ],
  projects: [
    {text: "WebInfiltra \u2013 Security Tooling Platform (2025)", bold: true},
    {text: "Language/Tools: Python, Flask, Docker"},
    {text: "\u2022 Built a browser-based platform integrating six security modules: web exploitation, forensics, cryptography, OSINT, steganography, and CTF tooling. Strong separation of modules supports professional exploitation workflows."},
    {text: "\u2022 Designed a modular architecture enabling rapid feature expansion, session management, and real-time output streaming. Structured request handling and flow control maximize accessibility and interface flexibility."},
    {text: "\u2022 Containerized with Docker for simplified deployment and enhanced portability across operating systems."},
    {text: ""},
    {text: "Synthetic Log Generator & Detection Dashboard (2026)", bold: true},
    {text: "Language/Tools: Python, Flask"},
    {text: "\u2022 Engineered a log ingestion pipeline to provide a unified data source for threat detection and analytic processing."},
    {text: "\u2022 Developed a modular, rule-based threat detection engine to identify SQL Injection, Cross-Site Scripting (XSS), Path Traversal, and SSH abuse, generating MITRE ATT&CK-mapped alerts."},
    {text: "\u2022 Built a synthetic log simulation framework by modeling users, devices, and network activities, enabling advanced SOC detection and blue team training scenarios."},
  ],
  achievements: `• Livewire National CTF Runner-Up – 2nd, cash Rs. 10,000\n• OXTI CTF – 8th globally, 53,100 points\n• Israel–India Innovation: Finalist Top 20/500\n• VIT Bhopal Health Hack & TN Police Hackathon Finalist\n• TryHackMe – Top 20% globally`,
};

const SECTION_ORDER = [
  "about", "aboutme", "education", "certifications", "experience", "projects", "achievements"
];

const CMD_MAP = {
  "help": `Commands:\n- ls: List portfolio sections\n- cd <section>: Switch to/display the section\n- tutorial: Beginner guide\n- clear: Clear terminal\n- help: Show this help information` ,
  "tutorial": `Type ls to list sections.\nType cd <section> to display that section.\nE.g.: cd projects\nType 'help' to see all commands.`,
  "ls": SECTION_ORDER.map((key) => `/~/${key}`).join("    "),
};

function getSectionOutput(section) {
  const val = SECTIONS[section];
  if (!val) return [{type: "output", text: `Section not found: ${section}`}];
  if (Array.isArray(val)) {
    return val.map(item => ({type: item.bold ? "heading" : "output", text: item.text}));
  }
  return val.split("\n").map(line => ({type: "output", text: line}));
}

function parseCd(cmd) {
  const m = cmd.match(/^cd\s+([a-zA-Z0-9_-]+)$/);
  if (!m) return null;
  const section = m[1];
  if (!SECTIONS[section]) return { error: `No such section: ${section}` };
  return { section };
}

function Terminal() {
  const [lines, setLines] = useState([
    { type: "system", text: LAST_LOGIN },
    { type: "system", text: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [locked, setLocked] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (locked) return;
    const cmd = input.trim();
    if (!cmd.length) {
      setLines((l) => [ ...l, { type: "prompt", text: PROMPT + " " } ]);
      setInput("");
      return;
    }
    setLines((l) => [ ...l, { type: "prompt", text: PROMPT + " " + cmd } ]);
    if (cmd === "clear") {
      setLines([]);
      setInput("");
      return;
    }
    if (cmd.startsWith("cd ")) {
      const parsed = parseCd(cmd);
      if (parsed?.error) {
        setLines(l => [...l, {type: "output", text: parsed.error}]);
      } else if (parsed?.section) {
        setLines(l => [...l, ...getSectionOutput(parsed.section)]);
      } else {
        setLines(l => [...l, {type: "output", text: `Usage: cd <section>`}]);
      }
      setInput("");
      return;
    }
    if (cmd === "ls") {
      setLines(l => [...l, ...CMD_MAP["ls"].split("\n").map(line => ({type: "output", text: line}))]);
      setInput("");
      return;
    }
    if (CMD_MAP[cmd]) {
      setLines(l => [...l, ...CMD_MAP[cmd].split("\n").map(line => ({type: "output", text: line}))]);
      setInput("");
      return;
    }
    setLines(l => [...l,
      {type: "output", text: `Command not found: ${cmd}`},
      {type: "output", text: `Type \"help\" to see a list of valid commands.`}
    ]);
    setInput("");
  };

  return (
    <div
      className="terminal-root"
      style={{
        background: "#191b1c",
        width: "100vw",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        color: "#e5e5e5",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        className="terminal-pane"
        ref={scrollRef}
        style={{
          flex: 1,
          margin: "24px 24px 0 24px",
          padding: "28px 24px 0 24px",
          background: "#121212",
          borderRadius: 12,
          boxShadow: "0 0 16px #111c",
          border: "2px solid #30363d",
          overflowY: "auto",
          overflowX: "hidden",
          fontSize: 16,
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        {lines.map((line, i) => {
          if (line.type === "system") return <div key={i} style={{color: "#AEC4CF", wordBreak: "break-word"}}>{line.text}</div>;
          if (line.type === "prompt") return <div key={i} style={{color: "#96e072", wordBreak: "break-word"}}>{line.text}</div>;
          if (line.type === "heading") return <div key={i} style={{fontWeight: "bold", color: "#ffffff", wordBreak: "break-word"}}>{line.text}</div>;
          return <div key={i} style={{whiteSpace: "pre-wrap", wordBreak: "break-word"}}>{line.text}</div>;
        })}
        <form onSubmit={handleSubmit} style={{display: "flex", alignItems: "center", marginTop: 4, width: "100%"}} autoComplete="off">
          <span style={{color: "#96e072", fontSize: 16, flexShrink: 0}}>{PROMPT}&nbsp;</span>
          <input
            autoFocus
            style={{background: "none", border: "none", outline: "none", color: "#fff", font: "inherit", width: "100%", minWidth: 0, padding: 0, marginLeft: 4, fontSize: 16}}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={locked}
            spellCheck={false}
            tabIndex={0}
            aria-label="Type command"
          />
        </form>
      </div>
      <div style={{color: "#686b6b", fontSize: 12, textAlign: "center", padding: "8px 0 10px"}}>
        &copy; {new Date().getFullYear()} Sudharshan. Powered by React.
      </div>
    </div>
  );
}

export default Terminal;
