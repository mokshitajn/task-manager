import { useState, useEffect } from 'react'
import axios from 'axios'
import { supabase } from './supabaseClient'
import Auth from './Auth'

const API = import.meta.env.VITE_API_URL

const statusConfig = {
  'todo': { label: 'Todo', color: '#7c3aed', bg: '#ede9fe', dot: '#7c3aed' },
  'in-progress': { label: 'In Progress', color: '#d97706', bg: '#fef3c7', dot: '#f59e0b' },
  'completed': { label: 'Completed', color: '#059669', bg: '#d1fae5', dot: '#10b981' },
}

export default function App() {
  const [session, setSession] = useState(null)
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', due_date: '' })
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  useEffect(() => {
    if (session) fetchTasks()
  }, [session])

  const fetchTasks = async () => {
    const res = await axios.get(`${API}/api/tasks`)
    setTasks(res.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (editId) {
      await axios.put(`${API}/api/tasks/${editId}`, form)
      setEditId(null)
    } else {
      await axios.post(`${API}/api/tasks`, form)
    }
    setForm({ title: '', description: '', status: 'todo', due_date: '' })
    setShowForm(false)
    fetchTasks()
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await axios.delete(`${API}/api/tasks/${id}`)
      fetchTasks()
    }
  }

  const handleEdit = (task) => {
    setEditId(task.id)
    setForm({ title: task.title, description: task.description, status: task.status, due_date: task.due_date || '' })
    setShowForm(true)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (!session) return <Auth />

  const filtered = tasks
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  const completionRate = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)
  const isOverdue = (due_date) => due_date && new Date(due_date) < new Date()
  const userName = session.user.email.split('@')[0]
  const initials = userName.slice(0, 2).toUpperCase()

  const recentTasks = [...tasks].sort((a, b) => b.id - a.id).slice(0, 4)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f3ff', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* LEFT SIDEBAR */}
      <div style={{ width: 260, background: 'white', borderRight: '1px solid #ede9fe', padding: '28px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 10 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 28 }}>
          <div style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', borderRadius: 10, padding: '8px', fontSize: 18 }}>⚡</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1e1b4b' }}>Task Manager</span>
        </div>

        {/* User Greeting */}
        <div style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', borderRadius: 14, padding: '16px', marginBottom: 24, color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{initials}</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Hey, {userName}!</p>
              <p style={{ fontSize: 11, opacity: 0.85, margin: 0 }}>Let's crush some tasks! 🎯</p>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
              <span style={{ opacity: 0.85 }}>PRODUCTIVITY</span>
              <span style={{ fontWeight: 700 }}>{completionRate}%</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 99, height: 6 }}>
              <div style={{ background: 'white', borderRadius: 99, height: 6, width: `${completionRate}%`, transition: 'width 0.5s' }}></div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.08em', padding: '0 8px', marginBottom: 8 }}>MENU</p>
        {[
          { key: 'all', icon: '🏠', label: 'Dashboard', count: stats.total },
          { key: 'todo', icon: '📝', label: 'Pending Tasks', count: stats.todo },
          { key: 'completed', icon: '✅', label: 'Completed', count: stats.completed },
          { key: 'in-progress', icon: '⚡', label: 'In Progress', count: stats.inProgress },
        ].map(item => (
          <button key={item.key} onClick={() => setFilter(item.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 10, border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
              background: filter === item.key ? '#ede9fe' : 'transparent',
              color: filter === item.key ? '#7c3aed' : '#4b5563',
              fontWeight: filter === item.key ? 600 : 400, fontSize: 14, marginBottom: 2,
              transition: 'all 0.15s'
            }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
            <span style={{ marginLeft: 'auto', background: filter === item.key ? '#7c3aed' : '#f3f4f6', color: filter === item.key ? 'white' : '#6b7280', borderRadius: 99, padding: '1px 8px', fontSize: 12, fontWeight: 600 }}>
              {item.count}
            </span>
          </button>
        ))}

        {/* Pro Tip */}
        <div style={{ marginTop: 'auto', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 12, padding: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', marginBottom: 4 }}>💡 Pro Tip</p>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>Use filters to focus on tasks that need attention today!</p>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          style={{ marginTop: 12, width: '100%', background: '#fef2f2', color: '#ef4444', border: 'none', padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          🚪 Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: 260, flex: 1, padding: '32px 28px', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b', margin: 0 }}>Task Overview</h1>
            <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>Manage your tasks efficiently</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input placeholder="🔍  Search tasks..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none', width: 200, background: 'white' }} />
            <button onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', description: '', status: 'todo', due_date: '' }) }}
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}>
              + Add New Task
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Tasks', value: stats.total, icon: '🏠', color: '#7c3aed', bg: '#ede9fe' },
            { label: 'Todo', value: stats.todo, icon: '📝', color: '#7c3aed', bg: '#ede9fe' },
            { label: 'In Progress', value: stats.inProgress, icon: '⚡', color: '#d97706', bg: '#fef3c7' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: '#059669', bg: '#d1fae5' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{s.label}</span>
                <span style={{ background: s.bg, borderRadius: 8, padding: '5px 7px', fontSize: 15 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['all', 'todo', 'in-progress', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: filter === f ? '#7c3aed' : 'white',
                color: filter === f ? 'white' : '#6b7280',
                boxShadow: filter === f ? '0 2px 8px rgba(124,58,237,0.3)' : '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.15s'
              }}>
              {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af', background: 'white', borderRadius: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontWeight: 500 }}>No tasks found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(task => (
              <div key={task.id}
                style={{ background: 'white', borderRadius: 12, padding: '16px 20px', border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}>

                {/* Status dot */}
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusConfig[task.status]?.dot, flexShrink: 0 }}></div>

                {/* Task info */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#1e1b4b', margin: 0, marginBottom: 3 }}>{task.title}</p>
                  {task.description && <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{task.description}</p>}
                </div>

                {/* Status badge */}
                <span style={{ background: statusConfig[task.status]?.bg, color: statusConfig[task.status]?.color, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {statusConfig[task.status]?.label}
                </span>

                {/* Due date */}
                {task.due_date && (
                  <span style={{ fontSize: 12, color: isOverdue(task.due_date) && task.status !== 'completed' ? '#ef4444' : '#9ca3af', whiteSpace: 'nowrap' }}>
                    {isOverdue(task.due_date) && task.status !== 'completed' ? '⚠️ ' : '📅 '}
                    {new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleEdit(task)} style={{ background: '#ede9fe', border: 'none', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>✏️</button>
                  <button onClick={() => handleDelete(task.id)} style={{ background: '#fee2e2', border: 'none', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div style={{ width: 280, background: 'white', borderLeft: '1px solid #ede9fe', padding: '32px 20px', position: 'fixed', right: 0, height: '100vh', overflowY: 'auto' }}>

        {/* User avatar top right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1e1b4b', margin: 0 }}>{userName}</p>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{session.user.email}</p>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>{initials}</div>
          </div>
        </div>

        {/* Task Statistics */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            📊 Task Statistics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Total Tasks', value: stats.total, color: '#7c3aed' },
              { label: 'Completed', value: stats.completed, color: '#059669' },
              { label: 'Pending', value: stats.todo + stats.inProgress, color: '#d97706' },
              { label: 'Completion Rate', value: `${completionRate}%`, color: '#7c3aed' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#faf5ff', borderRadius: 10, padding: '12px', border: '1px solid #ede9fe' }}>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px', fontWeight: 500 }}>{s.label}</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Task Progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', margin: 0 }}>🎯 Task Progress</h3>
            <span style={{ fontSize: 13, color: '#7c3aed', fontWeight: 600 }}>{stats.completed}/{stats.total}</span>
          </div>
          <div style={{ background: '#ede9fe', borderRadius: 99, height: 8 }}>
            <div style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)', borderRadius: 99, height: 8, width: `${completionRate}%`, transition: 'width 0.5s' }}></div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            🕐 Recent Activity
          </h3>
          {recentTasks.length === 0 ? (
            <p style={{ fontSize: 13, color: '#9ca3af' }}>No tasks yet.</p>
          ) : (
            recentTasks.map(task => (
              <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#1e1b4b', margin: 0, marginBottom: 2 }}>{task.title.length > 18 ? task.title.slice(0, 18) + '…' : task.title}</p>
                  {task.due_date && <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>}
                </div>
                <span style={{ background: statusConfig[task.status]?.bg, color: statusConfig[task.status]?.color, padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>
                  {statusConfig[task.status]?.label}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main area right margin for right sidebar */}
      <div style={{ width: 280, flexShrink: 0 }}></div>

      {/* MODAL */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setEditId(null) } }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, width: '90%', maxWidth: 460, boxShadow: '0 20px 60px rgba(124,58,237,0.2)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: '#1e1b4b' }}>
              {editId ? '✏️ Edit Task' : '➕ New Task'}
            </h2>
            <form onSubmit={handleSubmit}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title *</label>
              <input required placeholder="Task title..." value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', margin: '6px 0 16px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />

              <label style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
              <textarea placeholder="Add description..." value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                style={{ width: '100%', padding: '10px 12px', margin: '6px 0 16px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box', resize: 'vertical', outline: 'none' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', marginTop: 6, borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' }}>
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</label>
                  <input type="date" value={form.due_date}
                    onChange={e => setForm({ ...form, due_date: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', marginTop: 6, borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" disabled={loading}
                  style={{ flex: 1, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', border: 'none', padding: 12, borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
                  {loading ? 'Saving...' : editId ? 'Update Task' : 'Add Task'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
                  style={{ flex: 1, background: '#f3f4f6', color: '#6b7280', border: 'none', padding: 12, borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}