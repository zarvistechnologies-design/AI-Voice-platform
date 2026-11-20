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

  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [busyGroup, setBusyGroup] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTargetGroup, setContactTargetGroup] = useState("");
  const [contactTags, setContactTags] = useState("");
  const [busyContact, setBusyContact] = useState(false);

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
        color: "#171717",
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
      const lines = importText.split("\n").map((l) => l.trim()).filter(Boolean);
      const parsed = lines
        .map((line) => {
          const parts = line.split(",").map((p) => p.trim());
          return {
            name: parts[0] || "Contact",
            phoneNumber: parts[1] || "",
            email: parts[2] || "",
            tags: parts[3] ? [parts[3]] : ["CSV Import"],
          };
        })
        .filter((p) => p.phoneNumber);

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
    <div className="whatsapp-contacts space-y-4">
      {/* Compact Top Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts by name, phone, email..."
            className="h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] placeholder:text-[#71717a] focus:border-[#171717] focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#171717] transition hover:bg-[#f4f4f5] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            Import CSV
          </button>
          <button
            type="button"
            onClick={() => setShowAddContactModal(true)}
            className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#171717] transition hover:bg-[#f4f4f5] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            Add Contact
          </button>
          <button
            type="button"
            onClick={() => setShowAddGroupModal(true)}
            className="inline-flex h-8 items-center rounded-md bg-[#171717] px-3 text-[12.5px] font-medium text-white transition hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            + New Group
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout: Groups Sidebar + Contacts Table */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Left: Compact Segments List */}
        <aside className="grid gap-2">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="m-0 text-[13px] font-semibold text-[#171717] dark:text-white">
              Groups <span className="ml-1 font-normal text-[#71717a] dark:text-zinc-400">{groups.length}</span>
            </h2>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white divide-y divide-[#eaeaea] dark:border-zinc-800 dark:bg-[#121215] dark:divide-zinc-800">
            <button
              type="button"
              onClick={() => setSelectedGroupId("ALL")}
              className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-[12.5px] transition ${
                selectedGroupId === "ALL"
                  ? "bg-[#171717] font-medium text-white dark:bg-white dark:text-black"
                  : "text-[#171717] hover:bg-[#fafafa] dark:text-zinc-200 dark:hover:bg-zinc-800/60"
              }`}
            >
              <span>All Contacts</span>
              <span className={`tabular-nums text-[11.5px] ${selectedGroupId === "ALL" ? "text-white/80 dark:text-black/70" : "text-[#71717a] dark:text-zinc-400"}`}>
                {contacts.length}
              </span>
            </button>

            {groups.map((grp) => {
              const isSelected = selectedGroupId === grp._id;
              return (
                <div
                  key={grp._id}
                  onClick={() => setSelectedGroupId(isSelected ? "ALL" : grp._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedGroupId(isSelected ? "ALL" : grp._id);
                    }
                  }}
                  className={`group flex cursor-pointer items-center justify-between gap-2 px-3.5 py-2.5 text-[12.5px] transition ${
                    isSelected ? "bg-[#171717] font-medium text-white dark:bg-white dark:text-black" : "text-[#171717] hover:bg-[#fafafa] dark:text-zinc-200 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{grp.name}</div>
                    {onNavigateToCampaign && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToCampaign(grp._id);
                        }}
                        className={`mt-0.5 text-[11px] hover:underline ${
                          isSelected ? "text-white/80 dark:text-black/70" : "text-[#71717a] dark:text-zinc-400"
                        }`}
                      >
                        Broadcast →
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`tabular-nums text-[11.5px] ${isSelected ? "text-white/80 dark:text-black/70" : "text-[#71717a] dark:text-zinc-400"}`}>
                      {grp.contactCount || 0}
                    </span>
                    <button
                      type="button"
                      title="Delete group"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDeleteGroup(grp._id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 px-1 text-[11px] ${
                        isSelected ? "text-white/80 hover:text-white dark:text-black/70 dark:hover:text-black" : "text-[#71717a] hover:text-[#171717] dark:text-zinc-400 dark:hover:text-white"
                      }`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right: Contacts Table */}
        <div className="grid gap-2 min-w-0">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="m-0 text-[13px] font-semibold text-[#171717] dark:text-white">
              Contacts <span className="ml-1 font-normal text-[#71717a] dark:text-zinc-400">{filteredContacts.length}</span>
            </h2>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white dark:border-zinc-800 dark:bg-[#121215]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead className="border-b border-[#eaeaea] bg-[#fafafa] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#71717a] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-2.5">Contact</th>
                    <th className="px-4 py-2.5">Phone</th>
                    <th className="px-4 py-2.5">Groups</th>
                    <th className="px-4 py-2.5">Tags</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaeaea] dark:divide-zinc-800">
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-[12.5px] text-[#71717a] dark:text-zinc-400">
                        No contacts found in this group.
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-[#fafafa] dark:hover:bg-zinc-800/40">
                        <td className="px-4 py-2.5">
                          <strong className="block font-medium text-[#171717] dark:text-white">{contact.name}</strong>
                          {contact.email && (
                            <span className="block text-[11px] text-[#71717a] dark:text-zinc-400">{contact.email}</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[12px] text-[#52525b] dark:text-zinc-300">
                          +{contact.phoneNumber}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {contact.groupIds.map((g, idx) => {
                              const grpObj = typeof g === "object" ? g : groups.find((item) => item._id === g);
                              return (
                                <span
                                  key={idx}
                                  className="rounded border border-[#eaeaea] bg-[#fafafa] px-1.5 py-0.2 text-[11px] text-[#52525b] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                >
                                  {grpObj?.name || "Group"}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="rounded border border-[#eaeaea] bg-white px-1.5 py-0.2 text-[11px] text-[#52525b] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-[11px] font-medium text-[#171717] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                            <span className="size-1.5 rounded-full bg-[#171717] dark:bg-emerald-400" />
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => void handleDeleteContact(contact._id)}
                            className="grid size-7 ml-auto place-items-center rounded-md border border-transparent text-[#71717a] hover:border-[#eaeaea] hover:bg-white hover:text-[#171717] dark:text-zinc-500 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-rose-400"
                            title="Delete contact"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* New Group Modal */}
      {showAddGroupModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-[#121215]">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3 dark:border-zinc-800">
              <h3 className="m-0 text-[15px] font-semibold text-[#171717] dark:text-white">New Contact Group</h3>
              <button onClick={() => setShowAddGroupModal(false)} className="text-[#71717a] hover:text-[#171717] dark:text-zinc-400 dark:hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[12px] font-medium text-[#171717] dark:text-zinc-300">Group Name</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. VIP Clinic Patients"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#171717] dark:text-zinc-300">Description</label>
                <input
                  type="text"
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  placeholder="Brief purpose of this segment"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddGroupModal(false)}
                  className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#52525b] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyGroup}
                  className="inline-flex h-8 items-center rounded-md bg-[#171717] px-3.5 text-[12.5px] font-medium text-white hover:bg-black disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
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
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-[#121215]">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3 dark:border-zinc-800">
              <h3 className="m-0 text-[15px] font-semibold text-[#171717] dark:text-white">Add Contact</h3>
              <button onClick={() => setShowAddContactModal(false)} className="text-[#71717a] hover:text-[#171717] dark:text-zinc-400 dark:hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateContact} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[12px] font-medium text-[#171717] dark:text-zinc-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#171717] dark:text-zinc-300">
                  Phone Number (with Country Code)
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#171717] dark:text-zinc-300">Email (Optional)</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#171717] dark:text-zinc-300">Assign to Group</label>
                <select
                  value={contactTargetGroup}
                  onChange={(e) => setContactTargetGroup(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[13px] text-[#171717] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                >
                  <option value="" className="dark:bg-zinc-900 dark:text-white">Select a group (optional)</option>
                  {groups.map((g) => (
                    <option key={g._id} value={g._id} className="dark:bg-zinc-900 dark:text-white">
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#171717] dark:text-zinc-300">Tags (comma separated)</label>
                <input
                  type="text"
                  value={contactTags}
                  onChange={(e) => setContactTags(e.target.value)}
                  placeholder="e.g. Lead, Inbound, Clinic"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#52525b] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyContact}
                  className="inline-flex h-8 items-center rounded-md bg-[#171717] px-3.5 text-[12.5px] font-medium text-white hover:bg-black disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
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
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-[#121215]">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3 dark:border-zinc-800">
              <h3 className="m-0 text-[15px] font-semibold text-[#171717] dark:text-white">Bulk Import Contacts</h3>
              <button onClick={() => setShowImportModal(false)} className="text-[#71717a] hover:text-[#171717] dark:text-zinc-400 dark:hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleImportCSV} className="mt-4 space-y-3.5">
              <p className="text-[12px] text-[#71717a] dark:text-zinc-400">
                Paste rows formatted as: <code className="rounded bg-[#f4f4f5] dark:bg-zinc-800 dark:text-zinc-200 px-1 py-0.5 font-mono text-[#171717]">Name, Phone, Email, Tag</code>
              </p>
              <div>
                <label className="block text-[12px] font-medium text-[#171717] dark:text-zinc-300">Default Group</label>
                <select
                  value={importGroupId}
                  onChange={(e) => setImportGroupId(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[13px] text-[#171717] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                >
                  <option value="" className="dark:bg-zinc-900 dark:text-white">None (assign later)</option>
                  {groups.map((g) => (
                    <option key={g._id} value={g._id} className="dark:bg-zinc-900 dark:text-white">
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#171717] dark:text-zinc-300">CSV Data (One contact per line)</label>
                <textarea
                  rows={5}
                  required
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Rajesh Kumar, 919876543210, rajesh@example.com, VIP"
                  className="mt-1 w-full rounded-md border border-[#eaeaea] bg-white p-3 font-mono text-[12px] text-[#171717] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#52525b] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyImport}
                  className="inline-flex h-8 items-center rounded-md bg-[#171717] px-3.5 text-[12.5px] font-medium text-white hover:bg-black disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
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
