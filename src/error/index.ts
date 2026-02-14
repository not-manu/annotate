export class AnnotateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DotContextError";
  }
}
