import { renderToReadableStream } from "npm:react-dom/server";
import { createActor, fromPromise, toPromise } from "npm:xstate";
import { typeByExtension } from "jsr:@std/media-types";
import { Home } from "#home";
import { NotFound } from "#404";
import { ServerError } from "#500";

const headers = { "content-type": typeByExtension(".HTML") || "text/html" };

const pageMachine = fromPromise(
  async ({ input }: { input: { pathname: URL["pathname"] } }) => {
    return await { message: `Hello ${input.pathname}` };
  },
);

async function requestHandlerHome(request: Request) {
  const { pathname } = new URL(request.url);

  const actor = createActor(pageMachine, { input: { pathname } });

  actor.subscribe({
    error: (error) => {
      console.error("error:::", error);
    },
  });

  actor.start();

  const output = await toPromise(actor);

  return new Response(
    await renderToReadableStream(<Home greeting={output.message} />),
    {
      headers,
    },
  );
}

type RequestHandlerRegister = {
  [pathname: URL["pathname"]]: (
    request: Request,
  ) => Response | Promise<Response>;
};

const requestHandlerRegister: RequestHandlerRegister = {
  "/": requestHandlerHome,
};

function requestHandler(request: Request) {
  try {
    const { pathname } = new URL(request.url);

    if (pathname in requestHandlerRegister) {
      return requestHandlerRegister[pathname](request);
    }

    return new Response(renderToReadableStream(<NotFound path={pathname} />), {
      status: 404,
      headers,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      renderToReadableStream(
        <ServerError message={errorMessage} />,
      ),
      { status: 500, headers },
    );
  }
}

export { requestHandler };

export default {
  fetch: requestHandler,
};
