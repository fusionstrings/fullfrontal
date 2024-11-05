import { fromPromise, setup } from "npm:xstate";

export const machine = setup({
  types: {
    context: {} as {
      HOME: {
        body: string; // Changed from never to string
        status: number; // Changed from never to number
        headers: Record<string, string>; // Changed from never to Record<string, string>
      };
      NOT_FOUND: {
        body: string; // Changed from Record<string, never> to string
        status: number; // Changed from never to number
        headers: Record<string, string>;
      };
    },
    events: {} as { type: "/" } | { type: "/404" },
  },
  actors: {
    "HOME.requestHandler": fromPromise(async () => {
      return await "hello";
    }),
    "NOT_FOUND.requestHandler": fromPromise(async () => {
      return await "NOT FOUND";
    }),
  },
}).createMachine({
  context: {
    HOME: {
      body: "",
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    },
    NOT_FOUND: {
      body: "",
      status: 404,
      headers: {
        "content-type": "text/html",
      },
    },
  },
  id: "request-handler-2024-11-06",
  initial: "IDLE",
  states: {
    IDLE: {
      on: {
        "/": {
          target: "HOME",
        },
        "/404": {
          target: "NOT_FOUND",
        },
      },
    },
    HOME: {
      invoke: {
        id: "request-handler.HOME:invocation[0]",
        input: {},
        onDone: {
          target: "HOME_SUCCESS",
        },
        onError: {
          target: "HOME_FAILED",
        },
        src: "HOME.requestHandler",
      },
    },
    NOT_FOUND: {
      invoke: {
        id: "request-handler.NOT_FOUND:invocation[0]",
        input: {},
        onDone: {
          target: "NOT_FOUND_SUCCESS",
        },
        onError: {
          target: "NOT_FOUND_FAILED",
        },
        src: "NOT_FOUND.requestHandler",
      },
    },
    HOME_FAILED: {
      type: "final",
    },
    HOME_SUCCESS: {
      type: "final",
    },
    NOT_FOUND_SUCCESS: {
      type: "final",
    },
    NOT_FOUND_FAILED: {
      type: "final",
    },
  },
});
