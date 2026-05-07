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
  const [error, setError] = useState<string | null>(null)

  const handleJudgeClaim = async (claim: string, evidenceUrl?: string) => {
    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) throw new Error("Missing API key")

      const prompt = `You are a fact-checking AI. Analyze this claim and respond with ONLY a raw JSON object. No markdown, no backticks, no extra text.

Claim: "${claim}"${evidenceUrl ? `\nEvidence URL: ${evidenceUrl}` : ""}

Return this exact JSON structure:
{"verdict":"VALID","reasoning":"explanation here","confidence":85}

verdict must be exactly one of: VALID, INVALID, PARTIALLY_VALID
confidence must be a number between 50 and 99
reasoning must be a single clear sentence`

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
            },
          }),
        }
      )

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

      // Extract JSON from anywhere in the response
      const match = text.match(/\{[\s\S]*?\}/)
      if (!match) throw new Error("No JSON in response")

      const parsed = JSON.parse(match[0])

      if (!parsed.verdict || !parsed.reasoning || parsed.confidence === undefined) {
        throw new Error("Incomplete response")
      }

      setResult({
        verdict: parsed.verdict as Verdict,
        reasoning: parsed.reasoning,
        confidence: Number(parsed.confidence),
      })
    } catch (err) {
      console.error(err)
      setError("Could not verify this claim. Please try again.")
    } finally {
      setIsLoading(false)
    }
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

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
                {error}
              </div>
            )}

            <VerdictCard result={result} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  )
}
