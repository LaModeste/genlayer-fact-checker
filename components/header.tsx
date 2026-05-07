import { Shield } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">GenLayer</span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How it Works
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            API
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 md:inline-flex"
          >
            Connect Wallet
          </a>
        </div>
      </div>
    </header>
  )
}
