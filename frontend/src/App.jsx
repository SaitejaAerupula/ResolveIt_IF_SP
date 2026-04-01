import React, { useState, useRef, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { ShieldAlert, Home, PlusSquare, FileText, User, UploadCloud, CheckCircle2, ShieldCheck, ArrowRight, ChevronLeft, Search, CheckCircle, Activity, MessageSquare, Briefcase, LogOut, AlertTriangle, FileUp, AlertOctagon, FileDown, BarChart2 } from 'lucide-react';
import './index.css';

// ----------------------
// GLOBAL STATE
// ----------------------
const AuthContext = createContext();

// ----------------------
// COMPONENTS
// ----------------------

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authRole, setAuthRole } = useContext(AuthContext);
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    setAuthRole(null);
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <ShieldAlert size={28} color="#60a5fa" />
        <span>ResolveIT</span>
      </div>
      
      <nav className="sidebar-nav" style={{ flex: 1 }}>
        {authRole === 'Admin' && (
          <>
            <div className={`nav-item ${isActive('/admin-dashboard')}`} onClick={() => navigate('/admin-dashboard')}>
              <Home size={20} />
              <span>Admin Dashboard</span>
            </div>
            <div className={`nav-item ${isActive('/reports')}`} onClick={() => navigate('/reports')}>
              <BarChart2 size={20} />
              <span>Reports & Exports</span>
            </div>
          </>
        )}

        {authRole !== 'Admin' && (
          <>
            <div className={`nav-item ${isActive('/dashboard')}`} onClick={() => navigate('/dashboard')}>
               <Home size={20} />
               <span>Dashboard</span>
            </div>
            <div className={`nav-item ${isActive('/submit')}`} onClick={() => navigate('/submit')}>
              <PlusSquare size={20} />
              <span>Submit Complaint</span>
            </div>
            <div className={`nav-item ${isActive('/my-complaints')}`} onClick={() => navigate('/my-complaints')}>
              <FileText size={20} />
              <span>My Complaints</span>
            </div>
          </>
        )}

        {authRole && (
          <div className={`nav-item ${isActive('/profile')}`} onClick={() => navigate('/profile')}>
            <User size={20} />
            <span>Profile</span>
          </div>
        )}
      </nav>
      
      {authRole && (
        <div className="sidebar-nav" style={{ paddingBottom: '24px' }}>
          <div className="nav-item" style={{ color: '#fca5a5' }} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Log Out</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------
// PAGES
// ----------------------

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo"><ShieldAlert size={28} />ResolveIT</div>
        <div>
          <button className="btn-primary btn-blue auto-width" onClick={() => navigate('/login')}>
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <div style={{ display: 'inline-block', background: '#e0f2fe', color: '#0284c7', padding: '6px 16px', borderRadius: '20px', fontWeight: '600', marginBottom: '16px', fontSize: '0.9rem' }}>
            Online Complaint & Grievance Portal
          </div>
          <h1>Empowering Transparency & Resolution</h1>
          <p>Institutions often lack transparency and efficiency in handling grievances. This platform allows users to submit complaints securely, track statuses in real-time right from MySQL, and escalate unresolved issues!</p>

          <ul className="features-list">
            <li><CheckCircle2 size={24} className="feature-icon" /> Built on Java Spring Boot & React</li>
            <li><CheckCircle2 size={24} className="feature-icon" /> Track dynamic MySQL database updates</li>
            <li><CheckCircle2 size={24} className="feature-icon" /> Admin Escalation & Report handling</li>
          </ul>

          <button className="btn-primary btn-blue" style={{ maxWidth: '200px' }} onClick={() => navigate('/login')}>
            Start using ResolveIT
          </button>
        </div>
        
        <div className="hero-image">
           <div className="landing-card" style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', width: '100%', maxWidth: '400px' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                 <ShieldCheck size={32} color="white" />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Your Voice Matters</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>A secure and centralized system designed to efficiently manage and resolve institutional grievances.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { setAuthRole } = useContext(AuthContext);

  const [role, setRole] = useState('User'); 
  const [isNewUser, setIsNewUser] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    
    // 1. Hardcoded admin check for immediate presentation (optional)
    if (role === 'Admin') {
       if (email !== 'admin@resolveit.edu' || password !== 'admin123') {
          alert('Incorrect credentials! Please use Email: admin@resolveit.edu | Password: admin123');
          return;
       }
       setAuthRole('Admin');
       navigate('/admin-dashboard');
       return;
    }

    try {
      // 2. Real Auth flow to Spring Boot backend
      if (isNewUser) {
        if (!showOtp) {
          // Trigger OTP mock
          alert("Sending a mock OTP to " + email + "... (Use 123456 to verify)");
          setShowOtp(true);
          return;
        }

        // Send POST to /signup
        const resp = await fetch('http://localhost:8080/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role, name: email.split('@')[0] })
        });
        if (resp.ok) {
          alert("Account created successfully! Now you can login.");
          setIsNewUser(false);
          setShowOtp(false);
        }
      } else {
        // Send POST to /login
        const resp = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const result = await resp.json();
        
        if (resp.ok && result.id) {
          setAuthRole(result.role || role, email); // Store Email in Auth State
          navigate(result.role === 'Admin' ? '/admin-dashboard' : '/dashboard');
        } else {
          alert('Login failed: ' + (typeof result === 'string' ? result : 'Invalid credentials'));
        }
      }
    } catch (err) {
      // Fallback for demo if server is offline (optional)
      console.warn("Backend not reachable. Logging in via mock state.");
      setAuthRole(role, email); // Store Email even in offline mode
      navigate(role === 'Admin' ? '/admin-dashboard' : '/dashboard');
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setShowOtp(false);
    if (newRole === 'Admin') setIsNewUser(false);
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <ShieldAlert size={64} style={{ marginBottom: '32px' }} />
        <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' }}>ResolveIT<br/>Complaint Portal</h1>
        <p style={{ fontSize: '1.2rem', color: '#93c5fd', maxWidth: '400px', lineHeight: '1.6' }}>Secure, transparent, and anonymous grievance submission platform.</p>
      </div>

      <div className="login-right">
        <div className="login-card card">
          <div style={{ marginBottom: '24px' }}>
            <h2 className="mb-2" style={{ fontSize: '1.75rem', fontWeight: '700' }}>
              {isNewUser ? `Create ${role} Account` : `${role} Login`}
            </h2>
            <p className="text-muted">
              {role === 'Admin' ? 'Use admin@resolveit.edu / admin123' : 'Log in to securely access the portal'}
            </p>
          </div>

          <div className="toggle-group" style={{ marginBottom: '24px' }}>
            {['User', 'Staff', 'Admin'].map(r => (
               <button 
                 type="button"
                 key={r}
                 className={`toggle-btn ${role === r ? 'active' : ''}`}
                 onClick={() => handleRoleChange(r)}
               >
                 {r}
               </button>
            ))}
          </div>

          <form onSubmit={handleAuth}>
            <div className="form-section">
              <label className="section-label">Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. user@institution.edu" 
                className="input-field" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {!showOtp && (
                <>
                  <label className="section-label" style={{ marginTop: '20px' }}>Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="input-field" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              )}

              {showOtp && isNewUser && (
                <div style={{ marginTop: '20px', animation: 'fadeIn 0.3s' }}>
                  <label className="section-label">One Time Password (OTP)</label>
                  <input type="text" placeholder="Enter 6-digit OTP (e.g. 123456)" className="input-field" required maxLength={6} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>An OTP has been sent to your email address.</p>
                </div>
              )}

              {!isNewUser && (
                <div className="flex-between">
                  <button type="button" className="link-btn" style={{ fontSize: '0.9rem' }}>Forgot Password?</button>
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary btn-blue mb-4">
              {isNewUser ? (showOtp ? 'Verify OTP & Sign Up' : 'Send OTP via Email') : `Log in as ${role}`}
            </button>
          </form>

          {role !== 'Admin' && (
            <div className="text-center mt-4 border-top" style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                {isNewUser ? 'Already have an account? ' : "Don't have an account? "}
                <button type="button" className="link-btn" onClick={() => { setIsNewUser(!isNewUser); setShowOtp(false); }}>
                  {isNewUser ? 'Log in' : 'Create new account'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------
// USER WORKFLOWS
// ----------------------

function UserDashboardPage() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header"><h2>Dashboard</h2></div>
        <div className="content-container">
          <div className="card">
            <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Welcome back!</h3>
            <p style={{ color: 'var(--text-muted)' }}>Navigate to "Submit Complaint" to trigger a Java Backend Post! Track current statuses in "My Complaints".</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitComplaintPage() {
  const navigate = useNavigate();
  const { authRole, userEmail } = useContext(AuthContext);
  const [subType, setSubType] = useState('Public');
  const [urgency, setUrgency] = useState('Medium');
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async () => {
    if (!subject.trim()) {
      alert("Please enter a subject");
      return;
    }

    const newComplaint = {
      submissionType: subType, // Matches Java
      urgency: urgency, // Matches Java
      subject: subject, // Matches Java
      description: desc, // Matches Java
      fileName: fileName, // Matches Java
      status: 'NEW', // Matches Java
      submittedBy: userEmail, // TRACKING THE USER NAME
      createdAt: new Date().toISOString(), // Matches Java LocalDateTime mapping
    };

    try {
      const response = await fetch('http://localhost:8080/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComplaint)
      });
      if (response.ok) {
         alert('✅ SUCCESS: Grievance Saved to MySQL Database!');
         navigate('/my-complaints');
         return;
      } else {
         console.error("Server responded with error:", response.status);
      }
    } catch (err) {
       console.error("Connection Failed:", err);
       alert("🚨 CONNECTION FAILED: The React app could not reach your Java Backend on port 8080. Data is being saved in Browser Demo mode instead. Please ensure IntelliJ is running!");
    }

    const existing = JSON.parse(localStorage.getItem('demo_complaints') || '[]');
    localStorage.setItem('demo_complaints', JSON.stringify([newComplaint, ...existing]));
    navigate('/my-complaints');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header"><h2>Submit Complaint</h2></div>
        <div className="content-container">
          <div className="card" style={{ maxWidth: '800px' }}>
            
            <div className="form-section flex-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <label className="section-label">Submission Type</label>
                <div className="toggle-group">
                  <button type="button" className={`toggle-btn ${subType === 'Public' ? 'active' : ''}`} onClick={() => setSubType('Public')}>Public</button>
                  <button type="button" className={`toggle-btn ${subType === 'Anonymous' ? 'active' : ''}`} onClick={() => setSubType('Anonymous')}>Anonymous</button>
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '250px' }}>
                <label className="section-label">Urgency Level</label>
                <div className="toggle-group">
                  <button type="button" className={`toggle-btn ${urgency === 'Low' ? 'active urgency-low' : ''}`} onClick={() => setUrgency('Low')}>Low</button>
                  <button type="button" className={`toggle-btn ${urgency === 'Medium' ? 'active urgency-medium' : ''}`} onClick={() => setUrgency('Medium')}>Medium</button>
                  <button type="button" className={`toggle-btn ${urgency === 'High' ? 'active urgency-high' : ''}`} onClick={() => setUrgency('High')}>High</button>
                </div>
              </div>
            </div>

            <div className="form-section" style={{ marginTop: '24px' }}>
              <label className="section-label">Complaint Details</label>
              <input type="text" className="input-field" placeholder="Brief Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <textarea className="input-field" placeholder="Provide a detailed description of your grievance..." value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
            </div>

            {/* RESTORED IMAGE OPTION */}
            <div className="form-section" style={{ marginTop: '24px' }}>
              <label className="section-label">Supporting Evidence (Image/File)</label>
              <div className="upload-box" onClick={() => fileInputRef.current.click()} style={{ border: '2px dashed #cbd5e1', padding: '32px', textAlign: 'center', borderRadius: '12px', cursor: 'pointer', background: '#f8fafc' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📁</div>
                <h4 style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {fileName ? "File attached: " + fileName : "Click to select a file"}
                </h4>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Upload supporting evidence (PNG, JPG, PDF)</p>
                <input 
                   type="file" 
                   ref={fileInputRef} 
                   style={{ display: 'none' }} 
                   onChange={handleFileChange}
                />
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
               <button type="button" className="btn-primary" style={{ maxWidth: '300px' }} onClick={handleSubmit}>
                 Submit Complaint
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      let allData = [];
      try {
        const resp = await fetch('http://localhost:8080/api/complaints');
        if (resp.ok) {
          allData = await resp.json();
        }
      } catch (err) {}
      
      const localData = JSON.parse(localStorage.getItem('demo_complaints') || '[]');
      setComplaints([...allData, ...localData]);
    };

    fetchComplaints();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header"><h2>My Complaints</h2></div>
        <div className="content-container">
          {complaints.length === 0 ? (
            <div className="card text-center" style={{ padding: '60px 20px' }}>
               <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Complaints Found</h3>
               <p className="text-muted">You haven't submitted any complaints yet.</p>
            </div>
          ) : (
            <div>
              {complaints.map((c, idx) => (
                <div key={idx} className="card" style={{ marginBottom: '24px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h2 style={{ fontSize: '1.1rem' }}>#{c.id} | {c.subject}</h2>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#e0f2fe', color: '#0369a1', fontSize: '0.8rem', fontWeight: 600 }}>{c.status}</span>
                   </div>
                   <p style={{ color: 'var(--text-muted)' }}>{c.description}</p>
                   {c.urgency && <div style={{ marginTop: '12px', fontSize: '0.85rem' }}>Urgency: <span style={{ fontWeight: 700 }} className={`text-${c.urgency.toLowerCase()}`}>{c.urgency}</span></div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------
// ADMIN WORKFLOWS
// ----------------------

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let apiData = [];
    try {
      const res = await fetch('http://localhost:8080/api/complaints');
      if (res.ok) apiData = await res.json();
    } catch(err) {}
    
    const localData = JSON.parse(localStorage.getItem('demo_complaints') || '[]');
    // Filter out duplicates if any
    const apiIds = new Set(apiData.map(c => c.id));
    const merged = [...apiData, ...localData.filter(c => !apiIds.has(c.id))];
    setComplaints(merged);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const resp = await fetch(`http://localhost:8080/api/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (resp.ok) alert('Status updated in MySQL!');
      fetchData();
    } catch(err) {
       const local = JSON.parse(localStorage.getItem('demo_complaints') || '[]');
       const updated = local.map(comp => comp.id === id ? {...comp, status: newStatus} : comp);
       localStorage.setItem('demo_complaints', JSON.stringify(updated));
       fetchData();
    } 
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header"><h2>Admin Management Panel</h2></div>
        <div className="content-container">
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '20px', background: '#f8fafc', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
               <h3 style={{ fontSize: '1.1rem' }}>Total Grievances: {complaints.length}</h3>
            </div>
            {complaints.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No complaints found in Database or Local Storage.</div>}
            
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead style={{ background: '#f1f5f9', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  <tr>
                    <th style={{ padding: '12px 24px', textAlign: 'left' }}>Complaint ID</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left' }}>Subject</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left' }}>Submitted At</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left' }}>Complained By</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left' }}>Assign Staff</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px 24px', textAlign: 'right' }}>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {complaints.map((c, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 24px', fontWeight: 600 }}>#{c.id}</td>
                      <td style={{ padding: '16px 24px' }}>{c.subject}</td>
                      <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.submittedAt || 'Recently'}</td>
                      <td style={{ padding: '16px 24px', fontWeight: 600 }}>{c.submittedBy || 'Anonymous'}</td>
                      <td style={{ padding: '16px 24px' }}>
                         <select className="status-select">
                            <option>Not Assigned</option>
                            <option>Technical Team</option>
                            <option>Maintenance</option>
                            <option>Admin Office</option>
                         </select>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                         <select className="status-select" style={{ borderColor: c.status === 'RESOLVED' ? '#10b981' : 'var(--border)', color: c.status === 'RESOLVED' ? '#10b981' : 'inherit' }} defaultValue={c.status} onChange={(e) => handleUpdateStatus(c.id, e.target.value)}>
                            <option value="NEW">NEW</option>
                            <option value="IN PROGRESS">IN PROGRESS</option>
                            <option value="RESOLVED">RESOLVED</option>
                            <option value="ESCALATED">ESCALATED</option>
                         </select>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button className="btn-small" onClick={() => navigate(`/escalate/${c.id}`)}>
                           <AlertOctagon size={16} /> Escalate
                        </button>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function EscalatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('demo_complaints') || '[]');
    const found = local.find(c => c.id === id);
    if (found) setComplaint(found);
  }, [id]);

  const handleFinalEscalate = async () => {
    alert(`Complaint #${id} has been formally escalated to the Higher Authority.`);
    // Update status to ESCALATED
    const local = JSON.parse(localStorage.getItem('demo_complaints') || '[]');
    const updated = local.map(comp => comp.id === id ? {...comp, status: 'ESCALATED'} : comp);
    localStorage.setItem('demo_complaints', JSON.stringify(updated));
    navigate('/admin-dashboard');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
           <button className="btn-icon" onClick={() => navigate('/admin-dashboard')}><ChevronLeft /></button>
           <h2>Escalate Complaint</h2>
        </div>
        <div className="content-container">
           <div className="card" style={{ maxWidth: '700px' }}>
              <div className="form-section">
                 <label className="section-label">Complaint Details</label>
                 <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <FileText size={20} color="#64748b" />
                    </div>
                    <div>
                       <div style={{ fontWeight: 600 }}>{complaint?.subject || 'Unresolved Issue'}</div>
                       <div className="text-muted" style={{ fontSize: '0.85rem' }}>Complaint ID: {id}</div>
                    </div>
                 </div>
              </div>

              <div className="form-section" style={{ marginTop: '32px' }}>
                 <label className="section-label">Escalation Options</label>
                 <select className="input-field">
                    <option>Select Higher Authority</option>
                    <option>Warden / Rector</option>
                    <option>Dean of Student Affairs</option>
                    <option>Principal / Director</option>
                    <option>Governing Body</option>
                 </select>
              </div>

              <div className="form-section flex-between" style={{ marginTop: '24px', alignItems: 'center' }}>
                 <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>Notify All Parties</h4>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Notify all parties involved in the original complaint</p>
                 </div>
                 <div className="switch" style={{ width: '50px', height: '26px', background: '#3b82f6', borderRadius: '15px', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', right: '4px', top: '3px' }}></div>
                 </div>
              </div>

              <button className="btn-primary" style={{ marginTop: '40px', background: 'black' }} onClick={handleFinalEscalate}>
                 Escalate Complaint
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function ReportsPage() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('demo_complaints') || '[]');
    setComplaints(local);
  }, []);

  const stats = {
     total: complaints.length,
     resolved: complaints.filter(c => c.status === 'RESOLVED').length,
     escalated: complaints.filter(c => c.status === 'ESCALATED').length,
     new: complaints.filter(c => c.status === 'NEW').length
  };

  const exportToCSV = () => {
    let csv = 'ID,Subject,Status,Urgency,Description\n';
    complaints.forEach(c => {
      csv += `${c.id},"${c.subject}",${c.status},${c.urgency || 'N/A'},"${c.description.replace(/"/g, '""')}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaint_report_${new Date().toLocaleDateString()}.csv`;
    a.click();
    alert('Report Exported Successfully as CSV!');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header"><h2>Reports & Exports</h2></div>
        <div className="content-container">
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div className="card text-center"><h3>{stats.total}</h3><p className="text-muted">Total Grievances</p></div>
              <div className="card text-center" style={{ borderLeft: '4px solid #10b981' }}><h3>{stats.resolved}</h3><p className="text-muted" style={{ color: '#10b981' }}>Resolved Cases</p></div>
              <div className="card text-center" style={{ borderLeft: '4px solid #ef4444' }}><h3>{stats.escalated}</h3><p className="text-muted" style={{ color: '#ef4444' }}>Escalated</p></div>
              <div className="card text-center" style={{ borderLeft: '4px solid #3b82f6' }}><h3>{stats.new}</h3><p className="text-muted" style={{ color: '#3b82f6' }}>New Issues</p></div>
           </div>

           <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <div>
                   <h3>Visual Dashboard & Trends</h3>
                   <p className="text-muted">Monitor performance and resolution efficiency.</p>
                 </div>
                 <button className="btn-primary btn-blue auto-width" onClick={exportToCSV}>
                    <FileDown size={18} /> Export as CSV Report
                 </button>
              </div>

              {/* MOCK VISUAL CHART */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                 <label className="section-label">Resolution Trend by Status</label>
                 <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '200px', padding: '0 40px' }}>
                    <div style={{ flex: 1, background: '#f1f5f9', height: '80%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
                       <div style={{ background: '#3b82f6', height: `${(stats.new / (stats.total || 1)) * 100}%`, borderRadius: '8px 8px 0 0', transition: '1s ease' }}></div>
                       <div style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem' }}>New</div>
                    </div>
                    <div style={{ flex: 1, background: '#f1f5f9', height: '80%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
                       <div style={{ background: '#10b981', height: `${(stats.resolved / (stats.total || 1)) * 100}%`, borderRadius: '8px 8px 0 0', transition: '1s ease' }}></div>
                       <div style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem' }}>Resolved</div>
                    </div>
                    <div style={{ flex: 1, background: '#f1f5f9', height: '80%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
                       <div style={{ background: '#ef4444', height: `${(stats.escalated / (stats.total || 1)) * 100}%`, borderRadius: '8px 8px 0 0', transition: '1s ease' }}></div>
                       <div style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem' }}>Escalated</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------
// SHARED
// ----------------------
function ProfilePage() {
  const { authRole } = useContext(AuthContext);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header"><h2>Profile Settings</h2></div>
        <div className="content-container">
           <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>
                  {authRole === 'Admin' ? 'A' : 'U'}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{authRole === 'Admin' ? 'Admin Portal' : 'User Account'}</h3>
              </div>

              <div className="form-section">
                 <label className="section-label">Full Name</label>
                 <input type="text" className="input-field" defaultValue="Saiteja Aerupula" />

                 <label className="section-label" style={{ marginTop: '16px'}}>Email Address</label>
                 <input type="email" className="input-field" defaultValue="sai@resolveit.edu" />

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                    <div>
                      <label className="section-label">ID Number / Emp ID</label>
                      <input type="text" className="input-field" defaultValue="ID-2026-99" />
                    </div>
                    <div>
                      <label className="section-label">Phone Number</label>
                      <input type="tel" className="input-field" defaultValue="+91 999 888 7777" />
                    </div>
                 </div>

                 <label className="section-label" style={{ marginTop: '16px'}}>Password</label>
                 <input type="password" className="input-field" defaultValue="********" />
              </div>

              <button className="btn-primary" style={{ marginTop: '24px' }}>Save Profile Changes</button>
           </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------
// APP ENTRY
// ----------------------
export default function App() {
  const [authRole, setAuthRoleState] = useState(() => localStorage.getItem('auth_role')); 
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('user_email') || 'User');

  const setAuthRole = (role, email = '') => {
    if (role) {
      localStorage.setItem('auth_role', role);
      if (email) {
        localStorage.setItem('user_email', email);
        setUserEmail(email);
      }
    } else {
      localStorage.removeItem('auth_role');
      localStorage.removeItem('user_email');
      setUserEmail('User');
    }
    setAuthRoleState(role);
  };

  return (
    <AuthContext.Provider value={{ authRole, setAuthRole, userEmail }}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/submit" element={<SubmitComplaintPage />} />
          <Route path="/my-complaints" element={<MyComplaintsPage />} />
          
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/escalate/:id" element={<EscalatePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Universal fallback to landing */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
