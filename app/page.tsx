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

    try {
      const prompt = `You are a fact-checking AI. Analyze the following claim and return a JSON response only, with no markdown or extra text.

Claim: "${claim}"
${evidenceUrl ? `Evidence URL: ${evidenceUrl}` : ""}

Respond ONLY with this JSON format:
{
  "verdict": "VALID" | "INVALID" | "PARTIALLY_VALID",
  "reasoning": "A clear explanation of why the claim is valid, invalid, or partially valid.",
  "confidence": <a number between 50 and 99>
}`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      )

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
      const clean = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(clean)

      setResult({
        verdict: parsed.verdict,
        reasoning: parsed.reasoning,
        confidence: parsed.confidence,
      })
    } catch (error) {
      setResult({
        verdict: "INVALID",
        reasoning: "Something went wrong while verifying this claim. Please try again.",
        confidence: 0,
      })
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

            <VerdictCard result={result} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  )
}
