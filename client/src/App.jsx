import { useMemo, useState } from "react";
import { certifications, problemSolving, profile, projects, skills, socialLinks } from "./data/site";

const navItems = [
  ["Work", "work"],
  ["Skills", "skills"],
  ["Problem Solving", "problem-solving"],
  ["About", "about"],
  ["Contact", "contact"]
];

function ExternalIcon() {
  return <span aria-hidden="true">↗</span>;
}

function Header({ open, setOpen }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="Go to home">
          <span className="brand-mark">A</span>
          <span>Afshin Abdul Kader</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <a className="header-contact" href="#contact">Get in touch <ExternalIcon /></a>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(v => !v)}>
          <span /><span /><span /><span className="sr-only">Toggle navigation</span>
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
          <a href="#contact" onClick={() => setOpen(false)}>Get in touch ↗</a>
        </nav>
      )}
    </header>
  );
}

function Section({ id, index, eyebrow, title, intro, children }) {
  return (
    <section id={id} className="section container">
      <div className="section-heading">
        <span className="section-index">{index}</span>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {intro && <p className="section-intro">{intro}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function ProjectCard({ project, featured }) {
  const hasPrimary = Boolean(project.actionUrl);
  const hasSecondary = Boolean(project.secondaryUrl);
  return (
    <article className={`project-card ${featured ? "featured" : ""}`}>
      <div className="project-media">
        <div className="media-top">
          <span>{project.id.toUpperCase()}</span>
          <span className={`project-status ${project.status === "Live" ? "live" : ""}`}>
            <i /> {project.status}
          </span>
        </div>
        <div className={`project-glyph glyph-${project.id}`} aria-hidden="true">
          <span>{project.id === "smart-ledger" ? "₹" : project.id === "roadguard-ai" ? "RG" : "MG"}</span>
          <b /><b /><b />
        </div>
        <div className="media-corner">01 / 03</div>
      </div>
      <div className="project-body">
        <div className="project-title-row">
          <div>
            <p className="eyebrow">{project.eyebrow}</p>
            <h3>{project.title}</h3>
          </div>
        </div>
        <p className="project-description">{project.description}</p>
        <div className="project-details">{project.details}</div>
        <div className="tags">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
        <div className="project-actions">
          {hasPrimary ? (
            <a className="button button-primary" href={project.actionUrl} target="_blank" rel="noreferrer">{project.actionLabel} <ExternalIcon /></a>
          ) : (
            <span className="button button-primary button-disabled">{project.actionLabel} <ExternalIcon /></span>
          )}
          {hasSecondary ? (
            <a className="button button-secondary" href={project.secondaryUrl} target="_blank" rel="noreferrer">{project.secondaryLabel}</a>
          ) : (
            <span className="button button-secondary button-disabled">{project.secondaryLabel}</span>
          )}
        </div>
      </div>
    </article>
  );
}

function ContactForm() {
  const apiBase = import.meta.env.VITE_API_URL || "/api";
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState({ type: "idle", text: "" });
  const canSubmit = useMemo(() => Boolean(form.name.trim() && form.email.trim() && form.message.trim()), [form]);

  function updateField(e) { setForm(v => ({ ...v, [e.target.name]: e.target.value })); }

  async function submit(e) {
    e.preventDefault();
    if (!canSubmit) return setState({ type: "error", text: "Please complete all fields." });
    setState({ type: "loading", text: "Sending…" });
    try {
      const res = await fetch(`${apiBase}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to send message.");
      setForm({ name: "", email: "", message: "" });
      setState({ type: "success", text: "Message sent successfully." });
    } catch (error) {
      setState({ type: "error", text: error.message || "Contact service unavailable. Please try again later." });
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label><span>Name</span><input name="name" value={form.name} onChange={updateField} maxLength="80" autoComplete="name" required placeholder="Your name" /></label>
        <label><span>Email</span><input name="email" type="email" value={form.email} onChange={updateField} maxLength="160" autoComplete="email" required placeholder="you@example.com" /></label>
      </div>
      <label><span>Message</span><textarea name="message" value={form.message} onChange={updateField} maxLength="2000" rows="6" required placeholder="Tell me what you'd like to build." /></label>
      <div className="form-footer">
        <button className="button button-primary" type="submit" disabled={!canSubmit || state.type === "loading"}>{state.type === "loading" ? "Sending…" : "Send message"} <ExternalIcon /></button>
        <p className={`form-status ${state.type}`} role="status">{state.text}</p>
      </div>
    </form>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div id="top" className="app">
      <Header open={menuOpen} setOpen={setMenuOpen} />
      <main id="main">
        <section className="hero container">
          <div className="hero-copy">
            <div className="availability"><span /> Open to internships & meaningful projects</div>
            <p className="eyebrow hero-kicker">{profile.role}</p>
            <h1>Building useful software <span>with a systems mindset.</span></h1>
            <p className="hero-lead">
              I’m {profile.name}, a computer science student focused on AI/ML, software development,
              and turning ideas into working products.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Explore my work ↓</a>
              <a className="button button-secondary" href="#contact">Let's connect <ExternalIcon /></a>
            </div>
            <div className="hero-socials" aria-label="Professional profiles">
              {socialLinks.slice(0, 3).map(link => <a key={link.label} href={link.url} target="_blank" rel="noreferrer"><strong>{link.icon}</strong>{link.label}</a>)}
            </div>
            <div className="hero-meta"><span>{profile.location}</span><span>{profile.college}</span><span>B.E. CSE · AI & ML</span></div>
          </div>

          <div className="hero-visual" aria-label="Abstract engineering system visualization">
            <div className="system-label">ENGINEERING / 01</div>
            <div className="system-readout"><span>BUILD</span><span>ITERATE</span></div>
            <div className="system-node node-a">IDEA</div>
            <div className="system-node node-b">CODE</div>
            <div className="system-node node-c">DEBUG</div>
            <div className="system-node node-d">SHIP</div>
            <div className="system-line line-1" /><div className="system-line line-2" /><div className="system-line line-3" /><div className="system-line line-4" />
            <div className="system-core">A<span>+</span></div>
            <div className="system-footer"><span>STATUS</span><b>BUILDING</b><span>v1.0</span></div>
          </div>
        </section>

        <Section id="work" index="01" eyebrow="SELECTED WORK" title="Things I build." intro="Real projects that show how I approach software, AI experiments and interactive systems.">
          <div className="project-intro-line"><span>03 PROJECTS</span><span>01 — 03</span></div>
          <div className="projects">{projects.map((p, i) => <ProjectCard key={p.id} project={p} featured={i === 0} />)}</div>
        </Section>

        <Section id="skills" index="02" eyebrow="TECHNICAL STACK" title="Tools I work with." intro="A practical stack shaped by implementation, projects and continuous learning.">
          <div className="skill-grid">{skills.map(([title, value]) => <div className="skill-card" key={title}><span className="skill-number">{String(skills.findIndex(s => s[0] === title) + 1).padStart(2, "0")}</span><p className="eyebrow">{title}</p><p>{value}</p></div>)}</div>
        </Section>

        <Section id="problem-solving" index="03" eyebrow="PROBLEM SOLVING" title="Consistency compounds." intro="A current snapshot of my DSA and LeetCode practice.">
          <div className="stats">
            <div><strong>{problemSolving.accepted}</strong><span>accepted problems</span></div>
            <div><strong>{problemSolving.streak}</strong><span>day accepted streak</span></div>
            <div><strong>{problemSolving.studyDays}</strong><span>DSA study days</span></div>
          </div>
          <div className="leetcode-cta">
            <div><span className="mini-mark">LC</span><div><strong>See the problem-solving work</strong><p>Explore my LeetCode profile and the problems behind these numbers.</p></div></div>
            <a className="button button-secondary" href={profile.leetcode} target="_blank" rel="noreferrer">Open LeetCode <ExternalIcon /></a>
          </div>
        </Section>

        <Section id="about" index="04" eyebrow="ABOUT" title="Still learning. Still building." intro="A short introduction focused on how I work and learn.">
          <div className="about-grid">
            <div className="about-copy">
              <p>I’m a Computer Science and Engineering student specializing in Artificial Intelligence & Machine Learning at SRM Easwari Engineering College.</p>
              <p>I learn by implementing ideas, debugging real problems, and using each project to understand the systems behind the code.</p>
              <div className="philosophy"><span>WORKING PRINCIPLE</span><strong>Learn → Build → Break → Debug → Improve</strong></div>
            </div>
            <div className="education-card"><p className="eyebrow">EDUCATION</p><h3>{profile.education}</h3><p>{profile.college} · Chennai</p></div>
          </div>
        </Section>

        <Section id="certifications" index="05" eyebrow="CREDENTIALS" title="Learning with evidence." intro="Selected credentials completed during my current learning journey.">
          <div className="cert-grid">{certifications.map(cert => <article className="cert-card" key={cert.title}><span className="cert-icon">✓</span><div><p className="eyebrow">{cert.issuer}</p><h3>{cert.title}</h3><p>Issued {cert.issued}</p></div></article>)}</div>
        </Section>

        <Section id="contact" index="06" eyebrow="CONTACT" title="Let's build something." intro="Reach me directly or send a message through the full-stack contact form.">
          <div className="contact-layout">
            <div className="contact-side">
              <div><p className="eyebrow">OPEN TO</p><h3>Internships, projects and engineering conversations.</h3><p>I’m interested in opportunities where I can build, learn and contribute to real software systems.</p></div>
              <div className="direct-contact">
                <a href={`mailto:${profile.email}`}><span>Email</span><strong>{profile.email}</strong><ExternalIcon /></a>
                <a href={`tel:+91${profile.phone}`}><span>Phone</span><strong>+91 {profile.phone}</strong><ExternalIcon /></a>
              </div>
              <div className="social-list">{socialLinks.map(link => <a key={link.label} href={link.url} target="_blank" rel="noreferrer"><strong>{link.icon}</strong><span><b>{link.label}</b><small>{link.value}</small></span><ExternalIcon /></a>)}</div>
            </div>
            <ContactForm />
          </div>
        </Section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div><span className="brand-mark small">A</span><span>© 2026 {profile.name}</span></div>
          <span>React · Express · PostgreSQL</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
