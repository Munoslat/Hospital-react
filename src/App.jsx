import { useState, useEffect, useRef } from 'react'
import './App.css'

// ===== DATA =====
const PATIENTS = [
  { av:'AH', color:'#1d6feb', name:'Ahmed Hassan',   age:34, cond:'Malaria',   doc:'Dr. Nuur',   status:'Admitted',   sc:'sp-orange' },
  { av:'FM', color:'#0891b2', name:'Fatima Mohamed', age:28, cond:'Fracture',  doc:'Dr. Muno',   status:'In Surgery', sc:'sp-blue'   },
  { av:'ZA', color:'#0d9488', name:'Zahra Ali',      age:52, cond:'Diabetes',  doc:'Dr. Ayan',   status:'Stable',     sc:'sp-green'  },
  { av:'OI', color:'#dc2626', name:'Omar Ibrahim',   age:67, cond:'Cardiac',   doc:'Dr. Hassan', status:'Critical',   sc:'sp-red'    },
  { av:'HM', color:'#7c3aed', name:'Hodan Muuse',    age:22, cond:'Checkup',   doc:'Dr. Muno',   status:'Discharged', sc:'sp-green'  },
]

const APPOINTMENTS = [
  { time:'08:30', period:'AM', color:'#1d6feb', patient:'Ahmed Hassan',   reason:'Follow-up: Malaria',      doc:'Dr. Nuur',   room:'Room 102' },
  { time:'09:15', period:'AM', color:'#dc2626', patient:'Omar Ibrahim',   reason:'🚨 Cardiac Emergency',    doc:'Dr. Hassan', room:'ICU'      },
  { time:'10:00', period:'AM', color:'#0d9488', patient:'Zahra Ali',      reason:'Diabetes Checkup',        doc:'Dr. Ayan',   room:'Room 205' },
  { time:'11:30', period:'AM', color:'#7c3aed', patient:'New Patient',    reason:'General Consultation',    doc:'Dr. Muno',   room:'Room 110' },
  { time:'14:00', period:'PM', color:'#ea580c', patient:'Fatima Mohamed', reason:'Post-Surgery Review',     doc:'Dr. Muno',   room:'Ward B'   },
]

const WARDS = [
  { icon:'🏥', num:'24/28', label:'General Ward', fill:86,  color:'#60a5fa', capClass:'ward-cap-mid', cap:'86% full'          },
  { icon:'🚨', num:'8/8',   label:'ICU',          fill:100, color:'#f87171', capClass:'ward-cap-full', cap:'100% full — No beds', numColor:'#f87171' },
  { icon:'👶', num:'12/20', label:'Maternity',    fill:60,  color:'#34d399', capClass:'ward-cap-ok',  cap:'60% full — 8 beds free', numColor:'#34d399' },
  { icon:'🧒', num:'6/10',  label:'Pediatric',    fill:60,  color:'#c084fc', capClass:'ward-cap-ok',  cap:'60% full — 4 beds free', numColor:'#c084fc' },
]

const DOCTORS = [
  { av:'M',  color:'#1d6feb', name:'Dr. Muno',     spec:'Chief Medical Officer', statusLabel:'● On Duty',    statusCls:'ds-on',   patients:142, exp:'8yr'  },
  { av:'AN', color:'#0891b2', name:'Dr. Ayan Nuur', spec:'Internist',             statusLabel:'● In Surgery', statusCls:'ds-busy', patients:98,  exp:'5yr'  },
  { av:'HH', color:'#dc2626', name:'Dr. Hassan',    spec:'Cardiologist',          statusLabel:'● On Duty',    statusCls:'ds-on',   patients:210, exp:'12yr' },
  { av:'ZM', color:'#7c3aed', name:'Dr. Zahra',     spec:'Pediatrician',          statusLabel:'● Off Duty',   statusCls:'ds-off',  patients:87,  exp:'6yr'  },
  { av:'OA', color:'#0d9488', name:'Dr. Omar Ali',  spec:'Surgeon',               statusLabel:'● In Theater', statusCls:'ds-busy', surgeries:315,exp:'15yr' },
  { av:'RF', color:'#ea580c', name:'Dr. Roda Farah',spec:'Radiologist',           statusLabel:'● On Duty',    statusCls:'ds-on',   scans:64,     exp:'7yr'  },
]

