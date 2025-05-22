import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET favorites
export async function GET() {
  const cookieStore = cookies();
  const favs = cookieStore.get("favorites")?.value;
  return NextResponse.json(favs ? JSON.parse(favs) : []);
}

// POST - dodavanje favorita
export async function POST(request) {
  const body = await request.json();

  if (!body || !body.id || !body.name || !body.type) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const cookieStore = cookies();
  const favs = cookieStore.get("favorites")?.value;
  const parsed = favs ? JSON.parse(favs) : [];

  const alreadyExists = parsed.some((item) => item.id === body.id && item.type === body.type);
  if (alreadyExists) {
    return NextResponse.json({ message: "Already in favorites" }, { status: 200 });
  }

  const updated = [...parsed, body];
  const res = NextResponse.json({ success: true });
  res.cookies.set("favorites", JSON.stringify(updated), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 dana
  });

  return res;
}

// DELETE - uklanjanje iz favorita
export async function DELETE(request) {
  const body = await request.json();

  if (!body.id || !body.type) {
    return NextResponse.json({ error: "Missing id or type" }, { status: 400 });
  }

  const cookieStore = cookies();
  const favs = cookieStore.get("favorites")?.value;
  const parsed = favs ? JSON.parse(favs) : [];

  const updated = parsed.filter((f) => !(f.id === body.id && f.type === body.type));

  const res = NextResponse.json({ success: true });
  res.cookies.set("favorites", JSON.stringify(updated), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 dana
  });

  return res;
}
