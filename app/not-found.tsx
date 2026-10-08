import { Button, Card } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Card className="max-w-md text-center !p-10">
        <p className="text-6xl font-extrabold text-academy-blue/20" aria-hidden>404</p>
        <h1 className="text-2xl font-extrabold text-ink mt-2">This page doesn't exist</h1>
        <p className="text-slate mt-3">
          It may have moved — or it may be a research-stage exam page, which we never publish
          until it's verified and built.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Button href="/">Go home</Button>
          <Button href="/exams" variant="secondary">Browse exams</Button>
        </div>
      </Card>
    </div>
  );
}