const MEDS = [
  { ico:'💊', bg:'var(--blue-l)',   name:'Amoxicillin 500mg',  cat:'Antibiotic', stock:'240 units', low:false },
  { ico:'🟢', bg:'var(--green-l)',  name:'Paracetamol 1g',     cat:'Painkiller', stock:'580 units', low:false },
  { ico:'⚠️', bg:'var(--red-l)',    name:'Insulin Glargine',   cat:'Diabetes',   stock:'⚠️ 12 units',low:true  },
  { ico:'⚠️', bg:'var(--red-l)',    name:'IV Saline 0.9%',     cat:'Infusion',   stock:'⚠️ 8 bags',  low:true  },
  { ico:'💉', bg:'var(--purple-l)', name:'Morphine 10mg',      cat:'Pain Relief',stock:'46 vials',  low:false },
]

const ALERTS = [
  { color:'var(--red)',    msg:'Insulin Glargine critically low (12 units). Reorder immediately.', time:'Today, 8:00 AM'  },
  { color:'var(--red)',    msg:'IV Saline 0.9% running out (8 bags remaining).',                   time:'Today, 9:30 AM'  },
  { color:'var(--orange)', msg:'Morphine 10mg below minimum threshold (46 vials).',               time:'Yesterday'        },
  { color:'var(--green)',  msg:'Amoxicillin 500mg restocked successfully.',                        time:'2 days ago'       },
]

const BILLS = [
  { av:'AH', color:'#1d6feb', name:'Ahmed Hassan',   type:'Malaria Treatment + Admission', amount:'$1,240', statusLabel:'Pending',  statusCls:'bs-pend' },
  { av:'ZA', color:'#0d9488', name:'Zahra Ali',      type:'Diabetes Management',           amount:'$620',   statusLabel:'Paid',     statusCls:'bs-paid' },
  { av:'OI', color:'#dc2626', name:'Omar Ibrahim',   type:'ICU — Cardiac Care',            amount:'$8,500', statusLabel:'Overdue',  statusCls:'bs-over' },
  { av:'HM', color:'#7c3aed', name:'Hodan Muuse',    type:'General Checkup',               amount:'$180',   statusLabel:'Paid',     statusCls:'bs-paid' },
  { av:'FM', color:'#0891b2', name:'Fatima Mohamed', type:'Fracture Surgery',              amount:'$3,800', statusLabel:'Pending',  statusCls:'bs-pend' },
]

const REVENUE = [
  { label:'Inpatient',  val:'$42,500', fill:75,  color:'var(--blue)'   },
  { label:'Surgery',    val:'$31,200', fill:55,  color:'var(--purple)' },
  { label:'Outpatient', val:'$18,400', fill:40,  color:'var(--teal)'   },
  { label:'Pharmacy',   val:'$9,800',  fill:30,  color:'var(--green)'  },
  { label:'Lab Tests',  val:'$6,100',  fill:20,  color:'var(--orange)' },
]

const REPORTS_LIST = [
  { icon:'📊', title:'Patient Statistics',  desc:'Monthly admissions, discharges, readmissions, and patient demographics breakdown.'        },
  { icon:'💵', title:'Financial Report',    desc:'Revenue analysis, billing status, outstanding payments, and department-wise income.'      },
  { icon:'🛏️', title:'Bed Utilization',     desc:'Ward-by-ward occupancy rates, average stay duration, and capacity planning insights.'    },
  { icon:'👨‍⚕️',title:'Staff Performance',  desc:'Doctor workload, patient outcomes per physician, duty hours, and shift compliance.'      },
  { icon:'💊', title:'Pharmacy Usage',      desc:'Medication consumption rates, wastage analysis, supplier performance, and reorder alerts.'},
  { icon:'🚨', title:'Emergency Report',    desc:'Response times, case outcomes, ER throughput, and critical incident documentation.'       },
]

