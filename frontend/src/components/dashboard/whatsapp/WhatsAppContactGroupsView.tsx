"use client";

import { useState } from "react";
import type { WhatsAppContact, WhatsAppContactGroup } from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";

interface WhatsAppContactGroupsViewProps {
  groups: WhatsAppContactGroup[];
  contacts: WhatsAppContact[];
  onRefresh: () => void;
  onNavigateToCampaign?: (groupId: string) => void;
}

export function WhatsAppContactGroupsView({
  groups,
  contacts,
  onRefresh,
  onNavigateToCampaign,
}: WhatsAppContactGroupsViewProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Add group state
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupColor, setGroupColor] = useState("#118778");
  const [busyGroup, setBusyGroup] = useState(false);

  // Add contact state
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTargetGroup, setContactTargetGroup] = useState("");
  const [contactTags, setContactTags] = useState("");
  const [busyContact, setBusyContact] = useState(false);

  // Import CSV state
  const [importText, setImportText] = useState("");
  const [importGroupId, setImportGroupId] = useState("");
  const [busyImport, setBusyImport] = useState(false);

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phoneNumber.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()));

    const matchesGroup =
      selectedGroupId === "ALL" ||
      c.groupIds.some((g) => (typeof g === "string" ? g === selectedGroupId : g._id === selectedGroupId));

    return matchesSearch && matchesGroup;
  });

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!groupName.trim()) return;
    setBusyGroup(true);
    try {
      await whatsappApi.createContactGroup({
        name: groupName.trim(),
        description: groupDesc.trim(),
        color: groupColor,
      });
      setShowAddGroupModal(false);
      setGroupName("");
      setGroupDesc("");
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create group");
    } finally {
      setBusyGroup(false);
    }
  }

  async function handleDeleteGroup(id: string) {
    if (!window.confirm("Delete this contact group? Contacts in this group will remain.")) return;
    try {
      await whatsappApi.deleteContactGroup(id);
      if (selectedGroupId === id) setSelectedGroupId("ALL");
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete group");
    }
  }

  async function handleCreateContact(e: React.FormEvent) {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;
    setBusyContact(true);
    try {
      await whatsappApi.createContact({
        name: contactName.trim(),
        phoneNumber: contactPhone.trim(),
        email: contactEmail.trim(),
        groupIds: contactTargetGroup ? [contactTargetGroup] : [],
        tags: contactTags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setShowAddContactModal(false);
      setContactName("");
      setContactPhone("");
      setContactEmail("");
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add contact");
    } finally {
      setBusyContact(false);
    }
  }

  async function handleImportCSV(e: React.FormEvent) {
    e.preventDefault();
    if (!importText.trim()) return;
    setBusyImport(true);
    try {
      // Simple parser for CSV text: name, phone, email, tags
      const lines = importText.split("\n").map((l) => l.trim()).filter(Boolean);
      const parsed = lines.map((line) => {
        const parts = line.split(",").map((p) => p.trim());
        return {
          name: parts[0] || "Contact",
          phoneNumber: parts[1] || "",
          email: parts[2] || "",
          tags: parts[3] ? [parts[3]] : ["CSV Import"],
        };
      }).filter((p) => p.phoneNumber);

      await whatsappApi.importContacts(parsed, importGroupId || undefined);
      setShowImportModal(false);
      setImportText("");
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to import contacts");
    } finally {
      setBusyImport(false);
    }
  }

  async function handleDeleteContact(id: string) {
    if (!window.confirm("Remove this contact?")) return;
    try {
      await whatsappApi.deleteContact(id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete contact");
    }
  }

  return (
    <div className="whatsapp-contacts space-y-5">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dbe4e1] bg-white p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#14231f]">Audience Segments</span>
          <span className="rounded-md bg-[#f0f5f3] px-2 py-0.5 text-[10px] font-bold text-[#52645f]">
            {groups.length} Groups · {contacts.length} Contacts
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#dbe4e1] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#52645f] shadow-xs hover:bg-[#f4f7f6]"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import CSV
          </button>
          <button
            type="button"
            onClick={() => setShowAddContactModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#dbe4e1] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#52645f] shadow-xs hover:bg-[#f4f7f6]"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Contact
          </button>
          <button
            type="button"
            onClick={() => setShowAddGroupModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#118778] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0e7467]"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Group
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((grp) => {
          const isSelected = selectedGroupId === grp._id;
          return (
            <div
              key={grp._id}
              onClick={() => setSelectedGroupId(isSelected ? "ALL" : grp._id)}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedGroupId(isSelected ? "ALL" : grp._id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`Filter contacts by ${grp.name}`}
              className={`group relative cursor-pointer rounded-2xl border p-4 transition ${
                isSelected
                  ? "border-[#118778] bg-[#f4faf8] shadow-sm ring-1 ring-[#118778]/30"
                  : "border-[#dbe4e1] bg-white hover:border-[#b7cbcf] hover:shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: grp.color || "#118778" }}
                  />
                  <h3 className="font-semibold text-sm text-[#14231f]">{grp.name}</h3>
                </div>
                <button
                  title="Delete group"
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleDeleteGroup(grp._id);
                  }}
                  className="opacity-0 transition group-hover:opacity-100 rounded-md p-1 text-[#84938f] hover:bg-rose-50 hover:text-rose-600"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="mt-1 text-xs text-[#60716c] line-clamp-1">{grp.description || "Custom segment"}</p>

              <div className="mt-4 flex items-center justify-between border-t border-[#f0f4f3] pt-2">
                <span className="text-xs font-bold text-[#20342e]">
                  {grp.contactCount || 0} <span className="font-normal text-[#84938f]">contacts</span>
                </span>
                {onNavigateToCampaign && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToCampaign(grp._id);
                    }}
                    className="text-[11px] font-semibold text-[#118778] hover:underline"
                  >
                    Broadcast →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Table Section */}
      <div className="rounded-3xl border border-[#dbe4e1] bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-[#e5e7ef] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#84938f]">
              Showing Contacts:
            </span>
            <span className="rounded-lg bg-[#f0f4f3] px-2.5 py-1 text-xs font-semibold text-[#118778]">
              {selectedGroupId === "ALL" ? "All Groups" : groups.find((g) => g._id === selectedGroupId)?.name}
            </span>
            <span className="text-xs text-[#84938f]">({filteredContacts.length} found)</span>
          </div>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, email..."
              className="w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-1.5 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Contacts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#eceef4] bg-[#fafbfe] text-[10px] font-semibold uppercase tracking-wider text-[#85889b]">
              <tr>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Phone Number</th>
                <th className="px-5 py-3">Groups</th>
                <th className="px-5 py-3">Tags</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef4]">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#84938f]">
                    No contacts found in this group.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-[#fafcfb]">
                    <td className="px-5 py-3 font-semibold text-[#14231f]">
                      <div>{contact.name}</div>
                      {contact.email && (
                        <div className="text-[10px] text-[#84938f]">{contact.email}</div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono text-[#445550]">
                      +{contact.phoneNumber}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.groupIds.map((g, idx) => {
                          const grpObj = typeof g === "object" ? g : groups.find((item) => item._id === g);
                          return (
                            <span
                              key={idx}
                              className="rounded-md bg-[#eef3f1] px-2 py-0.5 text-[10px] font-medium text-[#445550]"
                            >
                              {grpObj?.name || "Group"}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="rounded-md border border-[#dbe4e1] bg-white px-1.5 py-0.5 text-[10px] text-[#60716c]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => void handleDeleteContact(contact._id)}
                        className="rounded-lg p-1 text-[#84938f] hover:bg-rose-50 hover:text-rose-600"
                        title="Delete contact"
                      >
                        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Group Modal */}
      {showAddGroupModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#dbe4e1] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7ef] pb-3">
              <h3 className="text-base font-bold text-[#14231f]">New Contact Group</h3>
              <button onClick={() => setShowAddGroupModal(false)} className="rounded-lg p-1 text-[#84938f] hover:bg-[#f4f7f6]">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#445550]">Group Name</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. VIP Clinic Patients"
                  className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#445550]">Description</label>
                <input
                  type="text"
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  placeholder="Brief purpose of this segment"
                  className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#445550]">Color Tag</label>
                <div className="mt-2 flex gap-2">
                  {["#118778", "#059669", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setGroupColor(color)}
                      className={`size-6 rounded-full border-2 ${groupColor === color ? "border-[#14231f] scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-[#e5e7ef] pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddGroupModal(false)}
                  className="rounded-xl border border-[#dbe4e1] px-4 py-2 text-xs font-semibold text-[#52645f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyGroup}
                  className="rounded-xl bg-[#118778] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0e7467] disabled:opacity-50"
                >
                  {busyGroup ? "Creating..." : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#dbe4e1] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7ef] pb-3">
              <h3 className="text-base font-bold text-[#14231f]">Add Contact</h3>
              <button onClick={() => setShowAddContactModal(false)} className="rounded-lg p-1 text-[#84938f] hover:bg-[#f4f7f6]">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateContact} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#445550]">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#445550]">
                  Phone Number (with Country Code)
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#445550]">Email (Optional)</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#445550]">Assign to Group</label>
                <select
                  value={contactTargetGroup}
                  onChange={(e) => setContactTargetGroup(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                >
                  <option value="">Select a group (optional)</option>
                  {groups.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#445550]">Tags (comma separated)</label>
                <input
                  type="text"
                  value={contactTags}
                  onChange={(e) => setContactTags(e.target.value)}
                  placeholder="e.g. Lead, Inbound, Clinic"
                  className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-[#e5e7ef] pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="rounded-xl border border-[#dbe4e1] px-4 py-2 text-xs font-semibold text-[#52645f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyContact}
                  className="rounded-xl bg-[#118778] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0e7467] disabled:opacity-50"
                >
                  {busyContact ? "Saving..." : "Save Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#dbe4e1] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7ef] pb-3">
              <h3 className="text-base font-bold text-[#14231f]">Bulk Import Contacts</h3>
              <button onClick={() => setShowImportModal(false)} className="rounded-lg p-1 text-[#84938f] hover:bg-[#f4f7f6]">
                ✕
              </button>
            </div>
            <form onSubmit={handleImportCSV} className="mt-4 space-y-4">
              <p className="text-xs text-[#60716c]">
                Paste rows formatted as: <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">Name, Phone, Email, Tag</code>
              </p>
              <div>
                <label className="block text-xs font-semibold text-[#445550]">Default Group</label>
                <select
                  value={importGroupId}
                  onChange={(e) => setImportGroupId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                >
                  <option value="">None (assign later)</option>
                  {groups.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#445550]">CSV Data (One contact per line)</label>
                <textarea
                  rows={5}
                  required
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Rajesh Kumar, 919876543210, rajesh@example.com, VIP&#10;Sneha Roy, 919876543211, sneha@example.com, Lead"
                  className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] p-3 font-mono text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-[#e5e7ef] pt-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="rounded-xl border border-[#dbe4e1] px-4 py-2 text-xs font-semibold text-[#52645f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyImport}
                  className="rounded-xl bg-[#118778] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0e7467] disabled:opacity-50"
                >
                  {busyImport ? "Importing..." : "Start Import"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

