import { useState } from "react";
import "./app.css";

const WEBHOOK_URL = "https://esargsyan.app.n8n.cloud/webhook/clientflow-lead";

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
    title: "Business automation",
    text: "Connect the tools you already use so repetitive admin work happens automatically and leads are followed up with faster.",
    bullets: ["Email and SMS workflows", "Lead notifications", "Follow-up and reminder automations", "n8n and Zapier integrations"],
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
  ["Do I need a new website to use automation?", "No. ZOROLIQ can improve an existing process or build a new website and system together. We start with the biggest operational gap rather than forcing you to replace tools that already work."],
  ["What kinds of businesses do you work with?", "ZOROLIQ is built for service-based and local businesses such as beauty professionals, clinics, instructors, consultants, home services, studios and other teams that manage leads or appointments."],
  ["Can you connect Google Sheets, Gmail and Google Calendar?", "Yes. Those tools can be connected with forms and automation workflows so information is captured, organized and communicated with less manual work."],
  ["Do you offer ongoing support?", "Yes. Ongoing maintenance and workflow support can be added based on the complexity of the system and how frequently you need updates."],
  ["How much does a custom system cost?", "Simple websites start around $450, connected website and booking systems start around $850, and more advanced custom builds start around $1,250. Final pricing depends on scope and integrations."],
];

