import { program } from "commander";
import { render } from "ink";
import { root } from "./root/handler";
import { watch } from "./watch/handler";
import { AnnotateError } from "../error";
import { ErrorPage } from "../ui/error-page";
import { Session } from "./session";

namespace Commands {
  export async function parse() {
    root(program);
    watch(program);

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
        : "This is an unexpected error. Run with DEBUG=1 for details, or report it at https://github.com/not-manu/annotate/issues";

      if (Session.isInteractive()) {
        render(<ErrorPage message={message} hint={hint} />);
      } else {
        console.log(`ERROR ${message}`);
        if (hint) console.log(hint);
      }

      if (process.env.DEBUG) console.error(err);

      process.exit(1);
    }
  }
}

export { Commands };
