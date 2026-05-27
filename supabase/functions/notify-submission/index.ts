import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const YOUR_EMAIL = "peoplesgarments@gmail.com";
const ARCHIVE_URL = "https://peoplesgarments.com";

const header = `* PEOPLES &nbsp;&nbsp; GARMENTS *`;

const igIcon = `<a href="https://www.instagram.com/peoplesgarments/" style="display:inline-block;color:#000;text-decoration:none;"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#000"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>`;

serve(async (req) => {
  const body = await req.json();
  const record = body.record;
  const oldRecord = body.old_record;

  const isApproval = record.status === "approved" && oldRecord?.status === "pending";
  const isNewSubmission = !oldRecord && record.status === "pending";

  if (isApproval) {
    // Email to submitter on approval
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Peoples Garments <onboarding@resend.dev>",
        to: record.email,
        subject: "Your story is now live — Peoples Garments",
        html: `<div style="font-family:Arial,Helvetica,sans-serif;background:#fff;padding:2.5rem 2rem;text-align:center;max-width:480px;margin:0 auto;">
          <div style="font-weight:700;font-size:1.1rem;letter-spacing:-0.05em;color:#000;margin-bottom:2.5rem;">${header}</div>
          <p style="font-size:0.85rem;letter-spacing:-0.02em;color:#000;line-height:1.6;margin:0 0 0.6rem;">Hi ${record.name},</p>
          <p style="font-size:0.85rem;letter-spacing:-0.02em;color:#000;line-height:1.6;margin:0 0 1.8rem;">Your story has been approved and is now part of the Peoples Garments archive. Thank you for contributing.</p>
          <div style="background:#000;border-radius:999px;padding:0.7rem 1.6rem;display:inline-block;">
            <a href="${ARCHIVE_URL}" style="font-size:0.75rem;letter-spacing:-0.02em;color:#fff;text-decoration:none;font-family:Arial;font-weight:700;">enter the archive</a>
          </div>
        </div>`,
      }),
    });
  } else if (isNewSubmission) {
    // Email to submitter confirming receipt
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Peoples Garments <onboarding@resend.dev>",
        to: record.email,
        subject: "Thank you for your submission — Peoples Garments",
        html: `<div style="font-family:Arial,Helvetica,sans-serif;background:#fff;padding:2.5rem 2rem;text-align:center;max-width:480px;margin:0 auto;">
          <div style="font-weight:700;font-size:1.1rem;letter-spacing:-0.05em;color:#000;margin-bottom:2.5rem;">${header}</div>
          <p style="font-size:0.85rem;letter-spacing:-0.02em;color:#000;line-height:1.6;margin:0 0 1.8rem;">Thank you for submitting!<br>We will notify you when your story<br>is uploaded on the archive!</p>
          ${igIcon}
        </div>`,
      }),
    });

    // Email to you with submission details
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Peoples Garments <onboarding@resend.dev>",
        to: YOUR_EMAIL,
        subject: "New story submission — Peoples Garments",
        html: `<div style="font-family:Arial,Helvetica,sans-serif;background:#fff;padding:2.5rem 2rem;max-width:480px;margin:0 auto;">
          <div style="font-weight:700;font-size:1.1rem;letter-spacing:-0.05em;color:#000;margin-bottom:1.8rem;text-align:center;">${header}</div>
          <p style="font-size:0.7rem;letter-spacing:0.06em;color:rgba(0,0,0,0.4);margin:0 0 1rem;">NEW SUBMISSION</p>
          <table style="width:100%;font-size:0.75rem;border-collapse:collapse;">
            <tr><td style="color:rgba(0,0,0,0.4);padding:5px 0;width:80px;">Name</td><td style="color:#000;padding:5px 0;">${record.name}</td></tr>
            <tr><td style="color:rgba(0,0,0,0.4);padding:5px 0;">Email</td><td style="color:#000;padding:5px 0;">${record.email}</td></tr>
            <tr><td style="color:rgba(0,0,0,0.4);padding:5px 0;">Garment</td><td style="color:#000;padding:5px 0;">${record.garment_name}</td></tr>
            <tr><td style="color:rgba(0,0,0,0.4);padding:5px 0;">Origin</td><td style="color:#000;padding:5px 0;">${record.origin}</td></tr>
            <tr><td style="color:rgba(0,0,0,0.4);padding:5px 0;">Instagram</td><td style="color:#000;padding:5px 0;">${record.instagram || "—"}</td></tr>
          </table>
          <div style="margin-top:1rem;padding-top:1rem;border-top:0.5px solid rgba(0,0,0,0.1);">
            <p style="font-size:0.7rem;color:rgba(0,0,0,0.4);margin:0 0 0.4rem;letter-spacing:0.04em;">STORY</p>
            <p style="font-size:0.75rem;color:#000;line-height:1.6;margin:0;">${record.memory_story}</p>
          </div>
          <p style="font-size:0.65rem;color:rgba(0,0,0,0.3);margin:1.2rem 0 0;">Log into Supabase to approve or reject.</p>
        </div>`,
      }),
    });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
