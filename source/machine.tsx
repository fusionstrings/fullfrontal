import { createMachine, assign, interpret } from "xstate";
import { waitFor } from "xstate/lib/waitFor";
import { renderSSR } from "nano-jsx";
import { Home } from "@fusionstrings/fullfrontal";

function renderHome() {
  return renderSSR(<Home />);
}

const responseMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCcwGMwAcAuBLA9gHYB0qAjgK5zYDEA9IqJvrLnkYyAB6IC0AzAE4AHMX4BGYYPEAmYQAYALHIDsixQBoQATz6SZxGeICs4+cfmWj8gGwBfO1tQYcBEnRoQiYYrkIA3fABrHwALfABbME5mVnZCTh4EXmNBQ1sLeUF+UyUbGy1dBBlFByd0LHjiDzBkZHxkYkwAGwBDbAAzBojicKiYljY3RL5jFWJBGWMZHJkVWRNCvn4ZAxU5xRtxcRybY3sykEJ8CDhOZ0q3UjBKagG44aRuUZl5CflhMfEbIRNxJeSkn4xHkKkEm2EZhKNmEhwuriI1XuQw4TySvFUxG2ghUQk2SkExn4AN44kEaVB-BstimOKE-DhFQRJFgFDQGFg8CesRRCTRiBkMLEkJsuLm8kF8n+OgFwPmKiUwkU+0EthURMZLiqHVauGaFFQyPiI2KxlEiiklmUqxhq00MuS-CyxHWan262V1IO5S1jyYg2N-OSxnU70+8x+0lMJLxLo2qRKpmEe1KDjsQA */
  createMachine({
    context: { response: undefined, error: undefined },
    id: "reception",
    initial: "request",
    states: {
      request: {
        on: {
          "/": {
            target: "/",
          },
        },
      },
      "/": {
        invoke: {
          // deno-lint-ignore require-await
          src: async (context, event) => {
            return renderHome();
          },
          id: "home",
          onDone: [
            {
              actions: assign({
                response: (context, event) => event.data,
              }),
              target: "success",
            },
          ],
          onError: [
            {
              actions: assign({ error: (context, event) => event.data }),
              target: "failure",
            },
          ],
        },
      },
      success: {
        type: "final",
      },
      failure: {
        type: "final",
      },
    },
  });

export { responseMachine };
