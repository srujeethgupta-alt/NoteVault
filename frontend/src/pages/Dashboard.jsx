import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { notesApi } from '../api/client'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fetchLoading, setFetchLoading] = useState(true)

  // Load notes
  useEffect(() => {
    notesApi.list()
      .then(res => setNotes(res.data.notes))
      .catch(() => setError('Failed to load notes'))
      .finally(() => setFetchLoading(false))
  }, [])

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!title.trim()) return setError('Title is required')
    setAdding(true)
    setError('')
    try {
      const res = await notesApi.create({ title: title.trim(), content: content.trim() })
      setNotes(prev => [res.data.note, ...prev])
      setTitle('')
      setContent('')
      setSuccess('Note saved!')
      setTimeout(() => setSuccess(''), 2500)
    } catch {
      setError('Failed to save note')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return
    try {
      await notesApi.remove(id)
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch {
      setError('Failed to delete note')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2)
    : '??'

  return (
    <div className="dashboard">
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="brand" style={{marginBottom:0}}>
            <span className="brand-dot"></span>
            NoteVault
          </div>
        </div>
        <div className="topbar-right">
          <div className="user-badge">
            <div className="avatar">{initials}</div>
            <span className="user-name">{user?.name}</span>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="main-content">
        {/* Welcome */}
        <section className="welcome-section">
          <h1>
            Hello, <em>{user?.name?.split(' ')[0]}</em>
          </h1>
          <p className="subtitle">Your personal vault of thoughts and ideas.</p>
          <div className="stats-row">
            <div className="stat-chip"><span>{notes.length}</span> notes</div>
            <div className="stat-chip">Joined <span>{user?.created_at ? formatDate(user.created_at) : 'recently'}</span></div>
          </div>
        </section>

        {/* Alerts */}
        {error && <div className="alert alert-error" style={{marginBottom:'1.5rem'}}>{error}</div>}
        {success && <div className="alert alert-success" style={{marginBottom:'1.5rem'}}>{success}</div>}

        {/* Add note */}
        <div className="add-note-card">
          <h3>New note</h3>
          <form onSubmit={handleAddNote}>
            <div className="note-inputs">
              <input
                type="text"
                placeholder="Note title…"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={120}
              />
              <textarea
                placeholder="What's on your mind? (optional)"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={3}
              />
            </div>
            <div className="add-note-actions">
              <button type="submit" className="btn btn-add" disabled={adding}>
                {adding ? <><div className="spinner" style={{borderTopColor:'#0d0d0d', borderColor:'rgba(13,13,13,0.3)', width:14, height:14}}></div> Saving…</> : '+ Add note'}
              </button>
            </div>
          </form>
        </div>

        {/* Notes list */}
        <section>
          <div className="section-header">
            <h2 className="section-title">Your notes</h2>
          </div>

          {fetchLoading ? (
            <div className="loading" style={{minHeight: '200px'}}>
              <div className="spinner"></div>
              <span>Loading notes…</span>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <p>No notes yet — add your first one above.</p>
                </div>
              ) : notes.map((note, i) => (
                <div
                  className="note-card"
                  key={note.id}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="note-title">{note.title}</div>
                  {note.content && (
                    <div className="note-content">{note.content}</div>
                  )}
                  <div className="note-meta">
                    <span>{formatDate(note.created_at)}</span>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
