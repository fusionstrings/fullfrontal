import { serve } from "https://deno.land/std@0.155.0/http/server.ts";
import { requestHandler } from "#register";

if (import.meta?.main) {
  const timestamp = Date.now();
  const humanReadableDateTime = new Intl.DateTimeFormat("default", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(timestamp);

  console.log("Current Date: ", humanReadableDateTime);
  console.info(`Server Listening on http://localhost:8000`);

  serve(requestHandler);
}