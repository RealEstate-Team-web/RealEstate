import { useEffect, useState } from 'react';
import { Tag, Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/category.service';

const emptyForm = { name: '', description: '' };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editError, setEditError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [refreshError, setRefreshError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [loadError, setLoadError] = useState(null);

  const fetchCategories = async () => {
    const data = await getAdminCategories();
    setCategories(data);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await fetchCategories();
      } catch (err) {
        if (!active) return;
        setLoadError(err.message || 'Failed to load categories');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const retryInitialLoad = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      await fetchCategories();
    } catch (err) {
      setLoadError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const reload = async () => {
    setRefreshing(true);
    try {
      await fetchCategories();
      setRefreshError(null);
    } catch (err) {
      setRefreshError(err.message || 'Failed to refresh categories');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name.trim()) {
      setFormError('Category name is required');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await createCategory({
        name: form.name.trim(),
        description: form.description.trim() || null,
      });
    } catch (err) {
      setFormError(err.message || 'Failed to create category');
      setSaving(false);
      return;
    }
    setSuccess(`Category "${form.name.trim()}" created`);
    setForm(emptyForm);
    await reload();
    setSaving(false);
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditForm({ name: category.name, description: category.description || '' });
    setEditError(null);
    setConfirmDeleteId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
    setEditError(null);
  };

  const handleUpdate = async (id) => {
    if (!editForm.name.trim()) {
      setEditError('Category name is required');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateCategory(id, {
        name: editForm.name.trim(),
        description: editForm.description.trim() || null,
      });
    } catch (err) {
      setEditError(err.message || 'Failed to update category');
      setSaving(false);
      return;
    }
    setSuccess(`Category "${editForm.name.trim()}" updated`);
    await reload();
    cancelEdit();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError(null);
    setSuccess(null);
    try {
      await deleteCategory(id);
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      setDeletingId(null);
      return;
    }
    setSuccess('Category deleted');
    setConfirmDeleteId(null);
    await reload();
    setDeletingId(null);
  };

  if (loading) {
    return <div className="py-20 text-center text-[#6B7280]">Loading categories…</div>;
  }

  if (loadError) {
    return (
      <div className="py-20 flex flex-col items-center gap-3 font-sans">
        <p role="alert" className="text-[13px] text-[#B23B36]">
          Failed to load categories: {loadError}
        </p>
        <button
          type="button"
          onClick={retryInitialLoad}
          className="inline-flex items-center h-[36px] px-4 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const actionBusy = saving || deletingId !== null;

  return (
    <div className="space-y-5 font-sans">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4A9FF5] mb-1">
            Management
          </p>
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0">
              <Tag size={20} />
            </span>
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
              Category Management
            </h1>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Organize listings with property categories
          </p>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-[#FBE9E8] text-[#B23B36] text-[13px] px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div aria-live="polite" className="rounded-md bg-[#E6F4EC] text-[#2F7A55] text-[13px] px-4 py-3">
          {success}
        </div>
      )}
      {refreshError && (
        <div
          role="alert"
          className="rounded-md bg-[#FBF3DD] text-[#8a6d1f] text-[13px] px-4 py-3 flex items-center justify-between gap-3"
        >
          <span>Saved, but refreshing the list failed: {refreshError}</span>
          <button
            type="button"
            onClick={() => reload()}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-md bg-white border border-[#e5d9a8] text-[12px] font-medium text-[#8a6d1f] hover:bg-[#fdf8ea] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {refreshing ? <Loader2 size={14} className="animate-spin" /> : null}
            Retry
          </button>
        </div>
      )}

      {/* Add category form */}
      <form
        onSubmit={handleCreate}
        className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_2px_8px_rgba(15,23,42,0.06)] p-4"
      >
        <h2 className="text-[17px] font-semibold text-[#111827] mb-3">Add New Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_auto] gap-3 items-start">
          <div>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Category name"
              aria-label="Category name"
              id="create-category-name"
              maxLength={100}
              aria-invalid={Boolean(formError)}
              aria-describedby={formError ? 'create-name-error' : undefined}
              className="w-full h-[38px] px-3 rounded-md border border-[#E5E7EB] text-[13px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E7B85A]/50"
            />
          </div>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)"
            aria-label="Category description"
            maxLength={1000}
            className="w-full h-[38px] px-3 rounded-md border border-[#E5E7EB] text-[13px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E7B85A]/50"
          />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-1.5 h-[38px] px-4 rounded-md bg-[#E7B85A] text-[13px] font-semibold text-[#111827] hover:bg-[#dfae49] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            Add Category
          </button>
        </div>
        {formError && (
          <p
            id="create-name-error"
            role="alert"
            className="mt-2 text-[12px] text-[#B23B36]"
          >
            {formError}
          </p>
        )}
      </form>

      {/* Categories table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_2px_8px_rgba(15,23,42,0.06)] overflow-hidden">
        <h2 className="text-[17px] font-semibold text-[#111827] px-4 py-3">
          All Categories
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-[#111827] min-w-[720px]">
            <thead>
              <tr className="bg-[#F3F4F8] text-[#374151] font-medium text-[13px] h-[42px]">
                <th className="py-0 px-4 rounded-l-lg w-[22%]">Name</th>
                <th className="py-0 px-4 w-[46%]">Description</th>
                <th className="py-0 px-4 w-[16%]">Created</th>
                <th className="py-0 px-4 w-[16%] rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-[13px] text-[#6B7280]">
                    No categories yet.
                  </td>
                </tr>
              ) : (
                categories.map((category) =>
                  editingId === category.id ? (
                    <tr key={category.id} className="bg-[#FFFBF0]">
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Category name"
                          aria-label="Category name"
                          id={`edit-category-name-${category.id}`}
                          maxLength={100}
                          aria-invalid={Boolean(editError)}
                          aria-describedby={editError ? `edit-name-error-${category.id}` : undefined}
                          className="w-full h-[34px] px-2 rounded-md border border-[#E5E7EB] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#E7B85A]/50"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                          placeholder="Description (optional)"
                          aria-label="Category description"
                          maxLength={1000}
                          className="w-full h-[34px] px-2 rounded-md border border-[#E5E7EB] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#E7B85A]/50"
                        />
                      </td>
                      <td colSpan={2} className="py-2 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleUpdate(category.id)}
                            className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium text-[#2F7A55] hover:bg-[#e3f3ea] transition-colors disabled:opacity-50"
                          >
                            {saving ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : null}
                            Save
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={cancelEdit}
                            className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors disabled:opacity-50"
                          >
                            <X size={15} />
                            Cancel
                          </button>
                          {editError && (
                            <span
                              role="alert"
                              id={`edit-name-error-${category.id}`}
                              className="text-[12px] text-[#B23B36]"
                            >
                              {editError}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={category.id}
                      className="h-[50px] hover:bg-[#F9FAFB] transition-colors"
                    >
                      <td className="py-0 px-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#FBF3DD] text-[#E7B85A]">
                            <Tag size={14} />
                          </span>
                          <span className="font-medium truncate text-[#111827]">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-0 px-4 text-[#374151] truncate">
                        {category.description || '—'}
                      </td>
                      <td className="py-0 px-4 text-[#374151] whitespace-nowrap">
                        {category.created_at
                          ? new Date(category.created_at).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="py-0 px-4">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          {confirmDeleteId === category.id ? (
                            <>
                              <span className="text-[12px] text-[#B23B36]">Delete?</span>
                              <button
                                type="button"
                                disabled={deletingId === category.id}
                                onClick={() => handleDelete(category.id)}
                                className="inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-md bg-[#FBE9E8] border border-[#f0cfce] text-[12px] font-medium text-[#B23B36] hover:bg-[#f6dcd9] transition-colors disabled:opacity-50"
                              >
                                {deletingId === category.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                disabled={deletingId === category.id}
                                className="h-[30px] px-2.5 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[12px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors disabled:opacity-50"
                              >
                                No
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                disabled={actionBusy}
                                onClick={() => startEdit(category)}
                                className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors disabled:opacity-50"
                              >
                                <Pencil size={15} />
                                Edit
                              </button>
                              <button
                                type="button"
                                disabled={actionBusy}
                                onClick={() => setConfirmDeleteId(category.id)}
                                className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium text-[#B23B36] hover:bg-[#fbe9e8] transition-colors disabled:opacity-50"
                              >
                                <Trash2 size={15} />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;
