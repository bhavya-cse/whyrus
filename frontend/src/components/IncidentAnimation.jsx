import './IncidentAnimation.css'

const events = [
  { time: '09:41:02', label: 'Request received', type: 'normal' },
  { time: '09:41:04', label: 'Database latency rising', type: 'warning' },
  { time: '09:41:07', label: 'Connection pool exhausted', type: 'error' },
]

export default function IncidentAnimation() {
  return (
    <div
      className="whyrus-visual"
      role="img"
      aria-label="Incident analysis showing gateway and database signals flowing into an event timeline and root-cause hypothesis"
    >
      <div className="visual-glow" />

      <div className="visual-label label-top">
        <span className="live-indicator" />
        LIVE INCIDENT TRACE
      </div>

      {/* Lines are behind the cards, so they cannot cover the text. */}
      <svg
        className="visual-connections"
        viewBox="0 0 620 560"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="connection-line gateway-line"
          d="M115 125 C115 158 205 155 225 190"
        />
        <path
          className="connection-line database-line"
          d="M505 125 C505 158 415 155 395 190"
        />
        <path
          className="connection-line status-line"
          d="M310 430 C310 452 155 447 155 470"
        />
        <path
          className="connection-line status-line"
          d="M310 430 C310 452 465 447 465 470"
        />
        <path
          className="connection-line status-line"
          d="M310 430 L310 510"
        />

        <circle r="4" className="flow-dot gateway-flow">
          <animateMotion
            dur="2.8s"
            repeatCount="indefinite"
            path="M115 125 C115 158 205 155 225 190"
          />
        </circle>

        <circle r="4" className="flow-dot database-flow">
          <animateMotion
            dur="3.2s"
            repeatCount="indefinite"
            path="M505 125 C505 158 415 155 395 190"
          />
        </circle>

        <circle r="3.5" className="flow-dot status-flow">
          <animateMotion
            dur="2.5s"
            repeatCount="indefinite"
            path="M310 430 L310 510"
          />
        </circle>
      </svg>

      <div className="service-node node-left">
        <div className="node-icon">API</div>
        <span>Gateway</span>
        <small>Operational</small>
      </div>

      <div className="service-node node-right">
        <div className="node-icon database-icon">DB</div>
        <span>Database</span>
        <small className="warning-text">High latency</small>
      </div>

      <div className="diagnostic-card">
        <div className="diagnostic-header">
          <span className="diagnostic-icon">⌘</span>
          <div>
            <strong>Incident analysis</strong>
            <small>Evidence correlation</small>
          </div>
          <span className="analysis-status">ACTIVE</span>
        </div>

        <div className="diagnostic-divider" />

        <div className="timeline-heading">
          <span>EVENT TIMELINE</span>
          <span>3 events</span>
        </div>

        <div className="event-list">
          {events.map((event) => (
            <div className="event-row" key={event.time}>
              <span className={`event-marker ${event.type}`} />
              <span className="event-time">{event.time}</span>
              <span className="event-label">{event.label}</span>
            </div>
          ))}
        </div>

        <div className="diagnostic-divider" />

        <div className="root-cause">
          <div className="root-cause-symbol">↗</div>
          <div className="root-cause-copy">
            <span>LEADING HYPOTHESIS</span>
            <strong>Database connection pressure</strong>
            <small>Verify against connection pool metrics</small>
          </div>
          <div className="confidence-ring">
            <svg viewBox="0 0 42 42" aria-hidden="true">
              <circle className="ring-track" cx="21" cy="21" r="16" />
              <circle className="ring-progress" cx="21" cy="21" r="16" />
            </svg>
            <span>!</span>
          </div>
        </div>

        <div className="evidence-footer">
          <span className="evidence-dot" />
          Evidence first
          <span className="footer-separator">·</span>
          Verify before concluding
        </div>
      </div>

      <div className="floating-chip chip-left">
        <span className="chip-dot purple-dot" />
        Log correlation
      </div>

      <div className="floating-chip chip-right">
        <span className="chip-check">✓</span>
        Timeline aligned
      </div>

      <div className="floating-chip chip-bottom">
        <span className="chip-dot green-dot" />
        Hypothesis ranked
      </div>
    </div>
  )
}