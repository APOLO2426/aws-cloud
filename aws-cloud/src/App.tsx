import { useState, useEffect } from 'react'
import './App.css'
import Input from './components/Input'
import {
  service_get_tasks,
  service_post_tasks,
  service_update_task,
  service_delete_task,
} from './services/task'
import type { Task } from './config/types/tasks'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await service_get_tasks()
        setTasks(data)
      } catch {
        setError('No se pudieron cargar las tareas.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const addTask = async () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle || submitting) return
    try {
      setSubmitting(true)
      setError(null)
      const newTask = await service_post_tasks({
        title: trimmedTitle,
        description: description.trim(),
        completed: false,
      })
      setTasks(prev => [...prev, newTask])
      setTitle('')
      setDescription('')
    } catch {
      setError('No se pudo agregar la tarea.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleTask = async (task: Task) => {
    if (togglingId === task.id) return
    try {
      setTogglingId(task.id)
      setError(null)
      const updated = await service_update_task(task.id, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      })
      setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)))
    } catch {
      setError('No se pudo actualizar la tarea.')
    } finally {
      setTogglingId(null)
    }
  }

  const deleteTask = async (id: number) => {
    if (deletingId === id) return
    try {
      setDeletingId(id)
      setError(null)
      await service_delete_task(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch {
      setError('No se pudo eliminar la tarea.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addTask()
  }

  const pending = tasks.filter(t => !t.completed).length

  return (
    <div className="page">
      <div className="card">

        {/* Header */}
        <div className="card-header">
          <h1 className="title">Tareas</h1>
          {tasks.length > 0 && (
            <span className="badge">{pending} pendiente{pending !== 1 ? 's' : ''}</span>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="error-msg" role="alert">{error}</p>
        )}

        {/* Inputs */}
        <div className="input-group">
          <div className="input-row">
            <Input
              placeholder="Título de la tarea…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={submitting}
              fullWidth
              startIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              }
            />
            <button
              className="add-btn"
              onClick={addTask}
              disabled={submitting || !title.trim()}
              aria-label="Agregar tarea"
            >
              {submitting ? '…' : 'Agregar'}
            </button>
          </div>

          <Input
            placeholder="Descripción (opcional)…"
            value={description}
            onChange={e => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={submitting}
            fullWidth
          />
        </div>

        {/* Lista */}
        {loading ? (
          <p className="empty">Cargando tareas…</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No hay tareas aún. ¡Agrega una!</p>
        ) : (
          <ul className="task-list" role="list">
            {tasks.map(task => (
              <li key={task.id} className={`task-item ${task.completed ? 'task-done' : ''} ${deletingId === task.id ? 'task-deleting' : ''}`}>

                {/* Toggle completado */}
                <button
                  className="check-btn"
                  onClick={() => toggleTask(task)}
                  disabled={togglingId === task.id || deletingId === task.id}
                  aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                >
                  {togglingId === task.id ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="spin">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                  ) : task.completed ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  )}
                </button>

                {/* Info */}
                <div className="task-info">
                  <span className="task-text">{task.title}</span>
                  {task.description && (
                    <span className="task-desc">{task.description}</span>
                  )}
                </div>

                {/* Eliminar */}
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                  disabled={deletingId === task.id || togglingId === task.id}
                  aria-label="Eliminar tarea"
                >
                  {deletingId === task.id ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="spin">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  )}
                </button>

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