function Mark({ compact = false }) {
  return (
    <svg
      className={compact ? "brand-mark compact" : "brand-mark"}
      viewBox="0 0 84 84"
      role="img"
      aria-label="ZOROLIQ logo"
    >
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

export default function App() {
  const [status, setStatus] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    businessType: "",
    contact: "",
    message: "",
  });

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
        body: JSON.stringify({
          ...form,
          source: "ZOROLIQ Website",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Submission failed");

      setStatus("Request received. We'll be in touch shortly.");
      setForm({ name: "", businessType: "", contact: "", message: "" });
    } catch {
      setStatus("Your request could not be sent. Please try again in a moment.");
    }
  }

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-noise" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="ZOROLIQ home">
          <Mark compact />
          <div>
            <strong>ZOROLIQ</strong>
            <span>Digital systems for growing businesses</span>
          </div>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav className={mobileOpen ? "nav open" : "nav"} aria-label="Primary navigation">
          <a href="#services" onClick={() => setMobileOpen(false)}>Services</a>
          <a href="#process" onClick={() => setMobileOpen(false)}>Process</a>
          <a href="#pricing" onClick={() => setMobileOpen(false)}>Pricing</a>
          <a href="#faq" onClick={() => setMobileOpen(false)}>FAQ</a>
          <a className="nav-cta" href="#contact" onClick={() => setMobileOpen(false)}>Get a custom plan</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Calgary-built · Serving businesses across Canada</div>
            <h1>
              Your business should <em>flow</em> without the busywork.
            </h1>
            <p>
              ZOROLIQ builds custom websites, booking systems, automations and dashboards that work together—so service businesses can capture leads, respond faster and spend less time on repetitive admin.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#contact">Build my system <span>↗</span></a>
              <a className="button secondary" href="#services">See what we build</a>
            </div>
            <div className="hero-proof" aria-label="Key capabilities">
              <div><span>01</span><strong>Custom-built</strong><small>Around your workflow</small></div>
              <div><span>02</span><strong>Connected</strong><small>Tools working together</small></div>
              <div><span>03</span><strong>Practical</strong><small>Built to save real time</small></div>
            </div>
          </div>

          <div className="system-preview" aria-label="Example ZOROLIQ connected business system">
            <div className="preview-top">
              <div>
                <span className="mini-label">CONNECTED SYSTEM</span>
                <h2>Lead → booking → follow-up</h2>
              </div>
              <span className="status-pill"><i /> Live flow</span>
            </div>

            <div className="preview-route">
              <div className="route-card active"><span>Website</span><strong>New inquiry</strong><small>Client submits form</small></div>
              <div className="route-line"><span>→</span></div>
              <div className="route-card"><span>Automation</span><strong>Instant action</strong><small>Data + email + calendar</small></div>
              <div className="route-line"><span>→</span></div>
              <div className="route-card"><span>Business</span><strong>Organized</strong><small>Ready to follow up</small></div>
            </div>

            <div className="mini-dashboard">
              <div className="dashboard-heading"><span>Business overview</span><small>Example interface</small></div>
              <div className="kpi-row">
                <div><small>NEW LEADS</small><strong>24</strong><span>this month</span></div>
                <div><small>BOOKED</small><strong>17</strong><span>organized</span></div>
                <div><small>FOLLOW-UPS</small><strong>06</strong><span>queued</span></div>
              </div>
              <div className="visual-bars" aria-hidden="true">
                {[38, 51, 44, 65, 59, 76, 88, 71, 96].map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="ZOROLIQ capabilities">
          <div className="wrap trust-inner">
            <span>WEBSITES</span><i />
            <span>BOOKING SYSTEMS</span><i />
            <span>WORKFLOW AUTOMATION</span><i />
            <span>TABLEAU DASHBOARDS</span><i />
            <span>CLIENT TRACKING</span>
          </div>
        </section>

        <section className="section wrap problem-section">
          <div className="section-heading split-heading">
            <div>
              <p className="section-kicker">THE REAL PROBLEM</p>
              <h2>It is rarely just your website.</h2>
            </div>
            <p>
              Most small businesses already have plenty of tools. The problem is the gaps between them—and the manual work required to keep everything moving.
            </p>
          </div>

          <div className="problem-grid">
            {problems.map(([title, text], index) => (
              <article className="problem-card" key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="section wrap">
          <div className="section-heading">
            <p className="section-kicker">WHAT WE BUILD</p>
            <h2>One partner for the front end <br />and the systems behind it.</h2>
            <p className="wide-copy">
              Every ZOROLIQ build starts with the business process. We design the customer experience, connect the workflow and leave you with something simpler to operate.
            </p>
          </div>

          <div className="service-list">
            {services.map((service) => (
              <article className="service-row" key={service.title}>
                <div className="service-number">{service.number}</div>
                <div className="service-main">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
                <ul>
                  {service.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="section process-section">
          <div className="wrap process-wrap">
            <div className="process-copy">
              <p className="section-kicker">HOW IT WORKS</p>
              <h2>Built around how your business actually operates.</h2>
              <p>
                No giant software migration. No unnecessary tech stack. We map the friction first, then build the smallest system that creates the biggest improvement.
              </p>
              <a href="#contact" className="text-link">Start with a free consultation <span>→</span></a>
            </div>
            <div className="workflow-list">
              {workflow.map(([number, title, text]) => (
                <div className="workflow-step" key={number}>
                  <span>{number}</span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section wrap industries-section">
          <div className="section-heading split-heading">
            <div>
              <p className="section-kicker">WHO IT'S FOR</p>
              <h2>Service businesses with too much happening manually.</h2>
            </div>
            <p>
              Especially useful for appointment-based, local and service businesses that rely on fast response times, clean client information and consistent follow-up.
            </p>
          </div>
          <div className="industry-cloud">
            {["Beauty & aesthetics", "Clinics", "Home services", "Tutors & instructors", "Studios", "Consultants", "Florists", "Trades", "Local services"].map((item) => <span key={item}>{item}</span>)}
          </div>
        </section>

        <section id="pricing" className="section wrap pricing-section">
          <div className="section-heading">
            <p className="section-kicker">STARTING PRICES</p>
            <h2>Start with what solves the biggest problem.</h2>
            <p className="wide-copy">Every build is scoped around the business. These starting prices give you a clear idea of where different levels of work begin.</p>
          </div>

          <div className="pricing-grid">
            {packages.map((item) => (
              <article className={item.popular ? "price-card featured" : "price-card"} key={item.name}>
                {item.popular && <div className="popular-label">MOST POPULAR</div>}
                <p className="price-name">{item.name}</p>
                <h3>{item.price}</h3>
                <p>{item.description}</p>
                <ul>
                  {item.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}
                </ul>
                <a href="#contact">Request a quote <span>↗</span></a>
              </article>
            ))}
          </div>
          <p className="pricing-footnote">Need only automation, a dashboard, data cleanup or ongoing maintenance? Those can be scoped separately.</p>
        </section>

        <section id="faq" className="section wrap faq-section">
          <div className="section-heading split-heading">
            <div>
              <p className="section-kicker">FAQ</p>
              <h2>Before we build.</h2>
            </div>
            <p>Clear answers to the questions small businesses usually have before connecting their website and workflows.</p>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<span>+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section wrap">
          <div className="contact-copy">
            <p className="section-kicker">LET'S BUILD SOMETHING USEFUL</p>
            <h2>Tell us what is slowing your business down.</h2>
            <p>
              Share how you currently handle leads, bookings or client information. We'll recommend the simplest setup that can improve the flow.
            </p>
            <div className="contact-notes">
              <span>✓ No-obligation consultation</span>
              <span>✓ Custom recommendation</span>
              <span>✓ Calgary + remote across Canada</span>
            </div>
          </div>

          <form className="contact-form" onSubmit={submitForm}>
            <div className="field-grid">
              <label>
                <span>Your name</span>
                <input name="name" placeholder="Jane Smith" value={form.name} onChange={updateForm} required />
              </label>
              <label>
                <span>Business type</span>
                <input name="businessType" placeholder="Salon, clinic, contractor…" value={form.businessType} onChange={updateForm} required />
              </label>
            </div>
            <label>
              <span>Best email or phone number</span>
              <input name="contact" placeholder="Where should we reach you?" value={form.contact} onChange={updateForm} required />
            </label>
            <label>
              <span>What would you like to improve?</span>
              <textarea name="message" placeholder="Tell us what you're doing manually now, what isn't working, or what you want your new system to do." value={form.message} onChange={updateForm} required />
            </label>
            <button type="submit">Request my consultation <span>↗</span></button>
            {status && <p className="form-status" role="status">{status}</p>}
          </form>
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
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
            <a href="https://www.instagram.com/zoroliq/" target="_blank" rel="noopener noreferrer" aria-label="ZOROLIQ on Instagram">Instagram ↗</a>
          </div>
          <p>© {new Date().getFullYear()} ZOROLIQ · Calgary, Alberta · Serving Canada</p>
        </div>
      </footer>
    </div>
  );
}
