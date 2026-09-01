import { useEffect, useRef, useState } from "react";
import "./app.css";

const WEBHOOK_URL = "https://esargsyan.app.n8n.cloud/webhook/clientflow-lead";
const REDUCE_MOTION =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
const POINTER_FINE =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(pointer: fine)").matches
    : false;

/* ============================== DATA ============================== */

const services = [
  {
    number: "01",
    title: "Websites that convert",
    text: "Fast, mobile-first websites built to make your business look established, explain your offer clearly, and turn visitors into inquiries or bookings.",
    bullets: ["Custom responsive design", "Conversion-focused structure", "Local SEO foundations", "Forms and booking integration"],
  },
  {
    number: "02",
    title: "Booking & client systems",
    text: "Replace scattered DMs, forms, calendars and spreadsheets with one cleaner flow for collecting and organizing client information.",
    bullets: ["Custom intake and booking forms", "Google Calendar workflows", "Client tracking systems", "Deposit and status tracking"],
  },
  {
    number: "03",
    title: "Business & AI automation",
    text: "Connect the tools you already use so repetitive admin work happens automatically and leads are followed up with faster — see the full list below.",
    bullets: ["Email and SMS workflows", "Lead notifications", "Follow-up and reminder automations", "n8n, Zapier and AI-assisted builds"],
  },
  {
    number: "04",
    title: "Dashboards & reporting",
    text: "Turn booking, sales and client data into clear business visibility with practical trackers and Tableau dashboards.",
    bullets: ["Tableau dashboards", "Lead and booking reporting", "Revenue and service trends", "Data cleanup and organization"],
  },
];

const problems = [
  ["Leads get lost", "New inquiries live across Instagram, email, texts and forms with no reliable follow-up system."],
  ["Too much is manual", "Confirmations, reminders, data entry and status updates take time that should be spent serving clients."],
  ["Your tools do not connect", "Your website, calendar, inbox and spreadsheets work separately instead of operating as one system."],
  ["You cannot see the full picture", "Business information exists, but it is difficult to turn scattered data into useful decisions."],
];

const workflow = [
  ["01", "Capture", "A customer finds your website and submits an inquiry or booking request."],
  ["02", "Organize", "Their information is structured automatically in your tracker or workflow."],
  ["03", "Respond", "The right confirmation, notification or follow-up is triggered immediately."],
  ["04", "Track", "Bookings, leads and performance become easier to monitor in one place."],
];

const packages = [
  {
    name: "Launch",
    price: "From $450",
    description: "For businesses that need a professional digital presence that is fast, clear and ready to generate inquiries.",
    features: ["Custom one-page website", "Mobile-first design", "Inquiry/contact form", "SEO foundations", "Analytics-ready setup"],
  },
  {
    name: "Flow",
    price: "From $850",
    popular: true,
    description: "For service businesses ready to connect their website, booking flow and client communication.",
    features: ["Everything in Launch", "Custom booking or intake form", "Google Sheets client tracker", "Automated email notifications", "Client confirmation workflow", "Calendar integration options"],
  },
  {
    name: "Custom System",
    price: "From $1,250",
    description: "For businesses with a more specific workflow that needs multiple tools, automations or reporting connected together.",
    features: ["Custom website or workflow", "Multi-step automations", "Booking and client systems", "Dashboard/reporting options", "Custom integrations", "Launch support"],
  },
];

const faqs = [
  ["Do I need a new website to use automation?", "No. Zoroliq can improve an existing process or build a new website and system together. We start with the biggest operational gap rather than forcing you to replace tools that already work."],
  ["What kinds of businesses do you work with?", "Zoroliq is built for service-based and local businesses such as beauty professionals, clinics, instructors, consultants, home services, studios and other teams that manage leads or appointments."],
  ["Can you connect Google Sheets, Gmail and Google Calendar?", "Yes. Those tools can be connected with forms and automation workflows so information is captured, organized and communicated with less manual work."],
  ["Do you offer ongoing support?", "Yes. Ongoing maintenance and workflow support can be added based on the complexity of the system and how frequently you need updates."],
  ["How much does a custom system cost?", "Simple websites start around $450, connected website and booking systems start around $850, and more advanced custom builds start around $1,250. Final pricing depends on scope and integrations."],
];

const ICONS = {
  bolt: <path d="M13 2 3 14h7l-1 8 11-14h-7l1-6z" />,
  chat: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <path d="M12 14v3M12 14l2 1.2" />
    </>
  ),
  star: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />,
  sync: (
    <>
      <path d="M21 12a9 9 0 0 1-15.3 6.4M3 12a9 9 0 0 1 15.3-6.4" />
      <path d="M21 5v5h-5M3 19v-5h5" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10M11 20V4M18 20v-7" />
      <path d="M2 20h20" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
};

