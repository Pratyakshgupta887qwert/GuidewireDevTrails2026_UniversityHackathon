import React, { useMemo, useState } from 'react';

const seedPolicies = [
  {
    id: 'POL-101',
    name: 'Starter Shield',
    weeklyPremium: 15,
    coverageLimit: 5000,
    triggers: 'Heavy Rainfall',
    status: 'Active',
  },
  {
    id: 'POL-102',
    name: 'Standard Shield',
    weeklyPremium: 25,
    coverageLimit: 10000,
    triggers: 'Heavy Rainfall, AQI Spike',
    status: 'Active',
  },
  {
    id: 'POL-103',
    name: 'Pro Shield',
    weeklyPremium: 35,
    coverageLimit: 16000,
    triggers: 'Heavy Rainfall, AQI Spike, Traffic Congestion',
    status: 'Active',
  },
];

const PolicyManagement = () => {
  const [policies, setPolicies] = useState(seedPolicies);
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState({
    name: '',
    weeklyPremium: '',
    coverageLimit: '',
    triggers: '',
    status: 'Active',
  });

  const activeCount = useMemo(() => policies.filter((policy) => policy.status === 'Active').length, [policies]);

  const resetForm = () => {
    setEditingId('');
    setForm({
      name: '',
      weeklyPremium: '',
      coverageLimit: '',
      triggers: '',
      status: 'Active',
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice('');

    if (!form.name || !form.weeklyPremium || !form.coverageLimit || !form.triggers) {
      setNotice('Please fill all policy fields before saving.');
      return;
    }

    if (editingId) {
      setPolicies((prev) =>
        prev.map((policy) =>
          policy.id === editingId
            ? {
                ...policy,
                name: form.name,
                weeklyPremium: Number(form.weeklyPremium),
                coverageLimit: Number(form.coverageLimit),
                triggers: form.triggers,
                status: form.status,
              }
            : policy,
        ),
      );
      setNotice('Policy updated successfully.');
      resetForm();
      return;
    }

    const nextPolicy = {
      id: `POL-${Math.floor(200 + Math.random() * 700)}`,
      name: form.name,
      weeklyPremium: Number(form.weeklyPremium),
      coverageLimit: Number(form.coverageLimit),
      triggers: form.triggers,
      status: form.status,
    };

    setPolicies((prev) => [nextPolicy, ...prev]);
    setNotice('New policy added successfully.');
    resetForm();
  };

  const handleEdit = (policy) => {
    setEditingId(policy.id);
    setForm({
      name: policy.name,
      weeklyPremium: String(policy.weeklyPremium),
      coverageLimit: String(policy.coverageLimit),
      triggers: policy.triggers,
      status: policy.status,
    });
  };

  const handleDelete = (id) => {
    setPolicies((prev) => prev.filter((policy) => policy.id !== id));
    if (editingId === id) {
      resetForm();
    }
    setNotice('Policy deleted.');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-sm font-semibold text-blue-700">Total Policies</p>
          <p className="mt-1 text-3xl font-bold text-blue-800">{policies.length}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="text-sm font-semibold text-green-700">Active Policies</p>
          <p className="mt-1 text-3xl font-bold text-green-800">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
          <p className="text-sm font-semibold text-indigo-700">Last Action</p>
          <p className="mt-1 text-sm font-semibold text-indigo-900">{notice || 'No recent updates'}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/40 bg-white/80 p-6 shadow-md backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {editingId ? 'Edit Existing Policy' : 'Add New Policy'}
        </h2>

        {notice ? (
          <div className={`mt-4 rounded-lg border px-4 py-3 text-sm font-semibold ${notice.includes('Please') ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
            {notice}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Policy Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Example: Monsoon Shield"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Weekly Premium (INR)</label>
            <input
              type="number"
              min="1"
              name="weeklyPremium"
              value={form.weeklyPremium}
              onChange={handleChange}
              placeholder="25"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Coverage Limit (INR)</label>
            <input
              type="number"
              min="1000"
              name="coverageLimit"
              value={form.coverageLimit}
              onChange={handleChange}
              placeholder="10000"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
            >
              <option>Active</option>
              <option>Paused</option>
              <option>Deprecated</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Disruption Triggers</label>
            <textarea
              rows={3}
              name="triggers"
              value={form.triggers}
              onChange={handleChange}
              placeholder="Heavy Rainfall, AQI Spike"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
            >
              {editingId ? 'Update Policy' : 'Add Policy'}
            </button>

            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-white/40 bg-white/80 p-6 shadow-md backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Policy Catalog</h2>

        {policies.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-600 dark:text-slate-300">
            No policies available. Add a new policy to continue.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700">
                <tr>
                  <th className="px-3 py-3">Policy ID</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Premium</th>
                  <th className="px-3 py-3">Coverage</th>
                  <th className="px-3 py-3">Triggers</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-3 py-3 font-semibold text-slate-900 dark:text-slate-100">{policy.id}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{policy.name}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">₹{policy.weeklyPremium}/week</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">₹{policy.coverageLimit.toLocaleString()}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{policy.triggers}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${policy.status === 'Active' ? 'bg-green-100 text-green-700' : policy.status === 'Paused' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(policy)}
                          className="rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(policy.id)}
                          className="rounded-md bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyManagement;
