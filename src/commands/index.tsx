import { program } from "commander";
import { render } from "ink";
import { root } from "./root/handler";
import { AnnotateError } from "../error";
import { ErrorPage } from "../ui/error-page";

namespace Commands {
  export async function parse() {
    root(program);

    try {
      await program.parseAsync();
    } catch (err) {
      const isKnown = err instanceof AnnotateError;
      const message = isKnown
        ? err.message
        : err instanceof Error
          ? err.message
          : "An unknown error occurred.";
      const hint = isKnown
        ? err.hint
        : "This is an unexpected error. Please report it at https://github.com/notmanu/annotate/issues";

      render(<ErrorPage message={message} hint={hint} />);

      if (process.env.DEBUG) console.error(err);

      process.exit(1);
    }
  }
}

export { Commands };
