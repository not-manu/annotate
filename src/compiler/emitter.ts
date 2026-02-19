import { EventEmitter } from "events";
import type { CompileResult } from "./base";

type CompilerEventMap = {
  "compile:start": { inputPath: string };
  "compile:end": CompileResult;
  "overlay:end": { outputPath: string; success: boolean };
};

type BufferedEvent = {
  [K in keyof CompilerEventMap]: { event: K; data: CompilerEventMap[K] };
}[keyof CompilerEventMap];

class CompilerEmitter {
  private ee = new EventEmitter();
  private buffer: BufferedEvent[] = [];
  private hasSubscriber = false;

  emit<K extends keyof CompilerEventMap>(
    event: K,
    data: CompilerEventMap[K]
  ): void {
    if (!this.hasSubscriber) {
      this.buffer.push({ event, data } as BufferedEvent);
    }
    this.ee.emit(event, data);
  }

  on<K extends keyof CompilerEventMap>(
    event: K,
    listener: (data: CompilerEventMap[K]) => void
  ): void {
    if (!this.hasSubscriber) {
      this.hasSubscriber = true;
      // Replay buffered events after all listeners in the current call stack
      // have had a chance to register, so nothing is missed.
      queueMicrotask(() => {
        for (const entry of this.buffer) {
          this.ee.emit(entry.event, entry.data);
        }
        this.buffer = [];
      });
    }
    this.ee.on(event, listener);
  }

  off<K extends keyof CompilerEventMap>(
    event: K,
    listener: (data: CompilerEventMap[K]) => void
  ): void {
    this.ee.off(event, listener);
  }
}

export { CompilerEmitter };
export type { CompilerEventMap };
