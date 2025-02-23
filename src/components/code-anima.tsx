"use client"
import { numbers, lower_case_letters, upper_case_letters } from "@/lib/constants";

// Helper function for casino-like rolling animation with acceleration.
// It starts with a slower update interval and speeds up until stopped.
export function rollShortCodeAnimation(
  update: (code: string) => void,
  initialInterval: number = 200,  // starting delay in ms
  acceleration: number = 0.3,       // multiplier to decrease the delay each round
  minInterval: number = 50          // lowest possible delay in ms
) {
  const short_code_length = 6;
  const charset = numbers + lower_case_letters + upper_case_letters;
  let currentInterval = initialInterval;
  let stopped = false;

  function animate() {
    if (stopped) return;
    let randomCode = "";
    for (let i = 0; i < short_code_length; i++) {
      randomCode += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    update(randomCode);
    // accelerate: reduce the delay but never go below minInterval.
    currentInterval = Math.max(minInterval, currentInterval * acceleration);
    setTimeout(animate, currentInterval);
  }
  animate();

  return {
    stop: () => { stopped = true; }
  };
}


export function AnimatedShortCode({ finalCode }: { finalCode: string }) {
  return (
    <span className="inline-block">
      {finalCode.split('').map((char, index) => (
        <span
          key={index}
          // Each character “pops” in with a delay based on its index.
          style={{ animationDelay: `${index * 0.1}s` }}
          className="inline-block animate-pop"
        >
          {char}
        </span>
      ))}
    </span>
  );
}