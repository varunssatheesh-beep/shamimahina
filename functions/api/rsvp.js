export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM rsvps ORDER BY timestamp DESC"
    ).all();
    
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    const stmt = context.env.DB.prepare(
      "INSERT INTO rsvps (name, phone, attendees, events) VALUES (?, ?, ?, ?)"
    ).bind(
      data.name,
      data.phone || "",
      data.attendees || "1",
      data.events || "Both"
    );
    
    const result = await stmt.run();
    
    if (result.success) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Failed to insert" }), { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
