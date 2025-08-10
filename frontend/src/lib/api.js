export async function analyzeCode(code) {
    const res = await fetch('http://localhost:8080/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Analyze failed: ${res.status} ${text}`);
    }
    return (await res.json());
}
