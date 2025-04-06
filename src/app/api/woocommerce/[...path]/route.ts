import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  const { path } = params;
  const url = new URL(`${process.env.WOOCOMMERCE_API_URL}${path.join("/")}`);
  req.nextUrl.searchParams.forEach((value, key) =>
    url.searchParams.append(key, value)
  );
  console.debug({ url: url.toString() });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
      ).toString("base64")}`,
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { path } = params;
  const url = `${process.env.WOOCOMMERCE_API_URL}${path.join("/")}`;
  const body = await req.json();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(
        `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
      ).toString("base64")}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
