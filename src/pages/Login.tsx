export function Login() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full text-center">
        <p className="font-display text-accent text-2xl md:text-3xl tracking-wider uppercase mb-10">
          Crushing Limiting Beliefs
        </p>
        <h1 className="text-4xl md:text-5xl mb-8 leading-tight">
          Use your email link.
        </h1>
        <p className="text-bone-muted text-lg leading-relaxed mb-8">
          This site has no passwords. Your access lives in the welcome email we sent
          when you signed up. Open that email and click the link, you are in.
        </p>
        <p className="text-bone-muted leading-relaxed">
          Cannot find it? Check your spam folder. Still nothing? Request a new link by{' '}
          <a
            className="text-accent hover:underline"
            href="https://shop.nickkoumalatsos.com/pages/crushing-limiting-beliefs"
          >
            re-submitting the form here
          </a>
          . A fresh link will arrive in a few minutes.
        </p>
      </div>
    </main>
  )
}
