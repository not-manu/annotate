type AnnotateErrorOptions = {
  message: string;
  hint?: string;
};

export class AnnotateError extends Error {
  hint?: string;

  constructor(options: AnnotateErrorOptions) {
    super(options.message);
    this.name = "AnnotateError";
    this.hint = options.hint;
  }
}
