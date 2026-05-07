"use client"

import { JudgementResult } from "@/app/page"
import { CheckCircle2, XCircle, AlertTriangle, Brain, Share2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface VerdictCardProps {
  result: JudgementResult | null
  isLoading: boolean
}

export function VerdictCard({ result, isLoading }: VerdictCardProps) {
  const [copied, setCopied] = useState(false)

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-primary/5">
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-10 w-10 animate-pulse text-primary" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-lg font-medium text-foreground">
              AI Validators Reaching Consensus
            </p>
            <p className="text-sm text-muted-foreground">
              Cross-referencing sources and verifying facts...
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-2 w-2 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  const verdictConfig = {
    VALID: {
      icon: CheckCircle2,
      label: "VALID",
      bgColor: "bg-valid/10",
      borderColor: "border-valid/30",
      textColor: "text-valid",
      iconBg: "bg-valid/20",
    },
    INVALID: {
      icon: XCircle,
      label: "INVALID",
      bgColor: "bg-invalid/10",
      borderColor: "border-invalid/30",
      textColor: "text-invalid",
      iconBg: "bg-invalid/20",
    },
    PARTIALLY_VALID: {
      icon: AlertTriangle,
      label: "PARTIALLY VALID",
      bgColor: "bg-partial/10",
      borderColor: "border-partial/30",
      textColor: "text-partial",
      iconBg: "bg-partial/20",
    },
  }

  const config = verdictConfig[result.verdict!]
  const Icon = config.icon

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `GenLayer Fact Check Result:\nVerdict: ${config.label}\nConfidence: ${result.confidence}%\nReasoning: ${result.reasoning}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "GenLayer Fact Check",
        text: `Verdict: ${config.label} (${result.confidence}% confidence)\n${result.reasoning}`,
        url: window.location.href,
      })
    }
  }

  return (
    <div
      className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-8 shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4`}
    >
      <div className="flex flex-col items-center space-y-6">
        <div className={`rounded-full ${config.iconBg} p-4`}>
          <Icon className={`h-12 w-12 ${config.textColor}`} />
        </div>

        <div className="space-y-2 text-center">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${config.bgColor} ${config.textColor}`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full ${config.textColor} opacity-75`}
              ></span>
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${config.textColor.replace("text-", "bg-")}`}
              ></span>
            </span>
            {config.label}
          </div>
          <p className={`text-4xl font-bold ${config.textColor}`}>
            {result.confidence}%
          </p>
          <p className="text-sm text-muted-foreground">Consensus Confidence</p>
        </div>

        <div className="w-full space-y-3 rounded-xl bg-background/50 p-4">
          <p className="text-sm font-medium text-foreground">AI Reasoning</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.reasoning}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex-1 border-border bg-secondary/50 text-secondary-foreground hover:bg-secondary"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Result
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex-1 border-border bg-secondary/50 text-secondary-foreground hover:bg-secondary"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Verified by GenLayer AI Consensus Network • Results recorded on-chain
        </p>
      </div>
    </div>
  )
}
