import { z } from "zod";

namespace Flavor {
  export const Schema = z.enum(["latex", "typst"]);
  export type Type = z.infer<typeof Schema>;

  export const Names: Record<Type, string> = {
    latex: "LaTeX",
    typst: "Typst",
  };

  export function isValid(flavor: unknown): boolean {
    return Schema.safeParse(flavor).success;
  }
}

export { Flavor };
