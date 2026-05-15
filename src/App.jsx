import { useState } from 'react'
import './App.css'

const NAV = [
  {group:'Overview'},{icon:'📊',label:'Dashboard'},{icon:'🚨',label:'Emergency',num:'2',red:true},
  {group:'Patients'},{icon:'🧑‍⚕️',label:'All Patients',num:'342'},{icon:'📋',label:'Appointments',num:'18'},
  {icon:'🛏️',label:'Wards & Beds'},{icon:'🔬',label:'Lab Results'},
  {group:'Staff'},{icon:'👨‍⚕️',label:'Doctors'},{icon:'👩‍⚕️',label:'Nurses'},{icon:'📅',label:'Duty Schedule'},
  {group:'Admin'},{icon:'💊',label:'Pharmacy'},{icon:'💵',label:'Billing'},{icon:'📈',label:'Reports'},{icon:'⚙️',label:'Settings'},
]

const STATS = [
  {ico:'🧑‍⚕️',bg:'var(--blue-l)',val:'342',lbl:'Total Patients',badge:'+14 today',up:true,fill:'68%',color:'var(--blue)'},
  {ico:'🛏️',bg:'var(--teal-l)',val:'88%',lbl:'Bed Occupancy',badge:'12 empty',up:false,fill:'88%',color:'var(--teal)'},
  {ico:'👨‍⚕️',bg:'var(--green-l)',val:'24',lbl:'Doctors On Shift',badge:'On duty',up:true,fill:'80%',color:'var(--green)'},
  {ico:'🚨',bg:'var(--red-l)',val:'2',lbl:'Emergency Cases',badge:'Urgent',up:false,fill:'20%',color:'var(--red)'},
]

const PATIENTS = [
  {av:'AH',color:'#1d6feb',name:'Ahmed Hassan',age:34,cond:'Malaria',doc:'Dr. Nuur',status:'Admitted',sc:'sp-orange'},
  {av:'FM',color:'#0891b2',name:'Fatima Mohamed',age:28,cond:'Fracture',doc:'Dr. Muno',status:'In Surgery',sc:'sp-blue'},
  {av:'ZA',color:'#0d9488',name:'Zahra Ali',age:52,cond:'Diabetes',doc:'Dr. Ayan',status:'Stable',sc:'sp-green'},
  {av:'OI',color:'#dc2626',name:'Omar Ibrahim',age:67,cond:'Cardiac',doc:'Dr. Hassan',status:'Critical',sc:'sp-red'},
  {av:'HM',color:'#7c3aed',name:'Hodan Muuse',age:22,cond:'Checkup',doc:'Dr. Muno',status:'Discharged',sc:'sp-green'},
]

const APTS = [
  {time:'08:30',period:'AM',color:'#1d6feb',patient:'Ahmed Hassan',reason:'Follow-up: Malaria',doc:'Dr. Nuur',room:'Room 102'},
  {time:'09:15',period:'AM',color:'#dc2626',patient:'Omar Ibrahim',reason:'🚨 Cardiac Emergency',doc:'Dr. Hassan',room:'ICU'},
  {time:'10:00',period:'AM',color:'#0d9488',patient:'Zahra Ali',reason:'Diabetes Checkup',doc:'Dr. Ayan',room:'Room 205'},
  {time:'11:30',period:'AM',color:'#7c3aed',patient:'New Patient',reason:'General Consultation',doc:'Dr. Muno',room:'Room 110'},
  {time:'14:00',period:'PM',color:'#ea580c',patient:'Fatima Mohamed',reason:'Post-Surgery Review',doc:'Dr. Muno',room:'Ward B'},
]

const WARDS = [
  {num:'24/28',color:'var(--blue)',lbl:'General Ward',cap:'86% full',capColor:'var(--orange)'},
  {num:'8/8',color:'var(--red)',lbl:'ICU',cap:'100% full',capColor:'var(--red)'},
  {num:'12/20',color:'var(--teal)',lbl:'Maternity',cap:'60% full',capColor:'var(--green)'},
  {num:'6/10',color:'var(--purple)',lbl:'Pediatric',cap:'60% full',capColor:'var(--green)'},
]

const MEDS = [
  {name:'Amoxicillin 500mg',cat:'Antibiotic',stock:'240 units',low:false},
  {name:'Paracetamol 1g',cat:'Painkiller',stock:'580 units',low:false},
  {name:'Insulin Glargine',cat:'Diabetes',stock:'⚠️ 12 units',low:true},
  {name:'IV Saline 0.9%',cat:'Infusion',stock:'⚠️ 8 bags',low:true},
  {name:'Morphine 10mg',cat:'Pain Relief',stock:'46 vials',low:false},
]

const DOCTORS = [
  {av:'MN',color:'#1d6feb',name:'Dr. Muno',spec:'Chief Medical Officer',status:'● On Duty',sc:'ds-on'},
  {av:'AN',color:'#0891b2',name:'Dr. Ayan Nuur',spec:'Internist',status:'● In Surgery',sc:'ds-busy'},
  {av:'HH',color:'#dc2626',name:'Dr. Hassan',spec:'Cardiologist',status:'● On Duty',sc:'ds-on'},
  {av:'ZM',color:'#7c3aed',name:'Dr. Zahra',spec:'Pediatrician',status:'● Off Duty',sc:'ds-off'},
  {av:'OA',color:'#0d9488',name:'Dr. Omar Ali',spec:'Surgeon',status:'● In Theater',sc:'ds-busy'},
]

