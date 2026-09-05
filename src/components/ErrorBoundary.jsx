import { Component } from 'react'
import { Link } from 'react-router-dom'

/* Last line of defence. Without one, any render throw leaves the visitor
   staring at the black Suspense fallback with no way to tell a slow load
   from a dead page. */
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <main
        id="main"
        tabIndex={-1}
        className="flex min-h-dvh w-full flex-col items-center justify-center gap-6 bg-void px-6 text-center text-ghost outline-none"
      >
        <p className="label text-fog">
          Something broke on this page
        </p>
        <h1 className="max-w-md text-2xl font-medium tracking-tight md:text-3xl">
          That&rsquo;s on me, not on you.
        </h1>
        <Link
          to="/"
          reloadDocument
          className="rounded-full border border-ash px-5 py-2 text-sm text-mist transition-colors hover:border-fog hover:text-ghost"
        >
          ← Back to home
        </Link>
      </main>
    )
  }
}
