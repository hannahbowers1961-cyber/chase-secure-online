import { NextResponse } from "next/server";
import { Resend } from "resend";

// You get this free API key by signing up at resend.com
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();
    
    // Generate a 6-digit OTP (One Time Password)
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // TODO: Save 'verificationCode' to your database here so you can verify it later

    // Send the email via Resend
    const { data, error } = await resend.emails.send({
      from: 'security@yourbankapp.com', // Must be a domain you own
      to: [email],
      subject: 'Your Secure Login Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Security Verification</h2>
          <p>Please use the following 6-digit code to access your account. This code will expire in 10 minutes.</p>
          <h1 style="color: #0b5cba; letter-spacing: 5px;">${verificationCode}</h1>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });

    return NextResponse.json({ success: true, message: "Code sent successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}