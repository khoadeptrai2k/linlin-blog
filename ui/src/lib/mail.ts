import "server-only";

type MailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

function fromAddress() {
  return process.env.MAIL_FROM || process.env.SMTP_USER || "Linlin <noreply@localhost>";
}

async function sendWithResend(input: MailInput) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`RESEND_FAILED:${detail.slice(0, 180)}`);
  }
  return true;
}

async function sendWithSmtp(input: MailInput) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return false;
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: fromAddress(),
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
  return true;
}

export async function sendMail(input: MailInput) {
  if (await sendWithResend(input)) return { sent: true as const };
  if (await sendWithSmtp(input)) return { sent: true as const };
  console.info(`[linlin-mail] ${input.to}\n${input.subject}\n${input.text}`);
  return { sent: false as const };
}

export function appBaseUrl() {
  return (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function loginEmailCopy(locale: string, name: string, link: string) {
  const greet = name.trim() || "bạn";
  if (locale === "en") {
    return {
      subject: "Your Linlin login link",
      text: `Hi ${greet}, open this link to sign in: ${link}\nThis link expires in 30 minutes.`,
      html: `<p>Hi ${greet},</p><p>Tap the button to sign in to Linlin and take your placement test.</p><p><a href="${link}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#2b96b8;color:#fff;text-decoration:none;font-weight:700">Sign in</a></p><p>This link expires in 30 minutes.</p>`,
    };
  }
  if (locale === "zh") {
    return {
      subject: "林林登录链接",
      text: `${greet}，打开此链接登录：${link}\n链接 30 分钟内有效。`,
      html: `<p>${greet}，你好。</p><p>点击按钮登录林林并完成入学测试。</p><p><a href="${link}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#2b96b8;color:#fff;text-decoration:none;font-weight:700">登录</a></p><p>链接 30 分钟内有效。</p>`,
    };
  }
  if (locale === "th") {
    return {
      subject: "ลิงก์เข้าสู่ระบบ Linlin",
      text: `สวัสดี ${greet} เปิดลิงก์นี้เพื่อเข้าสู่ระบบ: ${link}\nลิงก์หมดอายุใน 30 นาที`,
      html: `<p>สวัสดี ${greet}</p><p>กดปุ่มเพื่อเข้าสู่ระบบ Linlin และทำแบบทดสอบวัดระดับ</p><p><a href="${link}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#2b96b8;color:#fff;text-decoration:none;font-weight:700">เข้าสู่ระบบ</a></p><p>ลิงก์หมดอายุใน 30 นาที</p>`,
    };
  }
  return {
    subject: "Link đăng nhập Linlin",
    text: `Chào ${greet}, mở link này để đăng nhập: ${link}\nLink hết hạn sau 30 phút.`,
    html: `<p>Chào ${greet},</p><p>Bấm nút để đăng nhập Linlin và làm bài test đầu vào.</p><p><a href="${link}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#2b96b8;color:#fff;text-decoration:none;font-weight:700">Đăng nhập</a></p><p>Link hết hạn sau 30 phút.</p>`,
  };
}
