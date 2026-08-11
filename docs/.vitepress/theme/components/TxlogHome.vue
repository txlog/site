<script setup>
// Landing page for txlog.rda.run — ports the Kumo UI design.
// The navbar and footer come from the VitePress default theme (layout: page).
const osRows = [
  ['Red Hat Enterprise Linux 9.4', '612'],
  ['Rocky Linux 9.3', '341'],
  ['AlmaLinux 9.4', '208'],
  ['Oracle Linux 8.9', '87'],
  ['Undefined OS', '36']
]
const agentRows = [
  ['v1.27.0', '903'],
  ['v1.26.2', '244'],
  ['v1.25.0', '98'],
  ['Undefined Agent Version', '39']
]
const distros = [
  ['brand-almalinux.svg', 'AlmaLinux'],
  ['brand-redhat.svg', 'Red Hat Enterprise Linux'],
  ['brand-rocky.svg', 'Rocky Linux'],
  ['brand-oracle.svg', 'Oracle Linux'],
  ['brand-fedora.svg', 'Fedora'],
  ['brand-centos.svg', 'CentOS']
]
</script>

<template>
  <div class="tx">
    <!-- HERO -->
    <header class="tx-hero">
      <div class="tx-grid-bg" aria-hidden="true"></div>
      <div class="tx-wrap tx-hero-inner">
        <div>
          <span class="tx-eyebrow">Open source · RPM fleets</span>
          <h1 class="tx-h1">Because RPMs have<br />stories to tell</h1>
          <p class="tx-lede">
            Every install, update and removal on every server — collected by the agent,
            compiled in one database, and queryable from a dashboard your team actually reads.
          </p>
          <div class="tx-actions">
            <a class="tx-btn tx-btn-primary" href="/docs">
              Get Started
              <svg width="16" height="16" viewBox="0 0 256 256" aria-hidden="true"><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" /><polyline points="144 56 216 128 144 200" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" /></svg>
            </a>
            <a class="tx-btn tx-btn-ghost" href="https://github.com/txlog">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68Z" /></svg>
              View on GitHub
            </a>
          </div>
          <div class="tx-stats">
            <div>
              <div class="tx-stat-v">RHEL · Alma · Oracle</div>
              <div class="tx-stat-l">Distributions supported</div>
            </div>
            <div>
              <div class="tx-stat-v">OSV + CVE</div>
              <div class="tx-stat-l">Vulnerability matching</div>
            </div>
            <div>
              <div class="tx-stat-v">OIDC · LDAP</div>
              <div class="tx-stat-l">Authentication</div>
            </div>
          </div>
        </div>

        <div class="tx-term">
          <div class="tx-term-bar">
            <span class="tx-dot"></span><span class="tx-dot"></span><span class="tx-dot"></span>
            <span class="tx-term-title">db-prod-07 — dnf history</span>
          </div>
          <pre class="tx-term-body"><span class="tx-c"># Install</span>
<span class="tx-c">$</span> sudo dnf localinstall -y https://rpm.rda.run/repo.rpm
<span class="tx-c">$</span> sudo dnf install -y txlog

<span class="tx-c"># Configure (update server URL)</span>
<span class="tx-c">$</span> sudo nano /etc/txlog.yaml