// ===== FADE-UP HOOK =====
function useFadeUp() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)' } },
      { threshold: 0.1 }
    )
    el.style.opacity = '0'
    el.style.transform = 'translateY(30px)'
    el.style.transition = 'opacity .6s ease, transform .6s ease'
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

// ===== SCROLL =====
function scrollTo(id) {
  const el = document.querySelector(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ===== NAVBAR =====
function Navbar({ onNewPatient }) {
  const [active, setActive] = useState('Dashboard')
  useEffect(() => {
    const ids = ['hero','dashboard','patients','wards','doctors','emergency','pharmacy','billing','reports']
    const map  = { hero:'', dashboard:'Dashboard', patients:'Patients', wards:'Wards', doctors:'Doctors', emergency:'', pharmacy:'Pharmacy', billing:'Billing', reports:'Reports' }
    const handler = () => {
      const y = window.scrollY + 80
      ids.forEach(id => {
        const el = document.getElementById(id)
        if (!el) return
        if (el.offsetTop <= y && el.offsetTop + el.offsetHeight > y && map[id]) setActive(map[id])
      })
    }
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = ['Dashboard','Patients','Wards','Doctors','Pharmacy','Billing','Reports']
  const anchors = { Dashboard:'#dashboard', Patients:'#patients', Wards:'#wards', Doctors:'#doctors', Pharmacy:'#pharmacy', Billing:'#billing', Reports:'#reports' }

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => scrollTo('#hero')}>
        <div className="nav-logo">🏥</div>
        <div className="nav-title">Medi<span>Care</span> Pro</div>
      </div>
      <ul className="nav-links">
        {links.map(l => (
          <li key={l}>
            <a className={active === l ? 'active' : ''} onClick={() => { setActive(l); scrollTo(anchors[l]) }}>{l}</a>
          </li>
        ))}
      </ul>
      <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
        <button className="nav-emergency" onClick={() => scrollTo('#emergency')}>🚨 2 Emergency</button>
        <button className="nav-cta" onClick={onNewPatient}>+ New Patient</button>
      </div>
    </nav>
  )
}

// ===== HERO =====
function Hero({ onNewPatient }) {
  const ref = useFadeUp()
  return (
    <section className="hero" id="hero">
      <div className="hero-grid" ref={ref}>
        <div>
          <div className="hero-badge"><span className="hero-badge-dot"></span>Hospital Management System</div>
          <h1>Smarter<br />Hospital<br /><em>Management</em></h1>
          <p className="hero-sub">A complete platform to manage patients, doctors, wards, pharmacy, billing, and real-time operations — all in one place.</p>
          <div className="hero-btns">
            <button className="btn-hero-p" onClick={() => scrollTo('#dashboard')}>View Dashboard →</button>
            <button className="btn-hero-o" onClick={() => scrollTo('#reports')}>View Reports</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hs-val">342</div><div className="hs-label">Total Patients</div></div>
            <div className="hero-stat"><div className="hs-val">24/7</div><div className="hs-label">Emergency Care</div></div>
            <div className="hero-stat"><div className="hs-val">98%</div><div className="hs-label">Satisfaction Rate</div></div>
          </div>
        </div>
        <div className="hero-dashboard">
          <div className="hero-dashboard-card">
            <div className="hc-title">📊 Live Overview — Morning Shift</div>
            <div className="hc-stats">
              {[['🧑‍⚕️','342','Total Patients'],['🛏️','88%','Bed Occupancy'],['👨‍⚕️','24','Doctors On Shift'],['🚨','2','Emergencies']].map(([ico,val,lbl],i) => (
                <div className="hc-stat" key={i}><div className="hcs-ico">{ico}</div><div className="hcs-val" style={i===3?{color:'#f87171'}:{}}>{val}</div><div className="hcs-lbl">{lbl}</div></div>
              ))}
            </div>
            <div className="hc-patients">
              {[{av:'AH',color:'#1d6feb',name:'Ahmed Hassan',cond:'Malaria · Dr. Nuur',s:'rgba(234,88,12,.2)',sc:'#fb923c',sl:'Admitted'},
                {av:'OI',color:'#dc2626',name:'Omar Ibrahim',cond:'Cardiac · Dr. Hassan',s:'rgba(220,38,38,.25)',sc:'#f87171',sl:'Critical'},
                {av:'ZA',color:'#0d9488',name:'Zahra Ali',cond:'Diabetes · Dr. Ayan',s:'rgba(13,148,136,.2)',sc:'#34d399',sl:'Stable'}
              ].map((p,i)=>(
                <div className="hcp-item" key={i}>
                  <div className="hcp-av" style={{background:p.color}}>{p.av}</div>
                  <div><div className="hcp-name">{p.name}</div><div className="hcp-cond">{p.cond}</div></div>
                  <span className="hcp-status" style={{background:p.s,color:p.sc}}>{p.sl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ===== STATS =====
function StatsSection() {
  const ref = useFadeUp()
  const items = [
    { ico:'🧑‍⚕️', bg:'var(--blue-l)',   val:'342', lbl:'Total Patients',   badge:'+14 today', bc:'badge-up',   fill:68,  color:'var(--blue)'  },
    { ico:'🛏️',  bg:'var(--teal-l)',   val:'88%', lbl:'Bed Occupancy',    badge:'12 empty',  bc:'badge-warn',  fill:88,  color:'var(--teal)'  },
    { ico:'👨‍⚕️', bg:'var(--green-l)',  val:'24',  lbl:'Doctors On Shift', badge:'On duty',   bc:'badge-up',   fill:80,  color:'var(--green)' },
    { ico:'🚨',  bg:'var(--red-l)',    val:'2',   lbl:'Emergency Cases',  badge:'Urgent',    bc:'badge-down',  fill:20,  color:'var(--red)'   },
  ]
  return (
    <div className="section-white" id="dashboard">
      <div className="section-inner">
        <div className="stats-grid" ref={ref}>
          {items.map((s,i) => (
            <div className="stat-card" key={i}>
              <div className="sc-top">
                <div className="sc-ico" style={{background:s.bg}}>{s.ico}</div>
                <span className={`sc-badge ${s.bc}`}>{s.badge}</span>
              </div>
              <div className="sc-val" style={{color:s.color}}>{s.val}</div>
              <div className="sc-lbl">{s.lbl}</div>
              <div className="sc-bar"><div className="sc-fill" style={{width:`${s.fill}%`,background:s.color}}></div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===== PATIENTS =====
function PatientsSection() {
  const ref1 = useFadeUp(), ref2 = useFadeUp()
  return (
    <section className="section" id="patients">
      <div className="sec-header" ref={ref1}>
        <div className="sec-tag">🧑‍⚕️ Patients</div>
        <h2 className="sec-h">Patients & Appointments</h2>
        <p className="sec-sub">Real-time overview of admitted patients and today's scheduled appointments.</p>
      </div>
      <div className="dash-grid" ref={ref2}>
        <div className="dash-card">
          <div className="dash-head"><h3>Recent Patients</h3><button className="dash-link">View all →</button></div>
          <table className="ptable">
            <thead><tr><th>Patient</th><th>Age</th><th>Condition</th><th>Doctor</th><th>Status</th></tr></thead>
            <tbody>
              {PATIENTS.map((p,i) => (
                <tr key={i}>
                  <td><div className="p-cell"><div className="p-av" style={{background:p.color}}>{p.av}</div><span className="p-name">{p.name}</span></div></td>
                  <td>{p.age}</td><td>{p.cond}</td><td>{p.doc}</td>
                  <td><span className={`sp ${p.sc}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dash-card">
          <div className="dash-head"><h3>Today's Appointments</h3><span className="emerg-badge">🚨 2 Emergency</span></div>
          <div className="apt-list">
            {APPOINTMENTS.map((a,i) => (
              <div className="apt-item" key={i}>
                <div className="apt-time"><strong>{a.time}</strong>{a.period}</div>
                <div className="apt-line" style={{background:a.color}}></div>
                <div className="apt-info"><div className="apt-pat">{a.patient}</div><div className="apt-why">{a.reason}</div></div>
                <div className="apt-doc"><strong>{a.doc}</strong>{a.room}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ===== WARDS =====
function WardsSection() {
  const ref1 = useFadeUp(), ref2 = useFadeUp()
  return (
    <div className="wards-section" id="wards">
      <div className="wards-inner">
        <div className="sec-header" ref={ref1}>
          <div className="wards-sec-tag">🛏️ Wards & Beds</div>
          <h2 className="wards-sec-h">Ward Status</h2>
          <p className="wards-sec-sub">Real-time bed occupancy across all hospital wards and units.</p>
        </div>
        <div className="wards-grid" ref={ref2}>
          {WARDS.map((w,i) => (
            <div className="ward-card" key={i}>
              <div className="ward-icon">{w.icon}</div>
              <div className="ward-num" style={w.numColor?{color:w.numColor}:{}}>{w.num}</div>
              <div className="ward-lbl">{w.label}</div>
              <div className="ward-bar-bg"><div className="ward-bar-fill" style={{width:`${w.fill}%`,background:w.color}}></div></div>
              <div className={`ward-cap ${w.capClass}`}>{w.cap}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===== DOCTORS =====
function DoctorsSection() {
  const ref1 = useFadeUp(), ref2 = useFadeUp()
  return (
    <section className="section" id="doctors">
      <div className="sec-header" ref={ref1}>
        <div className="sec-tag">👨‍⚕️ Medical Staff</div>
        <h2 className="sec-h">Doctors On Duty</h2>
        <p className="sec-sub">Current shift status and specialties of our medical team.</p>
      </div>
      <div className="doctors-grid" ref={ref2}>
        {DOCTORS.map((d,i) => (
          <div className="doc-card" key={i}>
            <div className="doc-av-big" style={{background:d.color}}>{d.av}</div>
            <div className="doc-name">{d.name}</div>
            <div className="doc-spec">{d.spec}</div>
            <span className={`doc-status ${d.statusCls}`}>{d.statusLabel}</span>
            <div className="doc-info">
              <div className="di-item"><div className="di-val">{d.patients||d.surgeries||d.scans}</div><div className="di-lbl">{d.patients?'Patients':d.surgeries?'Surgeries':'Scans'}</div></div>
              <div className="di-item"><div className="di-val">{d.exp}</div><div className="di-lbl">Experience</div></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ===== EMERGENCY =====
function EmergencySection() {
  const ref1 = useFadeUp(), ref2 = useFadeUp()
  return (
    <div className="emergency-section" id="emergency">
      <div className="emergency-inner">
        <div className="sec-header" ref={ref1}>
          <div className="emerg-tag">🚨 Emergency Unit</div>
          <h2 className="emerg-sec-h">Active Emergency Cases</h2>
          <p className="emerg-sec-sub">Immediate attention required for the following critical patients.</p>
        </div>
        <div className="emerg-grid" ref={ref2}>
          <div className="emerg-card">
            <div className="emerg-top"><div className="emerg-room">ICU — Bed 3</div><span className="emerg-status-badge">🔴 Critical</span></div>
            <div className="emerg-name">Omar Ibrahim, 67</div>
            <div className="emerg-cond">Acute Myocardial Infarction (Heart Attack)</div>
            <div className="emerg-meta">
              <div className="emerg-meta-item"><strong>Dr. Hassan</strong>Cardiologist</div>
              <div className="emerg-meta-item"><strong>BP: 180/110</strong>Hypertensive</div>
              <div className="emerg-meta-item"><strong>09:15 AM</strong>Admitted</div>
            </div>
          </div>
          <div className="emerg-card">
            <div className="emerg-top"><div className="emerg-room">ER — Bay 1</div><span className="emerg-status-badge">🟠 Urgent</span></div>
            <div className="emerg-name">Deeqa Warsame, 41</div>
            <div className="emerg-cond">Severe Asthma Attack — Oxygen Required</div>
            <div className="emerg-meta">
              <div className="emerg-meta-item"><strong>Dr. Ayan</strong>Internist</div>
              <div className="emerg-meta-item"><strong>SpO2: 88%</strong>Low Oxygen</div>
              <div className="emerg-meta-item"><strong>10:40 AM</strong>Admitted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== PHARMACY =====
function PharmacySection({ showToast }) {
  const ref1 = useFadeUp(), ref2 = useFadeUp()
  return (
    <section className="section" id="pharmacy">
      <div className="sec-header" ref={ref1}>
        <div className="sec-tag">💊 Pharmacy</div>
        <h2 className="sec-h">Pharmacy Stock</h2>
        <p className="sec-sub">Current medication inventory and low-stock alerts.</p>
      </div>
      <div className="pharmacy-grid" ref={ref2}>
        <div className="pharm-card">
          <div className="pharm-head"><h3>💊 Medication Inventory</h3><button className="pharm-btn" onClick={() => showToast('Order placed! ✅')}>+ Order Stock</button></div>
          {MEDS.map((m,i) => (
            <div className="med-item" key={i}>
              <div className="med-ico" style={{background:m.bg}}>{m.ico}</div>
              <div className="med-info"><div className="med-name">{m.name}</div><div className="med-cat">{m.cat}</div></div>
              <div className={`med-stock ${m.low?'stock-low':'stock-ok'}`}>{m.stock}</div>
            </div>
          ))}
        </div>
        <div className="pharm-card">
          <div className="pharm-head"><h3>🔔 Stock Alerts</h3><span style={{fontSize:'.72rem',color:'var(--red)',fontWeight:700}}>2 Critical</span></div>
          <div className="alert-list">
            {ALERTS.map((a,i) => (
              <div className="alert-item" key={i}>
                <div className="alert-dot" style={{background:a.color}}></div>
                <div><div className="alert-msg">{a.msg}</div><div className="alert-time">{a.time}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ===== BILLING =====
function BillingSection() {
  const ref1 = useFadeUp(), ref2 = useFadeUp()
  return (
    <div className="section-white" id="billing">
      <div className="section-inner">
        <div className="sec-header" ref={ref1}>
          <div className="sec-tag">💵 Finance</div>
          <h2 className="sec-h">Billing & Revenue</h2>
          <p className="sec-sub">Patient billing status and monthly revenue breakdown.</p>
        </div>
        <div className="billing-grid" ref={ref2}>
          <div className="bill-card">
            <div className="bill-head"><h3>Recent Bills</h3><button className="dash-link">View all →</button></div>
            {BILLS.map((b,i) => (
              <div className="bill-item" key={i}>
                <div className="bill-av" style={{background:b.color}}>{b.av}</div>
                <div className="bill-info"><div className="bill-name">{b.name}</div><div className="bill-type">{b.type}</div></div>
                <div style={{textAlign:'right'}}>
                  <div className="bill-amount">{b.amount}</div>
                  <div className={`bill-status ${b.statusCls}`}>{b.statusLabel}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bill-card">
            <div className="bill-head"><h3>Monthly Revenue</h3><span style={{fontSize:'.78rem',color:'var(--green)',fontWeight:700}}>↑ +18% vs last month</span></div>
            {REVENUE.map((r,i) => (
              <div className="rev-item" key={i}>
                <span className="rev-label">{r.label}</span>
                <div className="rev-bar-bg"><div className="rev-bar-fill" style={{width:`${r.fill}%`,background:r.color}}></div></div>
                <span className="rev-val" style={{color:r.color}}>{r.val}</span>
              </div>
            ))}
            <div className="rev-total"><span className="rev-total-label">Total Revenue</span><span className="rev-total-val">$108,000</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== REPORTS =====
function ReportsSection({ showToast }) {
  const ref1 = useFadeUp(), ref2 = useFadeUp()
  return (
    <section className="section" id="reports">
      <div className="sec-header" ref={ref1}>
        <div className="sec-tag">📈 Analytics</div>
        <h2 className="sec-h">Reports & Analytics</h2>
        <p className="sec-sub">Generate detailed reports for hospital operations, finances, and patient outcomes.</p>
      </div>
      <div className="reports-grid" ref={ref2}>
        {REPORTS_LIST.map((r,i) => (
          <div className="rpt-card" key={i} onClick={() => showToast(`Generating ${r.title}... 📊`)}>
            <div className="rpt-icon">{r.icon}</div>
            <div className="rpt-title">{r.title}</div>
            <div className="rpt-desc">{r.desc}</div>
            <div className="rpt-link">Generate Report →</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ===== FOOTER =====
function Footer() {
  const cols = [
    { title:'Modules', links:['Dashboard','Patients','Wards & Beds','Medical Staff'] },
    { title:'Operations', links:['Pharmacy','Billing','Emergency','Reports'] },
    { title:'System', links:['Settings','User Management','Audit Logs','Support'] },
  ]
  const anchors = { Dashboard:'#dashboard', Patients:'#patients','Wards & Beds':'#wards','Medical Staff':'#doctors', Pharmacy:'#pharmacy', Billing:'#billing', Emergency:'#emergency', Reports:'#reports' }
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="nav-brand" style={{marginBottom:'.5rem'}}><div className="nav-logo">🏥</div><div className="nav-title">Medi<span>Care</span> Pro</div></div>
            <p className="footer-brand-text">A complete hospital management system for modern healthcare. Manage patients, staff, wards, and finances efficiently.</p>
          </div>
          {cols.map((col,i) => (
            <div className="footer-col" key={i}>
              <h4>{col.title}</h4>
              {col.links.map((l,j) => (
                <a key={j} onClick={() => anchors[l] && scrollTo(anchors[l])}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2025 MediCare Pro Hospital Management System. All rights reserved.</div>
          <div className="footer-online"><div className="footer-dot"></div>System Online</div>
        </div>
      </div>
    </footer>
  )
}

// ===== MODAL =====
function Modal({ onClose, showToast }) {
  const [form, setForm] = useState({ firstName:'', lastName:'', age:'', gender:'Male', condition:'', doctor:'Dr. Muno', ward:'General Ward' })
  const set = (k,v) => setForm(f => ({...f,[k]:v}))
  const submit = () => {
    if (!form.firstName || !form.lastName) { showToast('⚠️ Please fill in the patient name'); return }
    showToast(`✅ ${form.firstName} ${form.lastName} registered successfully!`)
    onClose()
  }
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">🧑‍⚕️ New Patient Registration</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">First Name *</label><input className="form-input" placeholder="Ahmed" value={form.firstName} onChange={e=>set('firstName',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Last Name *</label><input className="form-input" placeholder="Hassan" value={form.lastName} onChange={e=>set('lastName',e.target.value)}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" placeholder="34" value={form.age} onChange={e=>set('age',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Gender</label><select className="form-input" value={form.gender} onChange={e=>set('gender',e.target.value)}><option>Male</option><option>Female</option></select></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Condition / Diagnosis</label><input className="form-input" placeholder="e.g. Malaria" value={form.condition} onChange={e=>set('condition',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Assigned Doctor</label><select className="form-input" value={form.doctor} onChange={e=>set('doctor',e.target.value)}>{DOCTORS.map(d=><option key={d.name}>{d.name}</option>)}</select></div>
        </div>
        <div className="form-group"><label className="form-label">Ward</label><select className="form-input" value={form.ward} onChange={e=>set('ward',e.target.value)}>{WARDS.map(w=><option key={w.label}>{w.label}</option>)}<option>ER</option></select></div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={submit}>Register Patient</button>
        </div>
      </div>
    </div>
  )
}

// ===== TOAST =====
function Toast({ msg }) {
  return <div className="toast">{msg}</div>
}

// ===== APP =====
export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <>
      <Navbar onNewPatient={() => setModalOpen(true)} />
      <Hero onNewPatient={() => setModalOpen(true)} />
      <StatsSection />
      <PatientsSection />
      <WardsSection />
      <DoctorsSection />
      <EmergencySection />
      <PharmacySection showToast={showToast} />
      <BillingSection />
      <ReportsSection showToast={showToast} />
      <Footer />
      {modalOpen && <Modal onClose={() => setModalOpen(false)} showToast={showToast} />}
      {toast && <Toast msg={toast} />}
    </>
  )
}