"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Scale, Link, Loader2, Sparkles } from "lucide-react"

interface ClaimInputProps {
  onSubmit: (claim: string, evidenceUrl?: string) => void
  isLoading: boolean
}

export function ClaimInput({ onSubmit, isLoading }: ClaimInputProps) {
  const [claim, setClaim] = useState("")
  const [evidenceUrl, setEvidenceUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (claim.trim()) {
      onSubmit(claim, evidenceUrl || undefined)
    }
  }

  const exampleClaims = [
    "The moon landing in 1969 was real",
    "Coffee is the most consumed beverage worldwide",
    "The Great Wall of China is visible from space",
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-primary/5">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Scale className="h-4 w-4 text-primary" />
              Enter a claim to verify
            </label>
            <Textarea
              placeholder="e.g., The Eiffel Tower was built in 1889..."
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              className="min-h-[120px] resize-none border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Link className="h-4 w-4" />
              Evidence URL (optional)
            </label>
            <Input
              type="url"
              placeholder="https://example.com/source"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {exampleClaims.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setClaim(example)}
                className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                disabled={isLoading}
              >
                {example.length > 30 ? example.slice(0, 30) + "..." : example}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!claim.trim() || isLoading}
          className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Consulting AI Validators...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Judge This Claim
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