const NODES = [
  {
    icon: "bolt",
    title: "Instant Lead Response",
    tag: "Reply before they leave the page.",
    trace: [
      ["Lead submits form or DM", "Website, Instagram or a missed call"],
      ["System drafts a reply automatically", "Personalized to what they asked"],
      ["Sent back in under 10 seconds", "Hot leads flagged straight to your phone"],
    ],
  },
  {
    icon: "chat",
    title: "AI Chat Assistant",
    tag: "A team member that never sleeps.",
    trace: [
      ["Visitor asks a question", "Pricing, availability, services"],
      ["Assistant answers and qualifies them", "Trained on your business specifically"],
      ["Call or booking goes on your calendar", "No back-and-forth required"],
    ],
  },
  {
    icon: "calendar",
    title: "Booking & Reminder Flows",
    tag: "Fewer no-shows, less back-and-forth.",
    trace: [
      ["Client books an appointment", "Through your site or booking page"],
      ["Confirmation + calendar invite sent", "Instantly, automatically"],
      ["Reminder sent 24 hours before", "With a one-click reschedule link"],
    ],
  },
  {
    icon: "star",
    title: "Review & Referral Requests",
    tag: "Turn happy clients into new ones.",
    trace: [
      ["Service is marked complete", "Status updates in your tracker"],
      ["Review request sent at the right time", "Timed so it feels natural, not pushy"],
      ["Referral offer follows a 5-star review", "Negative feedback routes to you privately"],
    ],
  },
  {
    icon: "sync",
    title: "Client Data Sync",
    tag: "No more copy-pasting into spreadsheets.",
    trace: [
      ["New client info is captured", "From a form, call or booking"],
      ["Auto-sorted into Sheets, Airtable or your CRM", "Cleaned and de-duplicated"],
      ["Record tagged and ready to use", "No manual entry, ever"],
    ],
  },
  {
    icon: "receipt",
    title: "Invoicing & Payment Follow-up",
    tag: "Get paid without chasing.",
    trace: [
      ["Service is completed", "Marked done in your workflow"],
      ["Invoice is generated and sent", "Matched to the client automatically"],
      ["Friendly reminder if unpaid in 3 days", "Receipt delivered the moment it's paid"],
    ],
  },
  {
    icon: "chart",
    title: "Reporting & Dashboards",
    tag: "See your business without digging for it.",
    trace: [
      ["The week wraps up", "Data pulled from every connected tool"],
      ["Dashboard refreshes automatically", "Tableau or a live Sheets report"],
      ["Snapshot emailed Monday at 8am", "Leads, bookings and revenue in one view"],
    ],
  },
  {
    icon: "gear",
    title: "Custom AI Workflows",
    tag: "Any tool, connected, built with AI speed.",
    trace: [
      ["A trigger fires in any tool you use", "n8n, Zapier, Make or a direct API"],
      ["Workflow logic runs the steps you define", "Branches, conditions, multiple systems"],
      ["Result lands exactly where it's needed", "Built and refined fast with AI assistance"],
    ],
  },
];