export default function App() {
  const [active, setActive] = useState('Dashboard')

  return (
    <div style={{display:'flex'}}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sb-top">
          <div className="sb-brand">
            <div className="sb-icon-wrap">🏥</div>
            <div>
              <div className="sb-name">Medi<span>Care</span> Pro</div>
              <div className="sb-tagline">Hospital Management System</div>
            </div>
          </div>
        </div>
        <div className="sb-doctor">
          <div className="doc-av">M</div>
          <div>
            <div className="doc-name">Dr. Muno</div>
            <div className="doc-spec"><span className="online"></span>Chief Medical Officer</div>
          </div>
        </div>
        <nav className="sb-nav">
          {NAV.map((item,i) =>
            item.group
              ? <div className="nav-group" key={i}>{item.group}</div>
              : (
                <button key={i} className={`nav-item ${active===item.label?'on':''}`} onClick={()=>setActive(item.label)}>
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                  {item.num && <span className={`nav-num ${item.red?'red':''}`}>{item.num}</span>}
                </button>
              )
          )}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="main">
        <div className="topbar">
          <div>
            <div className="tb-title">Hospital Dashboard</div>
            <div className="tb-sub">Monday, 12 May 2025 — Morning Shift</div>
          </div>
          <div className="tb-right">
            <input className="tb-search" placeholder="🔍 Search patient, doctor..."/>
            <div className="icon-btn">🔔<div className="badge-dot"></div></div>
            <button className="tb-add">+ New Patient</button>
          </div>
        </div>

        <div className="body">
          {/* STATS */}
          <div className="stats">
            {STATS.map((s,i)=>(
              <div className="sc" key={i}>
                <div className="sc-row">
                  <div className="sc-ico" style={{background:s.bg}}>{s.ico}</div>
                  <span className={`sc-badge ${s.up?'up':'down'}`}>{s.badge}</span>
                </div>
                <div className="sc-val" style={{color:s.color}}>{s.val}</div>
                <div className="sc-lbl">{s.lbl}</div>
                <div className="sc-bar"><div className="sc-fill" style={{width:s.fill,background:s.color}}></div></div>
              </div>
            ))}
          </div>

          {/* GRID2 */}
          <div className="grid2">
            <div className="card">
              <div className="ch"><h3>Recent Patients</h3><button className="ch-link">View all →</button></div>
              <table>
                <thead><tr><th>Patient</th><th>Age</th><th>Condition</th><th>Doctor</th><th>Status</th></tr></thead>
                <tbody>
                  {PATIENTS.map((p,i)=>(
                    <tr key={i}>
                      <td><div className="pat-name"><div className="p-av" style={{background:p.color}}>{p.av}</div>{p.name}</div></td>
                      <td>{p.age}</td><td>{p.cond}</td><td>{p.doc}</td>
                      <td><span className={`status-pill ${p.sc}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <div className="ch"><h3>Today's Appointments</h3><span className="emergency-badge">🚨 2 Emergency</span></div>
              <div className="apt-list">
                {APTS.map((a,i)=>(
                  <div className="apt-item" key={i}>
                    <div className="apt-time"><strong>{a.time}</strong>{a.period}</div>
                    <div className="apt-line" style={{background:a.color}}></div>
                    <div className="apt-info">
                      <div className="apt-patient">{a.patient}</div>
                      <div className="apt-reason">{a.reason}</div>
                    </div>
                    <div className="apt-doc"><strong>{a.doc}</strong>{a.room}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GRID3 */}
          <div className="grid3">
            <div className="card">
              <div className="ch"><h3>Ward Status</h3><button className="ch-link">Details →</button></div>
              <div className="ward-grid">
                {WARDS.map((w,i)=>(
                  <div className="ward-item" key={i}>
                    <div className="ward-num" style={{color:w.color}}>{w.num}</div>
                    <div className="ward-lbl">{w.lbl}</div>
                    <div className="ward-cap" style={{color:w.capColor}}>{w.cap}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="ch"><h3>Pharmacy Stock</h3><button className="ch-link">Order →</button></div>
              {MEDS.map((m,i)=>(
                <div className="med-item" key={i}>
                  <div><div className="med-name">{m.name}</div><div className="med-cat">{m.cat}</div></div>
                  <div className={`med-stock ${m.low?'stock-low':'stock-ok'}`}>{m.stock}</div>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="ch"><h3>Doctors On Duty</h3><button className="ch-link">Schedule →</button></div>
              {DOCTORS.map((d,i)=>(
                <div className="doc-item" key={i}>
                  <div className="d-av" style={{background:d.color}}>{d.av}</div>
                  <div><div className="d-name">{d.name}</div><div className="d-spec">{d.spec}</div></div>
                  <span className={`d-status ${d.sc}`}>{d.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}