<span class="tx-c"># Run</span>
<span class="tx-c">$</span> txlog build</pre>
        </div>
      </div>

      <div class="tx-wrap tx-preview-head">
        <h2 class="tx-kicker">The server dashboard</h2>
        <p class="tx-kicker-sub">Fleet-wide totals, OS and agent spread, and anomalies from the last 7 days.</p>
      </div>
    </header>

    <!-- DASHBOARD PREVIEW (always light — the app has no dark mode) -->
    <section class="tx-preview-band">
      <div class="tx-wrap tx-preview-wrap">
        <div class="tx-browser">
          <div class="tx-browser-bar">
            <span class="tx-bdot"></span><span class="tx-bdot"></span><span class="tx-bdot"></span>
            <span class="tx-url">txlog.example.com</span>
          </div>
          <div class="tx-app">
            <div class="tx-app-nav">
              <div class="tx-app-brand">
                <img src="/images/logbook.png" alt="" />
                <span>Txlog Server</span>
              </div>
              <div class="tx-app-links">
                <span class="is-active">Home</span><span>Assets</span><span>Packages</span>
                <span>Topology</span><span>Analytics</span><span>Admin</span>
              </div>
              <span class="tx-chip">Datacenter 001</span>
            </div>

            <div class="tx-app-body">
              <div>
                <h3 class="tx-app-h">Dashboard</h3>
                <p class="tx-app-sub">Global infrastructure overview and real-time statistics</p>
              </div>

              <div class="tx-cards">
                <div class="tx-card">
                  <div class="tx-card-head"><span>Assets</span><em>Total</em></div>
                  <div class="tx-card-v">1,284</div>
                </div>
                <div class="tx-card">
                  <div class="tx-card-head"><span>Executions</span><em>Last 30 days</em></div>
                  <div class="tx-card-v">38,902 <b class="up">12.4%</b></div>
                </div>
                <div class="tx-card">
                  <div class="tx-card-head"><span>Installed</span><em>Last 30 days</em></div>
                  <div class="tx-card-v">6,417 <b class="down">3.1%</b></div>
                </div>
                <div class="tx-card">
                  <div class="tx-card-head"><span>Upgraded</span><em>Last 30 days</em></div>
                  <div class="tx-card-v">21,335 <b class="up">8.7%</b></div>
                </div>
              </div>

              <div class="tx-two">
                <div class="tx-panel">
                  <div class="tx-panel-head"><h4>OS distribution</h4></div>
                  <table class="tx-table">
                    <thead><tr><th>OS name</th><th>Assets</th></tr></thead>
                    <tbody>
                      <tr v-for="row in osRows" :key="row[0]">
                        <td>{{ row[0] }}</td><td class="num">{{ row[1] }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="tx-panel">
                  <div class="tx-panel-head"><h4>Agent distribution</h4></div>
                  <table class="tx-table">
                    <thead><tr><th>Agent version</th><th>Assets</th></tr></thead>
                    <tbody>
                      <tr v-for="row in agentRows" :key="row[0]">
                        <td>{{ row[0] }}</td><td class="num">{{ row[1] }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="tx-panel">
                <div class="tx-panel-head tx-panel-head-row">
                  <h4>Recent Anomalies <span>last 7 days</span></h4>
                  <span class="tx-btn-sm">View All</span>
                </div>
                <div class="tx-anoms">
                  <div><span class="tx-sev high">high</span><span><strong>db-prod-07</strong>: 214 packages in one transaction</span></div>
                  <div><span class="tx-sev med">medium</span><span><strong>web-edge-02</strong>: no executions for 9 days</span></div>
                  <div><span class="tx-sev low">low</span><span><strong>app-stg-11</strong>: kernel updated, restart pending</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DISTRO STRIP -->
    <section class="tx-strip">
      <div class="tx-wrap tx-strip-inner">
        <span class="tx-strip-label">Tracks RPM fleets on</span>
        <img v-for="d in distros" :key="d[0]" :src="`/images/${d[0]}`" :alt="d[1]" />
      </div>
    </section>

    <!-- FEATURES -->
    <section class="tx-wrap tx-features">
      <div class="tx-features-head">
        <span class="tx-overline">What it does</span>
        <h2 class="tx-h2">Four things, done properly</h2>
      </div>
      <div class="tx-feature-grid">
        <article class="tx-feature">
          <img src="/images/transaction-tracking.svg" alt="" />
          <h3>Comprehensive Transaction Tracking</h3>
          <p>Every package transaction is recorded — installations, updates and removals — giving you a complete history of package activity on each system.</p>
          <div class="tx-tags"><span>install</span><span>update</span><span>uninstall</span></div>
        </article>
        <article class="tx-feature">
          <img src="/images/data-compilation.svg" alt="" />
          <h3>Detailed Data Compilation</h3>
          <p>Beyond simple counts: frequency, package names and versions are compiled per asset, so you can answer “what changed, where, and when”.</p>
          <div class="tx-bars">
            <span style="height:38%;background:#c7d0f4"></span>
            <span style="height:62%;background:#aebbf5"></span>
            <span style="height:48%;background:#c7d0f4"></span>
            <span style="height:88%;background:#3b5bdb"></span>
            <span style="height:70%;background:#aebbf5"></span>
            <span style="height:54%;background:#c7d0f4"></span>
          </div>
        </article>
        <article class="tx-feature">
          <img src="/images/server-restart.svg" alt="" />
          <h3>Track server restarts</h3>
          <p>Know which hosts still need a reboot to fully apply critical updates — kernel and core library changes only take effect after a restart.</p>
          <div class="tx-note">
            <svg width="16" height="16" viewBox="0 0 256 256" aria-hidden="true"><path d="M142.41,40.22l87.46,151.87C236,202.79,228.08,216,215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22C119.89,29.26,136.11,29.26,142.41,40.22Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" /><line x1="128" y1="144" x2="128" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" /><circle cx="128" cy="180" r="12" fill="currentColor" /></svg>
            <span>17 assets pending restart</span>
          </div>
        </article>
        <article class="tx-feature">
          <img src="/images/rpm-package.svg" alt="" />
          <h3>RPM System Focus</h3>
          <p>Specialised in RPM-based distributions — AlmaLinux, Fedora, Red Hat Enterprise Linux and friends — so collection stays accurate instead of generic.</p>
          <div class="tx-marks">
            <img src="/images/brand-almalinux.svg" alt="" />
            <img src="/images/brand-fedora.svg" alt="" />
            <img src="/images/brand-redhat.svg" alt="" />
          </div>
        </article>
      </div>
    </section>

    <!-- CTA -->
    <section class="tx-cta">
      <div class="tx-wrap tx-cta-inner">
        <div>
          <h2>Run the agent on one server.<br />See the story in minutes.</h2>
          <p>Container image, Kubernetes manifest and Postgres — nothing else to wire up.</p>
        </div>
        <div class="tx-actions">
          <a class="tx-btn tx-btn-primary" href="/docs">Read the docs</a>
          <a class="tx-btn tx-btn-ghost" href="https://github.com/txlog">github.com/txlog</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tx {
  --brand: #3b5bdb;
  --canvas: #f1f5f9;
  --control: #fff;
  --tint: #f8f9fa;
  --line: #e2e8f0;
  --text: #1e293b;
  --subtle: #64748b;
  --muted: #94a3b8;
  --section: #1e293b;
  --code: #0f172a;

  background: var(--canvas);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.dark .tx {
  --canvas: #0f172a;
  --control: #161f2e;
  --tint: #1c2637;
  --line: #2b3648;
  --text: #e2e8f0;
  --subtle: #94a3b8;
  --muted: #748196;
  --section: #0b1220;
  --code: #0b1220;
}

.tx-wrap { max-width: 80rem; margin: 0 auto; padding: 0 1.5rem; }

/* Hero */
.tx-hero { position: relative; background: var(--section); color: #fff; overflow: hidden; }
.dark .tx-hero { border-bottom: 1px solid var(--line); }
.tx-grid-bg {
  position: absolute; inset: 0;
  background-image: linear-gradient(#ffffff0d 1px, transparent 1px),
    linear-gradient(90deg, #ffffff0d 1px, transparent 1px);
  background-size: 64px 64px;
}
.tx-hero-inner {
  position: relative; padding-top: 5.5rem;
  display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 4rem; align-items: start;
}
.tx-eyebrow {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: rgb(59 91 219 / 0.18); border: 1px solid rgb(59 91 219 / 0.4);
  color: #aebbf5; font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
  text-transform: uppercase; padding: 0.3125rem 0.625rem; border-radius: 0.375rem;
}
.tx-h1 {
  font-size: 58px; line-height: 1.04; letter-spacing: -0.03em; font-weight: 700;
  margin: 1.25rem 0 0; text-wrap: pretty;
}
.tx-lede {
  color: #94a3b8; font-size: 18px; line-height: 1.6; margin: 1.25rem 0 0;
  max-width: 34rem; text-wrap: pretty;
}
.tx-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 2rem; }
.tx-btn {
  display: inline-flex; align-items: center; gap: 0.5rem; font-size: 15px;
  padding: 0.75rem 1.375rem; border-radius: 0.5rem; text-decoration: none;
  transition: background 0.15s ease;
}
.tx-btn-primary { background: var(--brand); color: #fff; font-weight: 600; }
.tx-btn-primary:hover { background: #4a68e0; color: #fff; }
.tx-btn-ghost {
  background: rgb(255 255 255 / 0.06); border: 1px solid rgb(255 255 255 / 0.16);
  color: #e2e8f0; font-weight: 500; padding: 0.75rem 1.25rem;
}
.tx-btn-ghost:hover { background: rgb(255 255 255 / 0.12); color: #fff; }
.tx-stats {
  display: flex; flex-wrap: wrap; gap: 2.5rem; margin-top: 2.75rem;
  padding-top: 1.75rem; border-top: 1px solid rgb(255 255 255 / 0.12);
}
.tx-stat-v { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
.tx-stat-l { color: #94a3b8; font-size: 13px; margin-top: 0.25rem; }

/* Terminal */
.tx-term {
  background: var(--code); border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: 0.75rem; overflow: hidden;
  box-shadow: 0 24px 48px -12px rgb(0 0 0 / 0.5); margin-top: 3.5rem;
}
.tx-term-bar {
  display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.1);
}
.tx-dot { width: 10px; height: 10px; border-radius: 50%; background: #475569; }
.tx-term-title {
  margin-left: 0.5rem; color: #64748b;
  font-family: 'JetBrains Mono', monospace; font-size: 12px;
}
.tx-term-body {
  margin: 0; padding: 1.25rem; background: transparent;
  font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.85;
  color: #cbd5e1; overflow-x: auto;
}
.tx-c { color: #64748b; }

.tx-preview-head { position: relative; padding-top: 4.5rem; }
.tx-kicker {
  font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  color: #aebbf5; margin: 0; border: none;
}
.tx-kicker-sub { color: #94a3b8; font-size: 15px; margin: 0.5rem 0 0; }

/* Dashboard preview — stays light in both themes */
.tx-preview-band {
  background: linear-gradient(var(--section) 0, var(--section) 96px, var(--canvas) 96px, var(--canvas) 100%);
}
.tx-preview-wrap { padding-bottom: 4rem; }
.tx-browser {
  background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 0.75rem;
  overflow: hidden; box-shadow: 0 24px 48px -16px rgb(15 23 42 / 0.35); color: #1e293b;
}
.tx-browser-bar {
  display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 0.875rem;
  background: #e2e8f0; border-bottom: 1px solid #cbd5e1;
}
.tx-bdot { width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; }
.tx-url {
  margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 0.375rem;
  padding: 0.1875rem 0.75rem; color: #64748b; font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
}
.tx-app { background: #fff; }
.tx-app-nav {
  display: flex; align-items: center; gap: 1.25rem; height: 56px; padding: 0 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}
.tx-app-brand { display: flex; align-items: center; gap: 0.625rem; font-weight: 600; font-size: 15px; }
.tx-app-brand img { height: 26px; width: auto; }
.tx-app-links { display: flex; align-items: center; gap: 0.125rem; font-size: 13px; font-weight: 500; color: #64748b; }
.tx-app-links span { padding: 0.375rem 0.625rem; border-radius: 0.5rem; }
.tx-app-links .is-active { background: #f8f9fa; color: #1e293b; }
.tx-chip {
  margin-left: auto; background: #f8f9fa; color: #64748b; border: 1px solid #e2e8f0;
  font-size: 11px; font-weight: 500; padding: 0.1875rem 0.5rem; border-radius: 0.375rem;
}
.tx-app-body {
  background: #f1f5f9; padding: 1.5rem 1.25rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.tx-app-h { font-weight: 700; font-size: 20px; margin: 0; border: none; letter-spacing: -0.01em; }
.tx-app-sub { color: #64748b; font-size: 13px; margin: 0.125rem 0 0; }
.tx-cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
.tx-card, .tx-panel {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.tx-card { padding: 1rem; }
.tx-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.375rem; }
.tx-card-head span {
  font-size: 11px; font-weight: 700; color: #64748b;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.tx-card-head em { font-size: 11px; color: #94a3b8; font-style: normal; }
.tx-card-v { font-weight: 700; font-size: 26px; letter-spacing: -0.02em; }
.tx-card-v b { font-size: 13px; font-weight: 500; }
.tx-card-v b.up { color: #16a34a; }
.tx-card-v b.down { color: #dc2626; }
.tx-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.tx-panel { overflow: hidden; }
.tx-panel-head { border-bottom: 1px solid #e2e8f0; padding: 0.875rem 1.25rem; }
.tx-panel-head-row { display: flex; align-items: center; justify-content: space-between; }
.tx-panel-head h4 { font-weight: 600; font-size: 15px; margin: 0; }
.tx-panel-head h4 span { font-size: 13px; color: #64748b; font-weight: 400; }
.tx-btn-sm {
  font-size: 13px; font-weight: 500; color: #1e293b; background: #fff;
  border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 0.25rem 0.75rem;
}
.tx-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
.tx-table th {
  border-bottom: 1px solid #e2e8f0; padding: 0.5rem 0.75rem; font-weight: 600;
  font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;
  background: #fff;
}
.tx-table td { border-bottom: 1px solid #e2e8f0; padding: 0.625rem 0.75rem; font-weight: 500; }
.tx-table td.num { color: #3b5bdb; }
.tx-table tr:last-child td { border-bottom: 0; }
.tx-anoms { padding: 0.875rem 1.25rem; display: flex; flex-direction: column; gap: 0.625rem; font-size: 13px; }
.tx-anoms > div { display: flex; align-items: center; gap: 0.625rem; }
.tx-anoms strong { font-weight: 500; }
.tx-sev { font-size: 11px; font-weight: 700; padding: 0.125rem 0.5rem; border-radius: 0.375rem; }
.tx-sev.high { background: rgb(220 38 38 / 0.1); border: 1px solid rgb(220 38 38 / 0.2); color: #dc2626; }
.tx-sev.med { background: rgb(217 119 6 / 0.1); border: 1px solid rgb(217 119 6 / 0.2); color: #d97706; }
.tx-sev.low { background: rgb(59 91 219 / 0.1); border: 1px solid rgb(59 91 219 / 0.2); color: #3b5bdb; }

/* Distro strip */
.tx-strip { background: var(--control); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.tx-strip-inner {
  padding-top: 1.75rem; padding-bottom: 1.75rem;
  display: flex; align-items: center; justify-content: center;
  flex-wrap: wrap; gap: 2.5rem;
}
.tx-strip-label {
  font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--muted);
}
.tx-strip-inner img { height: 28px; opacity: 0.75; }
.dark .tx-strip-inner img { filter: grayscale(1) brightness(0) invert(1); opacity: 0.65; }

/* Features */
.tx-features { padding-top: 5rem; padding-bottom: 5rem; }
.tx-features-head { max-width: 36rem; }
.tx-overline {
  font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--brand);
}
.dark .tx-overline { color: #8ba1f2; }
.tx-h2 {
  font-size: 36px; line-height: 1.15; letter-spacing: -0.025em; font-weight: 700;
  margin: 0.75rem 0 0; border: none; text-wrap: pretty;
}
.tx-feature-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem; margin-top: 2.5rem;
}
.tx-feature {
  background: var(--control); border: 1px solid var(--line); border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); padding: 1.75rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.tx-feature > img { height: 72px; width: 72px; object-fit: contain; align-self: flex-start; }
.tx-feature h3 { font-size: 20px; font-weight: 600; letter-spacing: -0.01em; margin: 0; }
.tx-feature p { color: var(--subtle); font-size: 15px; line-height: 1.65; margin: 0; text-wrap: pretty; }
.tx-tags { margin-top: auto; display: flex; gap: 0.5rem; flex-wrap: wrap; }
.tx-tags span {
  background: var(--tint); border: 1px solid var(--line); color: var(--subtle);
  font-family: 'JetBrains Mono', monospace; font-size: 12px;
  padding: 0.1875rem 0.5rem; border-radius: 0.375rem;
}
.tx-bars { margin-top: auto; display: flex; align-items: flex-end; gap: 0.375rem; height: 44px; }
.tx-bars span { width: 14px; border-radius: 0.1875rem; }
.tx-note {
  margin-top: auto; display: flex; align-items: center; gap: 0.5rem;
  background: rgb(217 119 6 / 0.08); border: 1px solid rgb(217 119 6 / 0.2);
  border-radius: 0.5rem; padding: 0.5rem 0.75rem;
  font-size: 13px; font-weight: 500; color: var(--text);
}
.tx-note svg { color: #d97706; flex: none; }
.tx-marks { margin-top: auto; display: flex; align-items: center; gap: 1rem; }
.tx-marks img { height: 24px; opacity: 0.7; }
.dark .tx-marks img { filter: grayscale(1) brightness(0) invert(1); }

/* CTA */
.tx-cta { background: var(--section); color: #fff; }
.dark .tx-cta { border-top: 1px solid var(--line); }
.tx-cta-inner {
  padding-top: 4rem; padding-bottom: 4rem;
  display: flex; align-items: center; justify-content: space-between;
  gap: 3rem; flex-wrap: wrap;
}
.tx-cta h2 {
  font-size: 30px; line-height: 1.2; letter-spacing: -0.02em; font-weight: 700;
  margin: 0; border: none; text-wrap: pretty;
}
.tx-cta p { color: #94a3b8; font-size: 16px; margin: 0.75rem 0 0; }
.tx-cta .tx-actions { margin-top: 0; }

@media (max-width: 960px) {
  .tx-hero-inner { grid-template-columns: 1fr; gap: 2.5rem; }
  .tx-term { margin-top: 0; }
  .tx-h1 { font-size: 42px; }
  .tx-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tx-two, .tx-feature-grid { grid-template-columns: 1fr; }
}
</style>