const REEL = [
  {
    title: "Inquiry lands in the DMs",
    desc: "Sarah messages the business on Instagram asking about availability. No one is at a desk to see it yet.",
    render: () => (
      <div className="mock-card">
        <div className="mock-head">
          <span className="mock-avatar">SM</span>
          <div><strong>Sarah M.</strong><small>Instagram DM · just now</small></div>
        </div>
        <div className="mock-body">
          <span className="bubble in">Hi! Do you have availability Sept 14 for a bridal trial?</span>
        </div>
      </div>
    ),
  },
  {
    title: "The reply sends itself",
    desc: "The assistant reads the message, checks availability and replies in seconds — in the business's own voice.",
    render: () => (
      <div className="mock-card">
        <div className="mock-head">
          <span className="mock-avatar">SM</span>
          <div><strong>Sarah M.</strong><small>Instagram DM</small></div>
        </div>
        <div className="mock-body">
          <span className="bubble in">Hi! Do you have availability Sept 14 for a bridal trial?</span>
          <span className="bubble out b2">Hi Sarah! Yes — I have 11am or 2pm on the 14th. Want me to pencil one in?</span>
          <span className="bubble-tag"><i /> Sent automatically · 8 seconds</span>
        </div>
      </div>
    ),
  },
  {
    title: "The booking locks in",
    desc: "The moment Sarah confirms, the slot is reserved on the calendar and a reminder is queued — no double-booking risk.",
    render: () => (
      <div className="mock-card">
        <div className="mock-cal-head"><strong>September 14</strong><span>TODAY + 6</span></div>
        <div className="mock-cal-body">
          <div className="cal-slot"><span>9:00</span> —</div>
          <div className="cal-slot new">
            <span>11:00</span> Sarah M. — Bridal Trial <span className="cal-chip">CONFIRMED</span>
          </div>
          <div className="cal-slot"><span>2:00</span> —</div>
        </div>
        <div className="cal-note">✓ Reminder scheduled for Sept 13, 5:00pm</div>
      </div>
    ),
  },
  {
    title: "The client record updates",
    desc: "Her details are organized into the client tracker automatically — no copy-pasting between apps.",
    render: () => (
      <div className="mock-card">
        <div className="mock-sheet-head"><span>NAME</span><span>SERVICE</span><span>DATE</span><span>STATUS</span></div>
        <div className="mock-sheet-body">
          <div className="sheet-row dim"><span>Amir K.</span><span>Consult</span><span>Sep 11</span><span>Done</span></div>
          <div className="sheet-row dim"><span>Priya D.</span><span>Touch-up</span><span>Sep 12</span><span>Done</span></div>
          <div className="sheet-row new"><span>Sarah M.</span><span>Bridal Trial</span><span>Sep 14</span><span className="status-ok">● Booked</span></div>
        </div>
      </div>
    ),
  },
  {
    title: "The dashboard reflects it",
    desc: "Leads, bookings and follow-ups stay current automatically, so the weekly numbers are never a guess.",
    render: () => (
      <div className="mock-card mock-dash">
        <div className="dashboard-heading"><span>Business overview</span><small>Updated just now</small></div>
        <div className="kpi-row">
          <div><small>NEW LEADS</small><strong>25</strong><span>this month</span></div>
          <div><small>BOOKED</small><strong>18</strong><span>organized</span></div>
          <div><small>FOLLOW-UPS</small><strong>05</strong><span>queued</span></div>
        </div>
        <div className="mock-toast"><i /> Weekly report will email automatically Monday 8am</div>
      </div>
    ),
  },
];

const QUICK_REPLIES = [
  { q: "What do you build?", a: "Custom websites, booking systems, AI-assisted automations and dashboards — built as one connected system, not separate pieces." },
  { q: "How much does it cost?", a: "Simple sites start from $450. Connected website + booking systems start from $850. Full custom automation systems start from $1,250." },
  { q: "Can you connect my tools?", a: "Yes — Google Sheets, Gmail, Calendar, n8n, Zapier and most booking or CRM tools can be connected into one workflow." },
  { q: "Do you work outside Calgary?", a: "Yes. We're based in Calgary and work with service businesses remotely across Canada." },
];

const REEL_DURATION = 4200;

/* ============================== SMALL PIECES ============================== */

function Mark({ compact = false }) {
  return (
    <svg className={compact ? "brand-mark compact" : "brand-mark"} viewBox="0 0 84 84" role="img" aria-label="Zoroliq logo">
      <defs>
        <linearGradient id="zoroliqGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8be9ff" />
          <stop offset="52%" stopColor="#5b8cff" />
          <stop offset="100%" stopColor="#9b7cff" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="82" height="82" rx="24" fill="#071021" stroke="rgba(255,255,255,.13)" />
      <path d="M22 24h40L30 60h34" fill="none" stroke="url(#zoroliqGradient)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="24" r="4.8" fill="#8be9ff" />
      <circle cx="64" cy="60" r="4.8" fill="#9b7cff" />
    </svg>
  );
}

function NodeIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

