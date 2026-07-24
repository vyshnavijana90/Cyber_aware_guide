import { useState } from "react";
import { CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

type Q = { q: string; options: string[]; answer: number; explain: string };

const QUESTIONS: Q[] = [
  {
    q: "Your bank calls and asks for an OTP to 'verify your account'. What do you do?",
    options: [
      "Share it — they're the bank",
      "Refuse and hang up",
      "Ask them to call back later",
      "Share only half of it",
    ],
    answer: 1,
    explain: "Banks NEVER ask for OTPs. Hang up immediately and report the number to 1930.",
  },
  {
    q: "A buyer on OLX sends you a UPI 'collect request' to receive payment. You should:",
    options: [
      "Approve and enter PIN",
      "Decline — receiving never needs your PIN",
      "Ask for a screenshot first",
      "Enter PIN once to test",
    ],
    answer: 1,
    explain: "Entering your PIN sends money out. You only get paid when someone scans your QR.",
  },
  {
    q: "Which of these is a sign of a phishing email?",
    options: [
      "Email from your saved contact",
      "Urgent threat + suspicious link",
      "Plain text newsletter",
      "Email with no attachments",
    ],
    answer: 1,
    explain: "Urgency + a link asking you to log in is the classic phishing pattern.",
  },
  {
    q: "A job offer asks for ₹2,500 'registration fee'. This is most likely:",
    options: [
      "Standard practice",
      "A scam — real jobs don't charge",
      "Refundable on joining",
      "A government rule",
    ],
    answer: 1,
    explain: "Legitimate employers never ask candidates to pay to get hired.",
  },
  {
    q: "What is India's cyber crime helpline number?",
    options: ["100", "112", "1930", "139"],
    answer: 2,
    explain: "Dial 1930 within 24 hours of a cyber fraud for the best chance of recovery.",
  },
];

export function Quiz() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[idx];
  const progress = ((idx + (done ? 1 : 0)) / QUESTIONS.length) * 100;

  const next = () => {
    if (picked === q.answer) setScore((s) => s + 1);
    if (idx === QUESTIONS.length - 1) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
    }
  };

  const reset = () => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <section id="quiz" className="py-24 relative">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Test Yourself"
          title="Fraud Detection Quiz"
          description="Five quick scenarios. Can you spot every scam?"
        />
        <Card className="max-w-2xl mx-auto p-8 shadow-card border-border">
          {!done ? (
            <>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>
                  Question {idx + 1} of {QUESTIONS.length}
                </span>
                <span>Score: {score}</span>
              </div>
              <Progress value={progress} className="mb-6" />
              <h3 className="text-xl font-semibold mb-6">{q.q}</h3>
              <div className="space-y-3 mb-6">
                {q.options.map((opt, i) => {
                  const isPicked = picked === i;
                  const isCorrect = picked !== null && i === q.answer;
                  const isWrong = isPicked && i !== q.answer;
                  return (
                    <button
                      key={opt}
                      disabled={picked !== null}
                      onClick={() => setPicked(i)}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3",
                        picked === null &&
                          "border-border hover:border-primary hover:bg-secondary/50",
                        isCorrect && "border-success bg-success/10",
                        isWrong && "border-destructive bg-destructive/10",
                        picked !== null && !isPicked && !isCorrect && "border-border opacity-60",
                      )}
                    >
                      <span className="size-6 rounded-full border-2 border-current grid place-items-center text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isCorrect && <CheckCircle2 className="size-5 text-success" />}
                      {isWrong && <XCircle className="size-5 text-destructive" />}
                    </button>
                  );
                })}
              </div>
              {picked !== null && (
                <div className="p-4 rounded-lg bg-secondary mb-4 animate-fade-up text-sm">
                  <strong className="block mb-1">
                    {picked === q.answer ? "Correct!" : "Not quite."}
                  </strong>
                  {q.explain}
                </div>
              )}
              <Button
                onClick={next}
                disabled={picked === null}
                className="w-full bg-gradient-cyber border-0 text-primary-foreground"
              >
                {idx === QUESTIONS.length - 1 ? "See result" : "Next question"}
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4 py-6">
              <div className="size-20 rounded-full bg-gradient-cyber grid place-items-center mx-auto shadow-glow animate-pulse-glow">
                <Trophy className="size-10 text-primary-foreground" />
              </div>
              <h3 className="text-3xl font-bold">
                You scored {score} / {QUESTIONS.length}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {score === QUESTIONS.length
                  ? "Perfect! You're a cyber-fraud detector. Share this quiz with friends."
                  : score >= 3
                    ? "Good awareness! Review the safety tips above to plug the gaps."
                    : "Keep learning. Read the fraud cards above — they could save your money."}
              </p>
              <Button onClick={reset} variant="outline">
                <RotateCcw className="size-4 mr-2" /> Try again
              </Button>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
