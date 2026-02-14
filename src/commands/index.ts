import { program } from "commander";
import { root } from "./root/handler";
import { AnnotateError } from "../error";

namespace Commands {
  function register() {
    root(program);
  }

  function onError(err: unknown) {
    if (err instanceof AnnotateError) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
    throw err;
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
