import { useState } from 'react'
import { Link } from 'react-router-dom'
import { contentDefaults, OVERRIDE_KEY } from '../content'

/* ── Studio — hidden content editor ──────────────────────────
   Not linked from anywhere. Reached via /studio directly, or by
   tapping the copyright line on the home footer five times.

   Gate: the password is never in the bundle — only its SHA-256
   hash is, and the session unlocks per-tab (sessionStorage).
   This keeps casual visitors out; the content itself is public
   anyway, so obfuscation is the right level of defense.

   Edits save to localStorage and override the site's copy in
   THIS browser immediately. "Export" downloads the merged JSON
   to make a change permanent (drop it into content.js + deploy). */

const PASS_HASH = '9884ad64aa0a4e6e006f5dcb35295cd5ad9736979c472fbe6b30649f499ac195'
const AUTH_KEY = 'tibo:studio-unlocked'

const SECTIONS = [
  { key: 'now', label: 'What I do now' },
  { key: 'track', label: 'Experience roles' },
  { key: 'builder', label: 'Projects' },
  { key: 'toolkit', label: 'Skills & languages' },
  { key: 'education', label: 'Education & campus' },
  { key: 'headed', label: 'Where I’m headed' },
  { key: 'contact', label: 'Contact & links' },
]

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function loadCurrent() {
  let stored = null
  try {
    stored = JSON.parse(localStorage.getItem(OVERRIDE_KEY) || 'null')
  } catch {
    stored = null
  }
  const out = {}
  for (const { key } of SECTIONS) {
    out[key] = JSON.stringify(stored?.[key] ?? contentDefaults[key], null, 2)
  }
  return out
}

function Gate({ onUnlock }) {
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if ((await sha256Hex(value)) === PASS_HASH) {
      sessionStorage.setItem(AUTH_KEY, '1')
      onUnlock()
    } else {
      setWrong(true)
      setValue('')
    }
  }

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-dvh w-full flex-col items-center justify-center bg-void px-6 text-ghost outline-none"
    >
      <form onSubmit={submit} className="glass w-full max-w-sm p-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-fog">Studio</p>
        <p className="mt-2 text-sm text-smoke">This area is for Thibault.</p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setWrong(false)
          }}
          placeholder="Password"
          aria-label="Studio password"
          className={`mt-6 w-full rounded-xl border bg-void-2 px-4 py-3 text-center text-sm text-ghost outline-none transition-colors placeholder:text-smoke focus:border-violet ${
            wrong ? 'border-amber' : 'border-ash'
          }`}
        />
        {wrong && <p className="mt-2 text-xs text-amber">Not it.</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-ghost px-4 py-3 text-sm font-medium text-void transition-opacity hover:opacity-85"
        >
          Enter
        </button>
        <Link to="/" className="mt-5 inline-block text-xs text-smoke transition-colors hover:text-ghost">
          ← Back to the site
        </Link>
      </form>
    </main>
  )
}

function Editor() {
  const [drafts, setDrafts] = useState(loadCurrent)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [hasOverrides, setHasOverrides] = useState(() => !!localStorage.getItem(OVERRIDE_KEY))

  const saveAll = () => {
    const parsed = {}
    const errs = {}
    for (const { key } of SECTIONS) {
      try {
        parsed[key] = JSON.parse(drafts[key])
      } catch (e) {
        errs[key] = e.message
      }
    }
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      setStatus('Fix the highlighted section(s) first.')
      return
    }
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(parsed))
    setHasOverrides(true)
    setStatus('Saved — this browser now shows your edits. Export to make them permanent.')
  }

  const resetAll = () => {
    if (!window.confirm('Discard all local edits and go back to the published content?')) return
    localStorage.removeItem(OVERRIDE_KEY)
    setDrafts(loadCurrent())
    setErrors({})
    setHasOverrides(false)
    setStatus('Local edits cleared — the site shows the published content again.')
  }

  const exportJson = () => {
    const parsed = {}
    for (const { key } of SECTIONS) {
      try {
        parsed[key] = JSON.parse(drafts[key])
      } catch {
        setStatus('Fix invalid JSON before exporting.')
        return
      }
    }
    const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site-content.json'
    a.click()
    URL.revokeObjectURL(url)
    setStatus('Exported. To publish: give site-content.json to Claude Code (“fold this into content.js”) and redeploy.')
  }

  return (
    <main
      id="main"
      tabIndex={-1}
      className="min-h-dvh w-full bg-void px-6 pb-24 pt-10 text-ghost outline-none md:px-10"
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-violet">Studio</p>
            <h1 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">Edit site content</h1>
          </div>
          <Link
            to="/"
            className="text-[11px] uppercase tracking-[0.25em] text-fog transition-colors hover:text-ghost"
          >
            ← View site
          </Link>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist">
          Edits here apply to <span className="text-ghost">this browser only</span> — perfect for
          drafting and previewing. To publish for everyone, hit{' '}
          <span className="text-ghost">Export</span> and drop the file into the repo (Claude Code
          knows what to do with it), then redeploy.
        </p>

        <div className="sticky top-0 z-20 -mx-2 mt-6 flex flex-wrap items-center gap-2 bg-void/90 px-2 py-3 backdrop-blur-sm">
          <button
            type="button"
            onClick={saveAll}
            className="rounded-full bg-ghost px-5 py-2 text-sm font-medium text-void transition-opacity hover:opacity-85"
          >
            Save to this browser
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="rounded-full border border-ash px-5 py-2 text-sm text-mist transition-colors hover:border-fog hover:text-ghost"
          >
            Export JSON
          </button>
          {hasOverrides && (
            <button
              type="button"
              onClick={resetAll}
              className="rounded-full border border-amber/40 px-5 py-2 text-sm text-amber transition-colors hover:border-amber"
            >
              Reset local edits
            </button>
          )}
          {status && <p className="w-full text-xs text-fog md:w-auto md:flex-1">{status}</p>}
        </div>

        <div className="mt-6 space-y-6">
          {SECTIONS.map(({ key, label }) => (
            <section key={key} className="glass p-5 md:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-fog">{label}</h2>
                {errors[key] && <span className="text-xs text-amber">Invalid JSON</span>}
              </div>
              <textarea
                value={drafts[key]}
                onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                spellCheck={false}
                rows={Math.min(24, Math.max(8, drafts[key].split('\n').length))}
                className={`mt-3 w-full resize-y rounded-xl border bg-void-2 p-4 font-mono text-xs leading-relaxed text-mist outline-none transition-colors focus:border-violet ${
                  errors[key] ? 'border-amber' : 'border-hairline'
                }`}
              />
              {errors[key] && <p className="mt-2 text-xs text-amber">{errors[key]}</p>}
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

export default function Studio() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')
  return unlocked ? <Editor /> : <Gate onUnlock={() => setUnlocked(true)} />
}
