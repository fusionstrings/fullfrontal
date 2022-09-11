import render from "preact-render-to-string";
import { interpret } from "xstate";
import { waitFor } from "xstate/lib/waitFor";
import { typeByExtension } from "https://deno.land/std@0.155.0/media_types/mod.ts";
import { responseMachine } from "#machine";
import { Home } from "#home";
import { NotFound } from "#404";
import { ServerError } from "#500";

async function requestHandlerHome(request: Request) {
  const { pathname } = new URL(request.url);
  const service = interpret(responseMachine);

  service.start();
  service.send(pathname);

  const state = await waitFor(service, (state) => state.matches("success"));

  return new Response(render(<Home greeting={state.context.response} />), {
    headers: { "content-type": typeByExtension("html") },
  });
}

type RequestHandler = {
  [pathname: URL["pathname"]]: (
    request: Request
  ) => Response | Promise<Response>;
};

const requestHandlers: RequestHandler = {
  "/": requestHandlerHome,
};

function requestHandler(request: Request) {
  try {
    const { pathname } = new URL(request.url);

    const requestHandler = requestHandlers[pathname];

    if (requestHandler) {
      return requestHandler(request);
    }

    return new Response(render(<NotFound path={pathname} />), {
      status: 404,
      headers: { "content-type": typeByExtension("html") },
    });
  } catch (error) {
    return new Response(
      render(<ServerError message={error.message || error.toString()} />),
      { status: 500, headers: { "content-type": typeByExtension("html") } }
    );
  }
}

export { requestHandler };
