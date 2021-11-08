export default _default;
export namespace _default {
  class Interface {
    constructor(input: any, output: any, completer: any, terminal: any);
    addListener(type: any, listener: any): any;
    clearLine(): void;
    close(): void;
    each(iteratee: any): any;
    emit(type: any, args: any): any;
    eventNames(): any;
    forEach(iteratee: any): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    map(iteratee: any): any;
    off(type: any, listener: any): any;
    on(type: any, listener: any): any;
    once(type: any, listener: any): any;
    pause(): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    prompt(preserveCursor: any): void;
    question(query: any, cb: any): void;
    questionAsync(query: any): any;
    rawListeners(type: any): any;
    reduce(iteratee: any, accumulator: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    resume(): any;
    setMaxListeners(n: any): any;
    setPrompt(prompt: any): void;
    write(d: any, key: any): void;
  }
  function clearLine(stream: any, dir: any): void;
  function clearScreenDown(stream: any): void;
  function createInterface(...args: any[]): any;
  function cursorTo(stream: any, x: any, y: any): void;
  function emitKeypressEvents(stream: any, iface: any): void;
  function moveCursor(stream: any, dx: any, dy: any): void;
}
