import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    Coffee,
    ChevronRight,
    TrendingUp,
    Users,
    Star,
    Bell,
    Search,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Download,
    Calendar,
    Filter,
    CheckCircle2,
    AlertCircle,
    UserCircle,
    ArrowLeft,
    UploadCloud,
    X,
    Eye,
    Globe,
    Activity
} from 'lucide-react';
import {
    mockAnalytics,
    mockForms,
    mockSubmissions,
    triggerBulkDownload,
    submitFeedback
} from './services/mockData';

// --- UI Components ---

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }: any) => {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200',
        secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
        outline: 'bg-transparent text-indigo-600 border border-indigo-200 hover:bg-indigo-50',
        ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[0.98] ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const Card = ({ children, className = '', noPadding = false, ...props }: any) => (
    <div className={`bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden ${className}`} {...props}>
        <div className={noPadding ? '' : 'p-6 md:p-8'}>
            {children}
        </div>
    </div>
);

const Badge = ({ children, variant = 'neutral' }: any) => {
    const styles = {
        neutral: 'bg-slate-100 text-slate-600',
        success: 'bg-emerald-100 text-emerald-700',
        warning: 'bg-amber-100 text-amber-700',
        error: 'bg-red-100 text-red-700',
        primary: 'bg-indigo-100 text-indigo-700',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant as keyof typeof styles]}`}>
            {children}
        </span>
    );
};

// --- View Components ---

const App = () => {
    const [view, setView] = useState<'auth' | 'customer_list' | 'customer_submit'>('auth');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedForm, setSelectedForm] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [adminSelectedForm, setAdminSelectedForm] = useState<any>(null);

    // Initial Login & Customer Entry Screen
    if (view === 'auth' && !isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-emerald-50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl w-full animate-in fade-in zoom-in duration-700">

                    {/* Admin Login Box */}
                    <Card noPadding className="shadow-2xl shadow-indigo-200/50 border-none relative overflow-hidden">
                        <div className="p-8 md:p-10 text-center bg-white">
                            <div className="mx-auto bg-gradient-to-tr from-indigo-600 to-indigo-500 w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-200">
                                <Coffee size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Divine Admin</h2>
                            <p className="text-[10px] font-black text-slate-400 tracking-widest mt-2 uppercase">
                                {authMode === 'login' ? 'POST /api/v1/login/access-token' : 'POST /api/v1/register'}
                            </p>
                        </div>
                        <form className="px-8 md:px-10 pb-8 space-y-5 bg-white" onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }}>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-tight">Email</label>
                                <input type="email" placeholder="hr@company.com" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 ring-indigo-50 outline-none transition-all" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-tight">Password</label>
                                <input type="password" placeholder="••••••••" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 ring-indigo-50 outline-none transition-all" required />
                            </div>
                            <Button className="w-full py-4 text-sm font-black uppercase tracking-widest rounded-2xl mt-4 shadow-lg shadow-indigo-100">
                                {authMode === 'login' ? 'Sign In' : 'Register Now'}
                            </Button>
                        </form>
                        <div className="p-6 bg-slate-50/80 border-t border-slate-100 text-center">
                            <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-[10px] text-slate-400 hover:text-indigo-600 font-black uppercase tracking-[0.2em] transition-colors">
                                {authMode === 'login' ? 'Switch to Register' : 'Switch to Login'}
                            </button>
                        </div>
                    </Card>

                    {/* Customer Box */}
                    <Card noPadding className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all group flex flex-col justify-center items-center text-center p-12 bg-white">
                        <div className="w-20 h-20 bg-emerald-100 rounded-[32px] flex items-center justify-center text-emerald-600 mb-8 transform group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                            <UserCircle size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Customer</h2>
                        <p className="text-emerald-500 font-bold text-xs tracking-widest uppercase mt-4">PUBLIC FEEDBACK</p>
                        <p className="text-slate-500 text-sm mt-4 font-medium leading-relaxed max-w-xs">No authorization needed. Select a form and help our services grow.</p>
                        <div className="mt-10">
                            <Button variant="secondary" onClick={() => setView('customer_list')} className="px-10 py-4 rounded-2xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-black uppercase tracking-widest text-xs">
                                Open Form List
                            </Button>
                        </div>
                    </Card>

                </div>
            </div>
        );
    }

    // Customer: List of Forms (Admin Created)
    if (view === 'customer_list') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl animate-in slide-in-from-bottom-10 duration-500">
                    <button onClick={() => setView('auth')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest mb-6 transition-colors">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Service Sensors</h2>
                    <p className="text-slate-500 font-medium mb-8">Choose a form to provide satisfaction data.</p>

                    <div className="grid grid-cols-1 gap-4">
                        {mockForms.map(form => (
                            <Card key={form.id} className="hover:border-emerald-400 transition-all cursor-pointer group" onClick={() => { setSelectedForm(form); setView('customer_submit'); }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{form.title}</h3>
                                            <p className="text-sm text-slate-500 mt-1">{form.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={24} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Customer: Submit Satisfaction Form
    if (view === 'customer_submit' && selectedForm) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl animate-in slide-in-from-bottom-10 duration-500">
                    <button onClick={() => setView('customer_list')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest mb-6 transition-colors">
                        <ArrowLeft size={16} /> Change Form
                    </button>
                    <Card noPadding className="shadow-2xl border-none">
                        <div className="bg-emerald-600 p-8 md:p-10 text-white">
                            <h2 className="text-3xl font-black tracking-tight">{selectedForm.title}</h2>
                            <p className="mt-2 text-emerald-100 font-medium">{selectedForm.description}</p>
                            <p className="mt-4 text-[10px] font-black tracking-[0.2em] uppercase bg-white/10 inline-block px-3 py-1 rounded-full border border-white/20">
                                POST /api/v1/submissions/submit/{selectedForm.id}
                            </p>
                        </div>
                        <form className="p-8 md:p-10 space-y-8 bg-white" onSubmit={(e) => { e.preventDefault(); alert('Feedback Submitted!'); setView('auth'); }}>
                            {/* Rating */}
                            <div className="space-y-4 text-center">
                                <label className="text-xs font-black text-slate-400 tracking-widest uppercase">Select Satisfaction Level (1-5)</label>
                                <div className="flex justify-center gap-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button key={s} type="button" className="group">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 group-hover:text-amber-500 group-hover:border-amber-200 transition-all">
                                                <Star size={24} className="fill-current" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 mt-1 block">{s}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 tracking-widest uppercase ml-1">Customer Name</label>
                                        <input type="text" placeholder="Your Name" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 outline-none" required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 tracking-widest uppercase ml-1">Customer Email</label>
                                        <input type="email" placeholder="Your Email" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 outline-none" required />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 tracking-widest uppercase ml-1">Description</label>
                                    <textarea placeholder="Satisfaction details..." className="w-full h-32 px-5 py-4 rounded-3xl border border-slate-200 bg-slate-50 outline-none resize-none" required></textarea>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 tracking-widest uppercase ml-1">Screenshot (If error)</label>
                                    <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50">
                                        <UploadCloud size={24} className="mx-auto text-slate-300" />
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Optional Upload</p>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full py-5 text-xl font-black uppercase tracking-widest rounded-3xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100">
                                Submit Feedback
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        );
    }

    // --- Admin Dashboard (Authenticated) ---

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} border-r border-slate-200 bg-white flex flex-col transition-all duration-500 ease-in-out z-20 shadow-sm`}>
                <div className="h-24 px-8 flex items-center justify-between">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
                        <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg">
                            <Coffee size={24} />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className="font-black text-xl tracking-tighter text-slate-900 leading-none">Divine Hub</span>
                                <span className="text-[10px] font-bold text-indigo-500 tracking-[0.3em] uppercase mt-1">Coffee Intelligence</span>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem icon={<LayoutDashboard size={22} />} label="System Overview" active={activeTab === 'dashboard'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('dashboard')} />
                    <NavItem icon={<FileText size={22} />} label="Sensor Grid (GET)" active={activeTab === 'forms'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('forms')} />
                    <NavItem icon={<MessageSquare size={22} />} label="Signal Influx (GET)" active={activeTab === 'feedbacks'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('feedbacks')} />
                    <NavItem icon={<BarChart3 size={22} />} label="Intelligence (GET)" active={activeTab === 'reports'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('reports')} />
                </nav>

                <div className="p-6 border-t border-slate-100">
                    <NavItem
                        icon={<LogOut size={22} />}
                        label="Exit Admin"
                        collapsed={!isSidebarOpen}
                        onClick={() => { setIsAuthenticated(false); setView('auth'); }}
                        className="text-red-500 hover:bg-red-50"
                    />
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
                <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                            <Plus className={`${isSidebarOpen ? 'rotate-45' : 'rotate-0'}`} size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight capitalize">{activeTab === 'dashboard' ? 'Divine Control' : activeTab}</h1>
                            <p className="text-[11px] font-black text-indigo-500 mt-0.5 tracking-widest uppercase">Autonomous Brew Monitoring</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10">
                    <div className="max-w-7xl mx-auto">
                        {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} setIsCreateModalOpen={setIsCreateModalOpen} onFormClick={(form: any) => { setAdminSelectedForm(form); setIsDetailModalOpen(true); }} />}
                        {activeTab === 'forms' && <FormsView setActiveTab={setActiveTab} setIsCreateModalOpen={setIsCreateModalOpen} onFormClick={(form: any) => { setAdminSelectedForm(form); setIsDetailModalOpen(true); }} />}
                        {activeTab === 'feedbacks' && <FeedbacksView />}
                        {activeTab === 'reports' && <ReportsView />}
                    </div>
                </div>
            </div>

            {/* Create Form Modal (POST /api/v1/forms/) */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Deploy New Sensor</h3>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">POST /api/v1/forms/</p>
                            </div>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); alert('POST /api/v1/forms/ Success!'); setIsCreateModalOpen(false); }}>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 tracking-widest uppercase ml-1">Name of the Form</label>
                                <input type="text" placeholder="e.g. Barista Performance" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 tracking-widest uppercase ml-1">Description</label>
                                <textarea placeholder="Brief purpose of this sensor..." className="w-full h-32 px-5 py-4 rounded-3xl border border-slate-200 bg-slate-50 focus:bg-white outline-none resize-none" required></textarea>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <Button variant="secondary" type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-2xl">Cancel</Button>
                                <Button type="submit" className="flex-2 py-4 text-xs font-black uppercase tracking-widest rounded-2xl">Create Sensor (POST)</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DEEP ANALYSIS MODAL: Form Detail + Submissions + Analytics (GET Endpoints) */}
            {isDetailModalOpen && adminSelectedForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-5xl h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border-none">
                        {/* Header */}
                        <div className="bg-indigo-600 p-8 flex items-center justify-between text-white shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">{adminSelectedForm.title}</h3>
                                    <div className="flex gap-4 mt-1">
                                        <span className="text-[9px] font-black text-indigo-100 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full border border-white/20">GET /api/v1/forms/{adminSelectedForm.id}</span>
                                        <span className="text-[9px] font-black text-indigo-100 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full border border-white/20">GET /api/v1/reports/{adminSelectedForm.id}/analytics</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="secondary" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-indigo-600" onClick={() => triggerBulkDownload(adminSelectedForm.id)}>
                                    <Download size={16} /> Data Export (XLSX)
                                </Button>
                                <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Left Panel: High-Level Analytics (The User's latest request) */}
                            <div className="w-80 border-r border-slate-100 p-8 bg-slate-50/50 space-y-8 overflow-y-auto">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase block mb-3">Live Performance (GET)</label>
                                    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
                                        <div>
                                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">Total Avg Rating</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-3xl font-black text-slate-900 leading-none">{mockAnalytics.total_avg_rating.toFixed(2)}</p>
                                                <div className="flex gap-0.5"><Star size={10} className="fill-amber-400 text-amber-400" /></div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-slate-50">
                                            <SmallMetric label="30 Days History" value={mockAnalytics.avg_30_days} />
                                            <SmallMetric label="60 Days History" value={mockAnalytics.avg_60_days} />
                                            <SmallMetric label="90 Days History" value={mockAnalytics.avg_90_days} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase block mb-3">Unique Rating (Distribution)</label>
                                    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
                                        {[5, 4, 3, 2, 1].map(stars => (
                                            <div key={stars} className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-slate-400 w-4">{stars}★</span>
                                                <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${((mockAnalytics.rating_distribution as any)[stars] / mockAnalytics.total_submissions) * 100}%` }}></div>
                                                </div>
                                                <span className="text-[9px] font-black text-slate-900">{(mockAnalytics.rating_distribution as any)[stars]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-indigo-900 text-white space-y-2">
                                    <p className="text-[9px] font-black text-indigo-200 tracking-widest uppercase">Unique Voters</p>
                                    <p className="text-3xl font-black">{mockAnalytics.unique_respondents}</p>
                                    <p className="text-[9px] font-bold text-indigo-300">Total volume: {mockAnalytics.total_submissions}</p>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 tracking-tight capitalize">Submission Intelligence (IP Tracking)</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Real-time data stream from frontend sensors</p>
                                    </div>
                                    <p className="text-[10px] font-black text-indigo-500 tracking-widest uppercase truncate ml-4">GET /api/v1/submissions/forms/{adminSelectedForm.id}/submissions</p>
                                </div>

                                <div className="flex-1 overflow-y-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md border-b border-slate-100 uppercase text-[9px] font-black tracking-widest text-slate-400 z-10">
                                            <tr>
                                                <th className="px-8 py-5">Customer info</th>
                                                <th className="px-6 py-5">IP Address</th>
                                                <th className="px-6 py-5 text-center">Satisfaction</th>
                                                <th className="px-6 py-5">Feed Details</th>
                                                <th className="px-8 py-5 text-right">Submitted</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {mockSubmissions.map(sub => (
                                                <tr key={sub.id} className="hover:bg-indigo-50/10 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs">
                                                                {sub.customer_name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-slate-900 leading-none">{sub.customer_name}</p>
                                                                <p className="text-[10px] font-medium text-slate-400 mt-1">{sub.customer_email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-center gap-2 text-indigo-600">
                                                            <Globe size={14} className="text-indigo-300" />
                                                            <span className="text-[10px] font-black uppercase tracking-wider">{sub.ip_address}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex justify-center gap-0.5">
                                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className={s <= sub.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'} />)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="p-3 bg-slate-50 rounded-xl text-[11px] font-medium text-slate-600 max-w-xs line-clamp-1 border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                                                            {sub.feedback}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right text-[10px] font-black text-slate-400">
                                                        {new Date(sub.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SmallMetric = ({ label, value }: { label: string, value: number }) => (
    <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
        <span className="font-black text-slate-900 text-sm">{value.toFixed(1)} <span className="text-[9px] text-amber-500">★</span></span>
    </div>
);

const NavItem = ({ icon, label, active = false, onClick, className = "", collapsed = false }: any) => (
    <button
        onClick={onClick}
        className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${active
            ? "bg-indigo-600 text-white shadow-xl"
            : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
            } ${className}`}
    >
        {icon}
        {!collapsed && <span className="flex-1 text-left tracking-tight">{label}</span>}
    </button>
);

const DashboardView = ({ setActiveTab, setIsCreateModalOpen, onFormClick }: any) => (
    <div className="space-y-10 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-black tracking-tight">Main Hub</h2>
                <p className="text-slate-500 font-bold text-xs tracking-widest uppercase mt-1">GET /api/v1/reports/all/analytics</p>
            </div>
            <div className="flex gap-3">
                <Button variant="secondary" onClick={() => triggerBulkDownload(101)}><Download size={18} /> Master Excel Export (GET)</Button>
                <Button onClick={() => setIsCreateModalOpen(true)}>New Form (POST)</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard title="Submissions" value={mockAnalytics.total_submissions} icon={<MessageSquare />} trend="+12.5%" trendUp={true} color="indigo" />
            <StatCard title="Avg CSAT" value={mockAnalytics.total_avg_rating.toFixed(2)} icon={<Star />} trend="+0.44" trendUp={true} color="amber" />
            <StatCard title="Respondents" value={mockAnalytics.unique_respondents} icon={<Users />} trend="+2.1%" trendUp={true} color="emerald" />
            <StatCard title="Live Sensors" value={mockForms.length} icon={<FileText />} trend="Steady" trendUp={null} color="violet" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            <Card className="xl:col-span-2">
                <h3 className="text-xl font-black tracking-tight mb-10 underline decoration-indigo-500 decoration-4 underline-offset-8">Submission Activity</h3>
                <div className="h-64 flex items-end justify-between gap-3">
                    {[40, 65, 45, 90, 75, 55, 100, 80, 60, 95].map((h, i) => (
                        <div key={i} className="flex-1 bg-indigo-50 rounded-lg relative overflow-hidden h-full flex items-end">
                            <div className="w-full bg-indigo-600 rounded-lg transition-all" style={{ height: `${h}%` }}></div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card noPadding>
                <div className="p-8 border-b border-slate-100 shrink-0">
                    <h3 className="text-xl font-black tracking-tight">Active Sensors (GET)</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Live data collection points</p>
                </div>
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                    {mockForms.map(form => (
                        <div key={form.id} className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => onFormClick(form)}>
                            <span className="font-bold text-slate-700 group-hover:text-indigo-600">{form.title}</span>
                            <Badge variant="success">ID {form.id}</Badge>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </div>
);

const FormsView = ({ setActiveTab, setIsCreateModalOpen, onFormClick }: any) => (
    <div className="space-y-10 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-indigo-600">Form Sensor Management</h2>
                <p className="text-slate-400 font-bold text-xs tracking-widest uppercase mt-2">GET /api/v1/forms/</p>
            </div>
            <Button className="rounded-2xl" onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={20} /> Create New Sensor (POST)
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockForms.map(form => (
                <Card key={form.id} className="group hover:border-indigo-400 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <Badge variant="primary">GET /api/v1/forms/{form.id}</Badge>
                        <button className="text-slate-300 hover:text-slate-900"><MoreVertical size={20} /></button>
                    </div>
                    <h4 className="text-2xl font-black mb-2">{form.title}</h4>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed line-clamp-2">{form.description}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">CREATED: {new Date(form.created_at).toLocaleDateString()}</span>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => onFormClick(form)}><Eye size={16} /> Analysis</Button>
                            <Button variant="outline" size="sm" onClick={() => setActiveTab('feedbacks')}>Feed</Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
);

const FeedbacksView = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
        <div>
            <h2 className="text-3xl font-black tracking-tight text-indigo-600">Signal Influx Feed</h2>
            <p className="text-slate-400 font-bold text-xs tracking-widest uppercase mt-2">Route: GET /api/v1/submissions/forms/{"{id}"}/submissions</p>
        </div>
        <Card noPadding>
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] font-black tracking-widest text-slate-400">
                    <tr>
                        <th className="px-8 py-6">Customer</th>
                        <th className="px-6 py-6">Rating</th>
                        <th className="px-6 py-6">Feedback</th>
                        <th className="px-6 py-6 text-center">Screenshot</th>
                        <th className="px-8 py-6 text-right">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {mockSubmissions.map(sub => (
                        <tr key={sub.id} className="hover:bg-indigo-50/20 transition-colors">
                            <td className="px-8 py-6">
                                <p className="font-black text-slate-900 leading-none">{sub.customer_name}</p>
                                <p className="text-[10px] font-bold text-indigo-500 mt-1.5 uppercase">{sub.ip_address}</p>
                            </td>
                            <td className="px-6 py-6">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className={s <= sub.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />)}
                                </div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="p-3 bg-slate-50 rounded-2xl text-xs font-medium text-slate-600 max-w-sm line-clamp-2">{sub.feedback}</div>
                            </td>
                            <td className="px-6 py-6 text-center">
                                {sub.screenshot_url ? <Badge variant="primary">VIEW</Badge> : <span className="text-[10px] text-slate-300 font-bold">N/A</span>}
                            </td>
                            <td className="px-8 py-6 text-right text-xs font-black text-slate-900">
                                {new Date(sub.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

const ReportsView = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
        <div>
            <h2 className="text-3xl font-black bg-indigo-600 text-white px-8 py-4 rounded-[32px] inline-block shadow-lg">Executive Reports (GET)</h2>
            <p className="text-slate-400 font-bold text-xs tracking-widest uppercase mt-4 ml-2">Total Avg + 30/60/90 Days History + Unique Distribution</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Card className="bg-indigo-900 text-white border-none shadow-2xl p-10">
                <h3 className="text-xl font-black mb-10 text-indigo-200 uppercase tracking-widest border-b border-indigo-800 pb-4">Rating Distribution (Unique)</h3>
                <div className="space-y-8">
                    {[5, 4, 3, 2, 1].map(stars => {
                        const count = (mockAnalytics.rating_distribution as any)[stars];
                        const percentage = (count / mockAnalytics.total_submissions) * 100;
                        return (
                            <div key={stars} className="space-y-2">
                                <div className="flex justify-between text-xs font-black uppercase tracking-tighter">
                                    <span className="flex items-center gap-2 text-indigo-100"><Star size={14} className="fill-amber-400 text-amber-400" /> {stars} Star Satisfaction</span>
                                    <span>{count} Respondents</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full shadow-lg" style={{ width: `${percentage}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <div className="space-y-8">
                <Card className="p-10 border-indigo-100 bg-white/50 backdrop-blur-sm">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Performance Timeline</h3>
                    <div className="grid grid-cols-2 gap-10">
                        <MetricDetail label="Total Average" value={mockAnalytics.total_avg_rating} color="indigo" />
                        <MetricDetail label="30 Day Avg" value={mockAnalytics.avg_30_days} color="emerald" />
                        <MetricDetail label="60 Day Avg" value={mockAnalytics.avg_60_days} color="amber" />
                        <MetricDetail label="90 Day Avg" value={mockAnalytics.avg_90_days} color="violet" />
                    </div>
                </Card>

                <div className="bg-indigo-50 border border-indigo-100 rounded-[40px] p-8 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total Sentiment Sample</p>
                        <p className="text-3xl font-black text-indigo-900 mt-1">{mockAnalytics.total_submissions} <Users className="inline-block ml-2 opacity-20" size={24} /></p>
                    </div>
                    <Button variant="primary" className="rounded-2xl px-8 h-12 text-[10px] uppercase">Download Detailed Dataset</Button>
                </div>
            </div>
        </div>
    </div>
);

const MetricDetail = ({ label, value, color }: any) => {
    const colors = {
        indigo: 'text-indigo-600',
        emerald: 'text-emerald-600',
        amber: 'text-amber-600',
        violet: 'text-violet-600'
    };
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className={`text-4xl font-black ${colors[color as keyof typeof colors]}`}>{value.toFixed(2)}</p>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend, trendUp, color }: any) => {
    const colors = {
        indigo: { light: 'bg-indigo-50', text: 'text-indigo-600' },
        amber: { light: 'bg-amber-50', text: 'text-amber-600' },
        emerald: { light: 'bg-emerald-50', text: 'text-emerald-600' },
        violet: { light: 'bg-violet-50', text: 'text-violet-600' },
    };
    const c = colors[color as keyof typeof colors];
    return (
        <Card className="hover:translate-y-[-4px] transition-all">
            <div className="flex items-center justify-between mb-8">
                <div className={`${c.light} p-3 rounded-2xl ${c.text}`}>{icon}</div>
                {trendUp !== null && <Badge variant={trendUp ? 'success' : 'error'}>{trend}</Badge>}
            </div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</h3>
            <p className="text-3xl font-black text-slate-900 mt-2">{value}</p>
        </Card>
    );
};

const MetricBox = ({ label, value, trend, positive }: any) => (
    <Card className="flex flex-col items-center justify-center text-center p-8">
        <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2 block">{label}</span>
        <span className="text-4xl font-black text-slate-900 block mb-4">{value.toFixed(1)}</span>
        <Badge variant={positive ? 'success' : 'error'}>{trend}</Badge>
    </Card>
);

export default App;