/** Fades/slides an element in the first time it enters the viewport. */
function Reveal({ as: Tag = "div", stagger = false, className = "", children, ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(REDUCE_MOTION);

  useEffect(() => {
    if (REDUCE_MOTION) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cls = [className, "reveal", stagger ? "reveal-stagger" : "", inView ? "in-view" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  );
}

/** Counts up to a target number once it scrolls into view. */
function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(REDUCE_MOTION ? to : 0);

  useEffect(() => {
    if (REDUCE_MOTION) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            const start = performance.now();
            const duration = 1100;
            function step(ts) {
              const p = Math.min((ts - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.round(to * eased));
              if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

/* ============================== APP ============================== */

export default function App() {
  const [status, setStatus] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ name: "", businessType: "", contact: "", message: "" });
  const [headerScrolled, setHeaderScrolled] = useState(false);
const [launcherVisible, setLauncherVisible] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [cycleWord, setCycleWord] = useState("flow");
  const [cycleAnimClass, setCycleAnimClass] = useState("");

  const [activeNode, setActiveNode] = useState(0);
  const [traceVisible, setTraceVisible] = useState(REDUCE_MOTION ? NODES[0].trace.length : 0);
  const builderRef = useRef(null);
  const nodeAutoplayRef = useRef(null);
  const traceRevealRef = useRef(null);

  const [reelIndex, setReelIndex] = useState(0);
  const [reelPlaying, setReelPlaying] = useState(!REDUCE_MOTION);
  const reelTimerRef = useRef(null);
  const reelSegRefs = useRef([]);

  const [openFaq, setOpenFaq] = useState(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatTyping, setChatTyping] = useState(false);
  const chatOpenedRef = useRef(false);
  const chatBodyRef = useRef(null);

  const cursorGlowRef = useRef(null);

  /* ---- form ---- */
  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setStatus("Sending your request…");
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "ZOROLIQ Website", submittedAt: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("Request received. We'll be in touch shortly.");
      setForm({ name: "", businessType: "", contact: "", message: "" });
    } catch {
      setStatus("Your request could not be sent. Please try again in a moment.");
    }
  }

  /* ---- header scroll state ---- */
  useEffect(() => {
    function onScroll() {
  setHeaderScrolled(window.scrollY > 12);
  setLauncherVisible(window.scrollY > 440);
}
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- nav scroll-spy ---- */
  useEffect(() => {
    const ids = ["services", "automations", "process", "pricing", "faq"];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* ---- hero cycling word ---- */
  useEffect(() => {
    if (REDUCE_MOTION) return;
    const words = ["flow", "respond", "book", "report"];
    let i = 0;
    const id = setInterval(() => {
      setCycleAnimClass("out");
      setTimeout(() => {
        i = (i + 1) % words.length;
        setCycleWord(words[i]);
        setCycleAnimClass("");
      }, 260);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  /* ---- automation builder autoplay ---- */
  function renderTraceFor(index) {
    setActiveNode(index);
    setTraceVisible(0);
    if (traceRevealRef.current) clearInterval(traceRevealRef.current);
    const total = NODES[index].trace.length;
    if (REDUCE_MOTION) {
      setTraceVisible(total);
      return;
    }
    let r = 0;
    traceRevealRef.current = setInterval(() => {
      r += 1;
      setTraceVisible(r);
      if (r >= total) clearInterval(traceRevealRef.current);
    }, 220);
  }

  function resetNodeAutoplay() {
    if (nodeAutoplayRef.current) clearInterval(nodeAutoplayRef.current);
    if (REDUCE_MOTION) return;
    nodeAutoplayRef.current = setInterval(() => {
      setActiveNode((current) => {
        const next = (current + 1) % NODES.length;
        renderTraceFor(next);
        return next;
      });
    }, 5200);
  }

  useEffect(() => {
    // Deferred so the initial trace reveal doesn't set state synchronously
    // within the effect body (kicks off on the next tick instead).
    const kickoff = setTimeout(() => renderTraceFor(0), 0);
    resetNodeAutoplay();
    const el = builderRef.current;
    function pause() {
      if (nodeAutoplayRef.current) clearInterval(nodeAutoplayRef.current);
    }
    if (el) {
      el.addEventListener("mouseenter", pause);
      el.addEventListener("mouseleave", resetNodeAutoplay);
    }
    return () => {
      clearTimeout(kickoff);
      if (nodeAutoplayRef.current) clearInterval(nodeAutoplayRef.current);
      if (traceRevealRef.current) clearInterval(traceRevealRef.current);
      if (el) {
        el.removeEventListener("mouseenter", pause);
        el.removeEventListener("mouseleave", resetNodeAutoplay);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectNode(index) {
    renderTraceFor(index);
    resetNodeAutoplay();
  }

  /* ---- automation reel ---- */
  function armReelTimer(index, playing) {
    clearTimeout(reelTimerRef.current);
    const seg = reelSegRefs.current[index];
    if (seg) {
      const bar = seg.querySelector("i");
      if (bar) {
        seg.style.setProperty("--reel-duration", REEL_DURATION + "ms");
        bar.style.animationPlayState = playing ? "running" : "paused";
      }
    }
    if (playing && !REDUCE_MOTION) {
      reelTimerRef.current = setTimeout(() => {
        goToReelScene((index + 1) % REEL.length, true);
      }, REEL_DURATION);
    }
  }

  function goToReelScene(index, playing) {
    setReelIndex(index);
    // reset any previous segment's inline width so it can animate again later
    reelSegRefs.current.forEach((seg, i) => {
      if (!seg) return;
      const bar = seg.querySelector("i");
      if (bar && i !== index) bar.style.width = "";
    });
    armReelTimer(index, playing);
  }

  useEffect(() => {
    // Deferred for the same reason as the automation builder kickoff above.
    const kickoff = setTimeout(() => goToReelScene(0, !REDUCE_MOTION), 0);
    return () => {
      clearTimeout(kickoff);
      clearTimeout(reelTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleReelPlaying() {
    const next = !reelPlaying;
    setReelPlaying(next);
    armReelTimer(reelIndex, next);
  }

  function jumpReelScene(index) {
    goToReelScene(index, reelPlaying);
  }

  /* ---- cursor glow / magnetic / tilt (desktop only) ---- */
  useEffect(() => {
    if (!POINTER_FINE || REDUCE_MOTION) return;
    const glow = cursorGlowRef.current;
    let gx = 0, gy = 0, cx = 0, cy = 0, active = false, raf;

    function onMove(e) {
      gx = e.clientX;
      gy = e.clientY;
      if (!active && glow) {
        active = true;
        glow.classList.add("active");
      }
    }
    window.addEventListener("mousemove", onMove);

    function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      if (glow) glow.style.transform = `translate(${cx}px,${cy}px)`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    const magneticEls = Array.from(document.querySelectorAll(".magnetic"));
    const magneticHandlers = magneticEls.map((btn) => {
      function move(e) {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${mx * 0.18}px, ${my * 0.32}px)`;
      }
      function leave() {
        btn.style.transform = "";
      }
      btn.addEventListener("mousemove", move);
      btn.addEventListener("mouseleave", leave);
      return { btn, move, leave };
    });

    const tiltEls = Array.from(document.querySelectorAll(".tilt"));
    const tiltHandlers = tiltEls.map((card) => {
      function move(e) {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${py * -6}deg) rotateY(${px * 6}deg) translateY(-2px)`;
      }
      function leave() {
        card.style.transform = "";
      }
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      return { card, move, leave };
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      magneticHandlers.forEach(({ btn, move, leave }) => {
        btn.removeEventListener("mousemove", move);
        btn.removeEventListener("mouseleave", leave);
      });
      tiltHandlers.forEach(({ card, move, leave }) => {
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      });
    };
  }, [activeNode]);

  /* ---- chat widget ---- */
  function openChat() {
    const next = !chatOpen;
    setChatOpen(next);
    if (next && !chatOpenedRef.current) {
      chatOpenedRef.current = true;
      setTimeout(() => {
        setChatMessages([
          {
            who: "bot",
            text: "Hi! I'm a live demo of the AI assistant automation — the same kind Zoroliq builds into client websites. Ask me anything below.",
          },
        ]);
      }, 350);
    }
  }

  function askQuick(item) {
    setChatMessages((msgs) => [...msgs, { who: "user", text: item.q }]);
    setChatTyping(true);
    setTimeout(() => {
      setChatTyping(false);
      setChatMessages((msgs) => [...msgs, { who: "bot", text: item.a }]);
    }, 850);
  }

  useEffect(() => {
    const el = chatBodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatMessages, chatTyping]);

  /* ---- faq ---- */
  function toggleFaq(index) {
    setOpenFaq((current) => (current === index ? null : index));
  }

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-noise" />
      <div className="cursor-glow" ref={cursorGlowRef} />
      <div className="signal-rail" />

      <header className={headerScrolled ? "site-header scrolled" : "site-header"}>
        <div className="site-header-inner">
          <a className="brand" href="#top" aria-label="Zoroliq home">
            <Mark compact />
            <div><strong>ZOROLIQ</strong><span>Digital systems for growing businesses</span></div>
          </a>

          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span /><span />
          </button>

          <nav className={mobileOpen ? "nav open" : "nav"} aria-label="Primary navigation">
            <a href="#services" className={activeNav === "services" ? "active" : ""} onClick={() => setMobileOpen(false)}>Services</a>
            <a href="#automations" className={activeNav === "automations" ? "active" : ""} onClick={() => setMobileOpen(false)}>Automations</a>
            <a href="#process" className={activeNav === "process" ? "active" : ""} onClick={() => setMobileOpen(false)}>Process</a>
            <a href="#pricing" className={activeNav === "pricing" ? "active" : ""} onClick={() => setMobileOpen(false)}>Pricing</a>
            <a href="#faq" className={activeNav === "faq" ? "active" : ""} onClick={() => setMobileOpen(false)}>FAQ</a>
            <a className="nav-cta" href="#contact" onClick={() => setMobileOpen(false)}>Get a custom plan</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Calgary-built · Serving businesses across Canada</div>
            <h1>
              Your business should{" "}
              <span className="cycle-wrap">
                <em className={`cycle-word${cycleAnimClass ? " " + cycleAnimClass : ""}`}>{cycleWord}</em>
              </span>
              <br />
              without the busywork.
            </h1>
            <p className="lede">
              Zoroliq builds custom websites, booking systems, AI-assisted automations and dashboards that work together—so service businesses capture leads, respond faster and spend less time on repetitive admin.
            </p>
            <div className="hero-actions">
              <a className="button primary magnetic" href="#contact">Build my system <span>↗</span></a>
              <a className="button secondary magnetic" href="#reel-demo">Watch it work ↓</a>
            </div>
            <div className="hero-proof" aria-label="Key capabilities">
              <div><span className="num"><Counter to={24} suffix="/7" /></span><small>Automated response coverage</small></div>
              <div><span className="num"><Counter to={40} suffix="+ hrs" /></span><small>Admin time saved monthly</small></div>
              <div><span className="num"><Counter to={1} suffix=" system" /></span><small>Replacing six disconnected tools</small></div>
            </div>
          </div>

          <Reveal className="system-preview" aria-label="Example Zoroliq connected business system">
            <div className="preview-top">
              <div><span className="mini-label">CONNECTED SYSTEM</span><h2>Lead → booking → follow-up</h2></div>
              <span className="status-pill"><i /> Live flow</span>
            </div>

            <div className="preview-route">
              <div className="route-card active"><span>Website</span><strong>New inquiry</strong><small>Client submits form</small></div>
              <div className="route-line l1"><i /></div>
              <div className="route-card"><span>Automation</span><strong>Instant action</strong><small>Data + email + calendar</small></div>
              <div className="route-line l2"><i /></div>
              <div className="route-card"><span>Business</span><strong>Organized</strong><small>Ready to follow up</small></div>
            </div>

            <div className="mini-dashboard">
              <div className="dashboard-heading"><span>Business overview</span><small>Example interface</small></div>
              <div className="kpi-row">
                <div><small>NEW LEADS</small><strong><Counter to={24} /></strong><span>this month</span></div>
                <div><small>BOOKED</small><strong><Counter to={17} /></strong><span>organized</span></div>
                <div><small>FOLLOW-UPS</small><strong><Counter to={6} /></strong><span>queued</span></div>
              </div>
              <div className="visual-bars" aria-hidden="true">
                {[38, 51, 44, 65, 59, 76, 88, 71, 96].map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="trust-strip" aria-label="Zoroliq capabilities">
          <div className="marquee">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1}>
                {["WEBSITES", "AI AUTOMATION", "BOOKING SYSTEMS", "WORKFLOW AUTOMATION", "TABLEAU DASHBOARDS", "CLIENT TRACKING"].map((item) => (
                  <li key={item}>{item}<i /></li>
                ))}
              </ul>
            ))}
          </div>
        </section>

        <section className="reel-section wrap" id="reel-demo">
          <Reveal as="div" className="reel-top">
            <div>
              <p className="section-kicker">WATCH IT WORK</p>
              <h2>One inquiry. Five automated moments.<br />Zero manual work.</h2>
              <p>This is a real Zoroliq automation, start to finish — press play or step through it.</p>
            </div>
            <button className="reel-play" type="button" onClick={toggleReelPlaying}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                {reelPlaying ? <path d="M8 5v14l11-7z" /> : <path d="M6 5h4v14H6zM14 5h4v14h-4z" />}
              </svg>
              <span>{reelPlaying ? "Pause" : "Play"}</span>
            </button>
          </Reveal>

          <Reveal className="reel-wrap">
            <div className="reel-frame">
              <div className="reel-chrome">
                <span className="rc-dot r" /><span className="rc-dot y" /><span className="rc-dot g" />
                <span className="reel-url">zoroliq.com/automation · <b>live run</b></span>
              </div>
              <div className="reel-progress">
                {REEL.map((_, i) => (
                  <div
                    key={i}
                    className={`reel-seg${i === reelIndex ? " active" : ""}${i < reelIndex ? " done" : ""}`}
                    ref={(el) => (reelSegRefs.current[i] = el)}
                    onClick={() => jumpReelScene(i)}
                  >
                    <i />
                  </div>
                ))}
              </div>
              <div className="reel-stage">
                {REEL.map((scene, i) => (
                  <div className={`reel-scene${i === reelIndex ? " active" : ""}`} key={i}>
                    {scene.render()}
                  </div>
                ))}
              </div>
            </div>
            <div className="reel-caption">
              {REEL.map((scene, i) => (
                <div
                  key={i}
                  className={`reel-step-card${i === reelIndex ? " active" : ""}`}
                  onClick={() => jumpReelScene(i)}
                >
                  <span className="reel-step-num">0{i + 1}</span>
                  <div><h4>{scene.title}</h4><p>{scene.desc}</p></div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="section wrap problem-section">
          <Reveal className="section-heading split-heading">
            <div>
              <p className="section-kicker">THE REAL PROBLEM</p>
              <h2>It is rarely just your website.</h2>
            </div>
            <p>Most small businesses already have plenty of tools. The problem is the gaps between them—and the manual work required to keep everything moving.</p>
          </Reveal>

          <Reveal stagger className="problem-grid">
            {problems.map(([title, text], index) => (
              <article className="problem-card" key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </Reveal>
        </section>

        <section id="services" className="section wrap">
          <Reveal className="section-heading">
            <p className="section-kicker">WHAT WE BUILD</p>
            <h2>One partner for the front end <br />and the systems behind it.</h2>
            <p className="wide-copy">Every Zoroliq build starts with the business process. We design the customer experience, connect the workflow and leave you with something simpler to operate.</p>
          </Reveal>

          <Reveal stagger className="service-list">
            {services.map((service) => (
              <article className="service-row" key={service.title}>
                <div className="service-number">{service.number}</div>
                <div className="service-main"><h3>{service.title}</h3><p>{service.text}</p></div>
                <ul>{service.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              </article>
            ))}
          </Reveal>
        </section>

        <section id="automations" className="automation-section">
          <div className="wrap">
            <Reveal className="section-heading">
              <p className="section-kicker">AUTOMATION SERVICES</p>
              <h2>Every automation we build — click one to see it run.</h2>
              <p className="wide-copy">These are the specific automations Zoroliq designs and builds for clients, often with AI doing the heavy lifting behind the scenes. Select a node below to preview exactly what happens, step by step.</p>
            </Reveal>

            <Reveal stagger className="impact-band">
              <div className="impact-cell"><strong><Counter to={40} suffix="+ hrs" /></strong><span>saved on admin work every month</span></div>
              <div className="impact-cell"><strong><Counter to={24} suffix="/7" /></strong><span>automated lead response, day or night</span></div>
              <div className="impact-cell"><strong><Counter to={5} suffix="x" /></strong><span>faster follow-up than manual outreach</span></div>
              <div className="impact-cell"><strong><Counter to={1} suffix=" system" /></strong><span>replacing five or six disconnected tools</span></div>
            </Reveal>

            <div className="builder" ref={builderRef}>
              <Reveal stagger className="builder-grid">
                {NODES.map((node, i) => (
                  <button
                    type="button"
                    className={`node-card tilt${i === activeNode ? " active" : ""}`}
                    key={node.title}
                    onClick={() => selectNode(i)}
                  >
                    <span className="node-index">N{String(i + 1).padStart(2, "0")}</span>
                    <span className="node-icon"><NodeIcon name={node.icon} /></span>
                    <h4>{node.title}</h4>
                    <p>{node.tag}</p>
                  </button>
                ))}
              </Reveal>

              <div className="trace-console">
                <div className="trace-head">
                  <span className="mini-label">NODE {String(activeNode + 1).padStart(2, "0")} · ACTIVE</span>
                  <h4>{NODES[activeNode].title}</h4>
                </div>
                <div className="trace-steps">
                  {NODES[activeNode].trace.map((step, i) => (
                    <div className={`trace-step${i < traceVisible ? " show" : ""}`} key={i}>
                      <span className="dot" />
                      <span className="txt">{step[0]}<small>{step[1]}</small></span>
                    </div>
                  ))}
                </div>
                <div className="trace-cta"><a href="#contact">Wire this into my business →</a></div>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="process-section">
          <div className="wrap process-wrap">
            <Reveal className="process-copy">
              <p className="section-kicker">HOW IT WORKS</p>
              <h2>Built around how your business actually operates.</h2>
              <p>No giant software migration. No unnecessary tech stack. We map the friction first, then build the smallest system that creates the biggest improvement.</p>
              <a href="#contact" className="text-link">Start with a free consultation <span>→</span></a>
            </Reveal>
            <Reveal stagger className="workflow-list">
              {workflow.map(([number, title, text]) => (
                <div className="workflow-step" key={number}>
                  <span>{number}</span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section wrap industries-section">
          <Reveal className="section-heading split-heading">
            <div>
              <p className="section-kicker">WHO IT'S FOR</p>
              <h2>Service businesses with too much happening manually.</h2>
            </div>
            <p>Especially useful for appointment-based, local and service businesses that rely on fast response times, clean client information and consistent follow-up.</p>
          </Reveal>
          <Reveal stagger className="industry-cloud">
            {["Beauty & aesthetics", "Clinics", "Home services", "Tutors & instructors", "Studios", "Consultants", "Florists", "Trades", "Local services"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </Reveal>
        </section>

        <section id="pricing" className="section wrap pricing-section">
          <Reveal className="section-heading">
            <p className="section-kicker">STARTING PRICES</p>
            <h2>Start with what solves the biggest problem.</h2>
            <p className="wide-copy">Every build is scoped around the business. These starting prices give you a clear idea of where different levels of work begin.</p>
          </Reveal>

          <Reveal stagger className="pricing-grid">
            {packages.map((item) => (
              <article className={item.popular ? "price-card featured" : "price-card"} key={item.name}>
                {item.popular && <div className="popular-label">MOST POPULAR</div>}
                <p className="price-name">{item.name}</p>
                <h3>{item.price}</h3>
                <p>{item.description}</p>
                <ul>{item.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
                <a href="#contact">Request a quote <span>↗</span></a>
              </article>
            ))}
          </Reveal>
          <p className="pricing-footnote">Need only automation, a dashboard, data cleanup or ongoing maintenance? Those can be scoped separately.</p>
        </section>

        <section id="faq" className="section wrap faq-section">
          <Reveal className="section-heading split-heading">
            <div><p className="section-kicker">FAQ</p><h2>Before we build.</h2></div>
            <p>Clear answers to the questions small businesses usually have before connecting their website and workflows.</p>
          </Reveal>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <div className={`faq-item${openFaq === index ? " open" : ""}`} key={question}>
                <button type="button" className="faq-q" onClick={() => toggleFaq(index)}>
                  {question}<span className="plus">+</span>
                </button>
                <div className="faq-a" style={{ maxHeight: openFaq === index ? "260px" : "0px" }}>
                  <p>{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="wrap">
          <Reveal className="contact-section">
            <div className="contact-copy">
              <p className="section-kicker">LET'S BUILD SOMETHING USEFUL</p>
              <h2>Tell us what is slowing your business down.</h2>
              <p>Share how you currently handle leads, bookings or client information. We'll recommend the simplest setup that can improve the flow.</p>
              <div className="contact-notes">
                <span>✓ No-obligation consultation</span>
                <span>✓ Custom recommendation</span>
                <span>✓ Calgary + remote across Canada</span>
              </div>
            </div>

            <form className="contact-form" onSubmit={submitForm}>
              <div className="field-grid">
                <label><span>Your name</span><input name="name" placeholder="Jane Smith" value={form.name} onChange={updateForm} required /></label>
                <label><span>Business type</span><input name="businessType" placeholder="Salon, clinic, contractor…" value={form.businessType} onChange={updateForm} required /></label>
              </div>
              <label><span>Best email or phone number</span><input name="contact" placeholder="Where should we reach you?" value={form.contact} onChange={updateForm} required /></label>
              <label>
                <span>What would you like to improve?</span>
                <textarea name="message" placeholder="Tell us what you're doing manually now, what isn't working, or what you want your new system to do." value={form.message} onChange={updateForm} required />
              </label>
              <button type="submit">Request my consultation <span>↗</span></button>
              {status && <p className="form-status" role="status">{status}</p>}
            </form>
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <a className="brand footer-brand" href="#top">
            <Mark compact />
            <div><strong>ZOROLIQ</strong><span>Digital systems for growing businesses</span></div>
          </a>
          <div className="footer-links">
            <a href="#services">Services</a>
            <a href="#automations">Automations</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
            <a href="https://www.instagram.com/zoroliq/" target="_blank" rel="noopener noreferrer" aria-label="Zoroliq on Instagram">Instagram ↗</a>
          </div>
          <p>© {new Date().getFullYear()} ZOROLIQ · Calgary, Alberta · Serving Canada</p>
        </div>
      </footer>

      <button
  className={`chat-launcher${launcherVisible ? " visible" : ""}`}
  type="button"
  aria-label="Open Zoroliq AI assistant demo"
        aria-expanded={chatOpen}
        onClick={openChat}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span className="ping" />
      </button>

      <div className={`chat-panel${chatOpen ? " open" : ""}`} role="dialog" aria-label="Zoroliq AI assistant demo">
        <div className="chat-head">
          <span className="dot-live" />
          <div><strong>Zoroliq Assistant</strong><small>This is a live demo of the automation itself</small></div>
        </div>
        <div className="chat-body" ref={chatBodyRef}>
          {chatMessages.map((m, i) => (
            <div className={`chat-msg ${m.who}`} key={i}>{m.text}</div>
          ))}
          {chatTyping && (
            <div className="chat-typing"><span /><span /><span /></div>
          )}
        </div>
        <div className="chat-quick">
          {QUICK_REPLIES.map((item) => (
            <button type="button" key={item.q} disabled={chatTyping} onClick={() => askQuick(item)}>
              {item.q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}