import agentsMd from "./AGENTS.md" with { type: "text" };

namespace Agents {
  export function generate(): string {
    return agentsMd;
  }
}

export { Agents };
