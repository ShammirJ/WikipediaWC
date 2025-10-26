'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [count, setCount] = useState(null);
  const [error, setError] = useState('');

  const handleCount = async () => {
  try {
    setError('');
    setCount(null);

    // Extract the page title from the URL
    const title = url.split('/wiki/')[1];
    if (!title) throw new Error('Invalid Wikipedia URL.');

    // Fetch the full HTML of the Wikipedia page
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=parse&origin=*&page=${title}&format=json`
    );

    if (!res.ok) throw new Error('Failed to fetch the Wikipedia page.');

    const data = await res.json();
    const html = data.parse.text['*']; // full HTML of the page

    // Parse HTML and extract all visible text
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const text = doc.body.innerText;

    // Count words
    const wordCount = text.trim().split(/\s+/).length;
    setCount(wordCount);
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Wikipedia Word Counter</h1>
      <input
        type="text"
        placeholder="Paste Wikipedia link..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border rounded px-4 py-2 w-96 mb-4"
      />
      <button
        onClick={handleCount}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Count Words
      </button>

      {count !== null && <p className="mt-4 text-lg">Word count: <b>{count}</b></p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </main>
  );
}
