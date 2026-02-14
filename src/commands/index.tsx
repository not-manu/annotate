import { program } from "commander";
import { render } from "ink";
import { root } from "./root/handler";
import { AnnotateError } from "../error";
import { ErrorPage } from "../ui/error-page";

namespace Commands {
  function register() {
    root(program);
  }

  function onError(err: unknown) {
    if (err instanceof AnnotateError) {
      render(<ErrorPage message={err.message} hint={err.hint} />);
      process.exit(1);
    }

    const message =
      err instanceof Error ? err.message : "An unknown error occurred.";

    render(
      <ErrorPage
        message={message}
        hint="This is an unexpected error. Please report it at https://github.com/notmanu/annotate/issues"
      />,
    );

    if (process.env.DEBUG) {
      console.error(err);
    }

    process.exit(1);
  }

  export async function parse() {
    register();

    try {
      await program.parseAsync();
    } catch (err) {
      onError(err);
    }
  }
}

export { Commands };
