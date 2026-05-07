"use client"

import { useState } from "react"
import { ClaimInput } from "@/components/claim-input"
import { VerdictCard } from "@/components/verdict-card"
import { Header } from "@/components/header"

export type Verdict = "VALID" | "INVALID" | "PARTIALLY_VALID" | null

export interface JudgementResult {
  verdict: Verdict
  reasoning: string
  confidence: number
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<JudgementResult | null>(null)

  const handleJudgeClaim = async (claim: string, evidenceUrl?: string) => {
    setIsLoading(true)
    setResult(null)

    // Simulate AI + blockchain verification
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Mock response - in production this would call GenLayer API
    const verdicts: Verdict[] = ["VALID", "INVALID", "PARTIALLY_VALID"]
    const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)]

    const reasonings: Record<NonNullable<Verdict>, string> = {
      VALID:
        "Multiple independent AI validators have reached consensus on this claim. Cross-referenced with verified sources and blockchain-verified data points confirm the accuracy of this statement.",
      INVALID:
        "The claim contradicts established facts verified by our AI consensus network. Multiple validators flagged inconsistencies with peer-reviewed sources and blockchain-verified records.",
      PARTIALLY_VALID:
        "The claim contains elements of truth but includes inaccuracies or lacks important context. Our AI validators achieved partial consensus, with some aspects verified and others disputed.",
    }

    setResult({
      verdict: randomVerdict,
      reasoning: reasonings[randomVerdict!],
      confidence: Math.floor(Math.random() * 20) + 80,
    })

    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="relative">
        <Header />
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="mx-auto max-w-3xl space-y-12">
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                Powered by AI + Blockchain
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
                GenLayer Fact Checker
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
                Verify any claim using decentralized AI consensus. Our network of
                validators cross-references sources and records verdicts on the
                blockchain for transparent, immutable fact-checking.
              </p>
            </div>

            <ClaimInput onSubmit={handleJudgeClaim} isLoading={isLoading} />

            <VerdictCard result={result} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  )
}
