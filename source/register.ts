import { interpret } from "xstate";
import { waitFor } from "xstate/lib/waitFor";
import { typeByExtension } from "https://deno.land/std@0.150.0/media_types/mod.ts";
import { responseMachine } from "@fusionstrings/fullfrontal/machine";

async function requestHandler(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const { initialState } = responseMachine;
    const registeredRequest = initialState.can(pathname);

    if (registeredRequest) {
      const service = interpret(responseMachine);

      service.start();
      service.send(pathname);

      const state = await waitFor(service, (state) => state.matches("success"));
      const { response } = state.context;

      return new Response(response, {
        headers: { "content-type": typeByExtension("html") },
      });
    }
    return new Response("404", { status: 404 });
  } catch (error) {
    return new Response(error.message || error.toString(), { status: 500 });
  }
}

export { requestHandler };
