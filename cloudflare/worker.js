/**
 * Orange-cloud proxy to the Lambda Function URL (Cloudflare Free).
 * Origin Rules Host override is Pro; a Worker fetch() sets Host to the Lambda hostname
 * so Function URLs do not 403. Request body is streamed (Stripe webhook signature).
 * 3xx from Lambda (S3 signed URLs) are passed through, not followed.
 */

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);

    if (incoming.hostname === "www.tabledetective.com") {
      incoming.hostname = "tabledetective.com";
      return Response.redirect(incoming.toString(), 301);
    }

    const origin = String(env.LAMBDA_ORIGIN).replace(/\/+$/, "");
    const target = new URL(incoming.pathname + incoming.search, `${origin}/`);

    const headers = new Headers(request.headers);
    headers.set("X-Forwarded-Host", incoming.host);
    headers.set("X-Forwarded-Proto", "https");
    headers.delete("host");

    /** @type {RequestInit} */
    const init = {
      method: request.method,
      headers,
      redirect: "manual",
    };
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
    }

    const upstream = await fetch(target, init);
    const out = new Headers(upstream.headers);
    out.delete("x-amzn-requestid");
    out.delete("x-amzn-trace-id");
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: out,
    });
  },
};
