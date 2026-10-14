export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 560 }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>◠</div>
        <h1 style={{ fontSize: "2.5rem", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Unschool Academy</h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.75, fontStyle: "italic" }}>Learn by doing.</p>
        <p style={{ marginTop: 32, fontSize: "0.95rem", opacity: 0.6 }}>
          We're rebuilding the studio — fresh, focused, one beautiful piece at a time.
        </p>
      </div>
    </main>
  );
}
