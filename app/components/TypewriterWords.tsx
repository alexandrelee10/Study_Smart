"use client";

import * as React from "react";

type Props = {
  words: string[];
  className?: string;
  typingSpeedMs?: number; 
  deletingSpeedMs?: number;
  pauseMs?: number;
  startDelayMs?: number;
  cursor?: boolean;
};

export default function TypewriterWords({
  words,
  className = "",
  typingSpeedMs = 70,
  deletingSpeedMs = 45,
  pauseMs = 900,
  startDelayMs = 200,
  cursor = true,
}: Props) {
  const [wordIndex, setWordIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [started, setStarted] = React.useState(false);

  // reserve width to prevent layout shift FIX: LAYOUT SHIFT ISSUE
  const longest = React.useMemo(
    () => words.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [words]
  );

  React.useEffect(() => {
    if (!words.length) return;

    const startTimer = window.setTimeout(() => setStarted(true), startDelayMs);
    return () => window.clearTimeout(startTimer);
  }, [startDelayMs, words.length]);

  React.useEffect(() => {
    if (!started || !words.length) return;

    const current = words[wordIndex] ?? "";

    // Complete typing the word and then pause and then start deleting
    if (!isDeleting && charIndex === current.length) {
      const t = window.setTimeout(() => setIsDeleting(true), pauseMs);
      return () => window.clearTimeout(t);
    }

    // Completed deleting and then next word, start typing
    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
      return;
    }

    const speed = isDeleting ? deletingSpeedMs : typingSpeedMs;

    const t = window.setTimeout(() => {
      setCharIndex((c) => c + (isDeleting ? -1 : 1));
    }, speed);

    return () => window.clearTimeout(t);
  }, [started, words, wordIndex, charIndex, isDeleting, typingSpeedMs, deletingSpeedMs, pauseMs]);

  const currentWord = words[wordIndex] ?? "";
  const visible = currentWord.slice(0, charIndex);

  return (
    <span className={`relative inline-block align-baseline ${className}`}>
      {/* invisible longest word to lock width */}
      <span className="invisible whitespace-nowrap">{longest}</span>

      <span className="absolute left-0 top-0 whitespace-nowrap">
        {visible}
        {cursor ? <span className="animate-cursorBlink">|</span> : null}
      </span>
    </span>
  );
}
