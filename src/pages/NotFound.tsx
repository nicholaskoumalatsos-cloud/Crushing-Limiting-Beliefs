import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-display text-accent text-sm md:text-base tracking-widest uppercase mb-4">404</p>
        <h1 className="text-4xl mb-4">Off the trail.</h1>
        <p className="text-bone-muted mb-8">
          That page does not exist.
        </p>
        <Link to="/" className="btn-ghost">
          Back to start
        </Link>
      </div>
    </main>
  )
}
