import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  Kanban, 
  Search, 
  Filter, 
  Plus, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  RefreshCw, 
  Send, 
  Tag, 
  ChevronRight, 
  X,
  FileText,
  Briefcase,
  AlertCircle,
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Contact, Company, CurrencyCode, LeadScoreCategory, DiscoveredLead } from '../types.js';
import { formatCurrency, getScoreBadgeStyles, getVerificationBadgeStyles } from '../utils/formatters.js';

interface CRMViewProps {
  contacts: Contact[];
  companies: Company[];
  currency: CurrencyCode;
  onUpdateContact: (id: string, updates: Partial<Contact>) => void;
  onCreateContact: (contact: Partial<Contact>) => void;
  onRescoreContact: (id: string) => Promise<void>;
  onEnrollInCampaign: (contact: Contact) => void;
  onLaunchMassPitchForContacts?: (contacts: Contact[]) => void;
  onVerifyContactsBulk?: (emails: string[]) => void;
  onAuditContactEmail?: (contact: Contact) => void;
  onNavigateTab?: (tab: string) => void;
}

export const CRMView: React.FC<CRMViewProps> = ({
  contacts,
  companies,
  currency,
  onUpdateContact,
  onCreateContact,
  onRescoreContact,
  onEnrollInCampaign,
  onLaunchMassPitchForContacts,
  onVerifyContactsBulk,
  onAuditContactEmail,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'companies' | 'kanban'>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  // Contact 360 Drawer state
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isRescoring, setIsRescoring] = useState(false);
  const [newNote, setNewNote] = useState('');

  // New Contact Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newContactForm, setNewContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    seniority: 'Manager',
    country: 'Nigeria',
    city: 'Lagos',
    status: 'LEAD' as const,
  });

  const toggleSelectContact = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedContactIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    if (selectedContactIds.length === filteredContacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(filteredContacts.map(c => c.id));
    }
  };

  const getSelectedContacts = () => {
    return contacts.filter(c => selectedContactIds.includes(c.id));
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'DISCOVERED' 
        ? (c.tags?.includes('lead-discovery') || c.scores.intentSignals?.some(s => s.toLowerCase().includes('discovery')))
        : c.status === statusFilter);
    const matchesCategory = categoryFilter === 'ALL' || c.scores.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleRescore = async (contactId: string) => {
    setIsRescoring(true);
    try {
      await onRescoreContact(contactId);
      // Refresh local selected
      const updated = contacts.find(c => c.id === contactId);
      if (updated) setSelectedContact(updated);
    } finally {
      setIsRescoring(false);
    }
  };

  const handleAddNote = (contactId: string) => {
    if (!newNote.trim() || !selectedContact) return;
    const updatedNotes = [...(selectedContact.notes || []), newNote.trim()];
    onUpdateContact(contactId, { notes: updatedNotes });
    setSelectedContact({ ...selectedContact, notes: updatedNotes });
    setNewNote('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateContact(newContactForm);
    setIsAddModalOpen(false);
    setNewContactForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyName: '',
      jobTitle: '',
      seniority: 'Manager',
      country: 'Nigeria',
      city: 'Lagos',
      status: 'LEAD',
    });
  };

  const kanbanColumns: { status: Contact['status']; label: string; color: string }[] = [
    { status: 'LEAD', label: 'Discovered Leads', color: 'border-slate-300' },
    { status: 'MQL', label: 'Marketing Qualified (MQL)', color: 'border-sky-400' },
    { status: 'SQL', label: 'Sales Qualified (SQL)', color: 'border-indigo-500' },
    { status: 'OPPORTUNITY', label: 'Active Opportunities', color: 'border-amber-500' },
    { status: 'CUSTOMER', label: 'Won Customers', color: 'border-emerald-500' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">CRM & Contact 360</h1>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
              4D AI Intent Scoring
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Unified multi-tenant records with autonomous predictive scoring, engagement timelines & conversion pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Sub-view switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              id="crm-view-contacts-tab"
              onClick={() => setActiveTab('contacts')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'contacts'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Contacts</span>
            </button>
            <button
              id="crm-view-companies-tab"
              onClick={() => setActiveTab('companies')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'companies'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Companies</span>
            </button>
            <button
              id="crm-view-kanban-tab"
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Kanban Board</span>
            </button>
          </div>

          <button
            id="create-contact-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            id="crm-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, email, company..."
            className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <select
            id="crm-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Lifecycle Stages</option>
            <option value="DISCOVERED">⭐ Imported from Lead Discovery</option>
            <option value="LEAD">Leads</option>
            <option value="MQL">MQLs</option>
            <option value="SQL">SQLs</option>
            <option value="OPPORTUNITY">Opportunities</option>
            <option value="CUSTOMER">Customers</option>
          </select>

          {/* Score Category Filter */}
          <select
            id="crm-category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Score Bands</option>
            <option value="HOT">🔥 HOT (Intent &gt; 80)</option>
            <option value="WARM">⚡ WARM (Intent 50-79)</option>
            <option value="COLD">❄️ COLD (Intent &lt; 50)</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Sticky Toolbar */}
      {selectedContactIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shadow-lg border border-slate-700 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="h-6 px-2.5 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">
              {selectedContactIds.length}
            </span>
            <span className="text-xs font-medium text-slate-200">
              contacts selected
            </span>
            <button
              onClick={() => setSelectedContactIds([])}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="crm-bulk-masspitch-btn"
              onClick={() => {
                const selected = getSelectedContacts();
                if (onLaunchMassPitchForContacts) {
                  onLaunchMassPitchForContacts(selected);
                } else if (onNavigateTab) {
                  onNavigateTab('masspitch');
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span>1-Click Mass Pitch ({selectedContactIds.length})</span>
            </button>

            <button
              id="crm-bulk-verify-btn"
              onClick={() => {
                const emails = getSelectedContacts().map(c => c.email);
                if (onVerifyContactsBulk) {
                  onVerifyContactsBulk(emails);
                } else if (onNavigateTab) {
                  onNavigateTab('verify');
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Verify Deliverability</span>
            </button>

            <button
              id="crm-bulk-campaign-btn"
              onClick={() => {
                const first = getSelectedContacts()[0];
                if (first) onEnrollInCampaign(first);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Send className="h-3.5 w-3.5 text-indigo-400" />
              <span>Enroll in Campaign Studio</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'contacts' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredContacts.length > 0 && selectedContactIds.length === filteredContacts.length}
                      onChange={selectAllFiltered}
                      className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Company & Location</th>
                  <th className="py-3 px-4">Lifecycle Stage</th>
                  <th className="py-3 px-4">4D AI Score</th>
                  <th className="py-3 px-4">Deliverability</th>
                  <th className="py-3 px-4">LTV Revenue</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-3 text-center" onClick={(e) => toggleSelectContact(contact.id, e)}>
                      <input
                        type="checkbox"
                        checked={selectedContactIds.includes(contact.id)}
                        onChange={() => {}}
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {contact.firstName} {contact.lastName}
                        </span>
                        {contact.tags?.includes('lead-discovery') && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[9px] font-bold uppercase tracking-wider">
                            From Lead Discovery
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {contact.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {contact.companyName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {contact.jobTitle} • {contact.city}, {contact.country}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {contact.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getScoreBadgeStyles(contact.scores.category)}`}>
                          {contact.scores.category} ({contact.scores.intentScore})
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getVerificationBadgeStyles(contact.emailVerification?.status || 'VALID')}`}>
                        {contact.emailVerification?.status || 'VALID'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(contact.revenueTotal, currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContact(contact);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400"
                      >
                        Contact 360 →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kanban View */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colContacts = filteredContacts.filter(c => c.status === col.status);
            return (
              <div key={col.status} className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col space-y-3 min-w-[220px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{col.label}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600">
                    {colContacts.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto max-h-[650px]">
                  {colContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500 cursor-pointer space-y-2 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getScoreBadgeStyles(contact.scores.category)}`}>
                          {contact.scores.category} {contact.scores.intentScore}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(contact.revenueTotal, currency)}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          {contact.firstName} {contact.lastName}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">{contact.companyName}</p>
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span>{contact.city}, {contact.country}</span>
                        <span>{contact.timeline?.length || 0} events</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Companies View */}
      {activeTab === 'companies' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Industry</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Employees</th>
                  <th className="py-3 px-4">Tech Stack</th>
                  <th className="py-3 px-4">Total Attributed Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {companies.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {comp.name}
                      <span className="block text-[11px] text-slate-400 font-normal">{comp.domain}</span>
                    </td>
                    <td className="py-3.5 px-4">{comp.industry}</td>
                    <td className="py-3.5 px-4">{comp.city}, {comp.country}</td>
                    <td className="py-3.5 px-4">{comp.employeeRange}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {comp.techStack.map((t, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(comp.totalRevenue, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contact 360 Slide-over Drawer */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                  {selectedContact.firstName.charAt(0)}{selectedContact.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedContact.jobTitle} at <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedContact.companyName}</span></p>
                </div>
              </div>

              <button
                id="close-contact-drawer-btn"
                onClick={() => setSelectedContact(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* 4D AI Score Intelligence Matrix */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white border border-indigo-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">4D AI Score Intelligence</span>
                  </div>
                  <button
                    id="rescore-contact-btn"
                    onClick={() => handleRescore(selectedContact.id)}
                    disabled={isRescoring}
                    className="text-[11px] font-semibold text-indigo-300 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRescoring ? 'animate-spin' : ''}`} />
                    <span>Re-calculate</span>
                  </button>
                </div>

                {/* 4 Scores Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                    <span className="text-[10px] text-slate-300 uppercase block">Lead Fit</span>
                    <span className="text-xl font-bold text-emerald-400">{selectedContact.scores.leadFitScore}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                    <span className="text-[10px] text-slate-300 uppercase block">Engagement</span>
                    <span className="text-xl font-bold text-sky-400">{selectedContact.scores.engagementScore}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                    <span className="text-[10px] text-slate-300 uppercase block">Buying Intent</span>
                    <span className="text-xl font-bold text-amber-400">{selectedContact.scores.intentScore}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                    <span className="text-[10px] text-slate-300 uppercase block">Customer Value</span>
                    <span className="text-xl font-bold text-purple-400">{selectedContact.scores.customerValueScore}%</span>
                  </div>
                </div>

                {/* Intent Signals */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-indigo-300">Intent Signals Detected:</span>
                  <div className="space-y-1">
                    {selectedContact.scores.intentSignals.map((sig, i) => (
                      <div key={i} className="text-xs text-slate-200 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span>{sig}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Action */}
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[10px] uppercase font-bold text-amber-300">AI Next Best Action:</span>
                  <p className="text-xs font-semibold text-white mt-0.5">{selectedContact.scores.recommendedAction}</p>
                </div>
              </div>

              {/* Contact Meta Details */}
              <div className="space-y-3 text-xs">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">Contact Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase">Email</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200 font-mono truncate">{selectedContact.email}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase">Phone / WhatsApp</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{selectedContact.phone || 'N/A'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase">Location</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{selectedContact.city}, {selectedContact.country}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase">Attributed Revenue</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(selectedContact.revenueTotal, currency)}</p>
                  </div>
                </div>
              </div>

              {/* Engagement Timeline */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
                  Chronological Activity Timeline ({selectedContact.timeline?.length || 0})
                </h4>
                <div className="space-y-2.5 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-4">
                  {(selectedContact.timeline || []).map((event) => (
                    <div key={event.id} className="relative text-xs space-y-0.5">
                      <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{event.title}</span>
                        <span className="text-[10px] text-slate-400">{new Date(event.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">Internal Notes</h4>
                <div className="space-y-2">
                  {(selectedContact.notes || []).map((note, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                      {note}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    id="add-contact-note-input"
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add team note..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                  <button
                    id="add-contact-note-btn"
                    onClick={() => handleAddNote(selectedContact.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="drawer-masspitch-btn"
                  onClick={() => {
                    if (onLaunchMassPitchForContacts) {
                      onLaunchMassPitchForContacts([selectedContact]);
                    } else if (onNavigateTab) {
                      onNavigateTab('masspitch');
                    }
                    setSelectedContact(null);
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>1-Click Mass Pitch</span>
                </button>

                <button
                  id="drawer-audit-btn"
                  onClick={() => {
                    if (onAuditContactEmail) {
                      onAuditContactEmail(selectedContact);
                    } else if (onNavigateTab) {
                      onNavigateTab('spamaudit');
                    }
                    setSelectedContact(null);
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Audit in Spam Lab</span>
                </button>
              </div>

              <button
                id="enroll-campaign-drawer-btn"
                onClick={() => {
                  onEnrollInCampaign(selectedContact);
                  setSelectedContact(null);
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Launch AI Sequence in Campaign Studio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Add New CRM Contact</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newContactForm.firstName}
                    onChange={(e) => setNewContactForm({ ...newContactForm, firstName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newContactForm.lastName}
                    onChange={(e) => setNewContactForm({ ...newContactForm, lastName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newContactForm.email}
                  onChange={(e) => setNewContactForm({ ...newContactForm, email: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newContactForm.companyName}
                    onChange={(e) => setNewContactForm({ ...newContactForm, companyName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newContactForm.jobTitle}
                    onChange={(e) => setNewContactForm({ ...newContactForm, jobTitle: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Country</label>
                  <input
                    type="text"
                    value={newContactForm.country}
                    onChange={(e) => setNewContactForm({ ...newContactForm, country: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">City</label>
                  <input
                    type="text"
                    value={newContactForm.city}
                    onChange={(e) => setNewContactForm({ ...newContactForm, city: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs"
                >
                  Save & AI-Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
