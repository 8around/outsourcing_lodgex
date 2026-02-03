import { Resend } from "resend";
import { render } from "@react-email/components";
import AdminNotificationEmail from "@/emails/admin-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ServiceRequestData {
  companyName: string;
  location: string;
  scale: string;
  services: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  additionalRequests?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * 관리자에게 새 서비스 신청 알림 이메일 발송
 */
export async function sendAdminNotification(
  data: ServiceRequestData,
  adminEmails: string[] = [process.env.ADMIN_EMAIL || "sjds77@naver.com"]
): Promise<EmailResult> {
  try {
    const submittedAt = new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const emailHtml = await render(
      AdminNotificationEmail({
        ...data,
        submittedAt,
      })
    );

    const { data: result, error } = await resend.emails.send({
      from: "noreply@souhgm.com",
      to: adminEmails,
      subject: `[SoUHGM] 새로운 컨설팅 신청 - ${data.companyName}`,
      html: emailHtml,
      replyTo: data.contactEmail,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: result?.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * 이메일 발송 재시도 로직
 */
export async function sendEmailWithRetry<T extends any[]>(
  emailFunction: (...args: T) => Promise<EmailResult>,
  args: T,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<EmailResult> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await emailFunction(...args);

    if (result.success) {
      return result;
    }

    if (attempt === maxRetries) {
      return result;
    }

    // Exponential backoff
    const delay = baseDelay * Math.pow(2, attempt - 1);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return { success: false, error: "Max retries exceeded" };
}

/**
 * 서비스 신청 시 관리자 이메일 발송
 */
export async function sendServiceRequestEmails(
  data: ServiceRequestData,
  adminEmails?: string[]
): Promise<{
  adminResult: EmailResult;
  clientResult: EmailResult;
}> {
  // 관리자에게만 이메일 발송
  const adminResult = await sendEmailWithRetry(sendAdminNotification, [
    data,
    adminEmails,
  ]);

  // 클라이언트 이메일은 항상 성공으로 처리
  const clientResult = { success: true, messageId: "skipped" };

  return { adminResult, clientResult };
}

/**
 * 이메일 주소 유효성 검사
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Rate limiting을 위한 간단한 캐시
 */
const emailCache = new Map<string, number>();

/**
 * Rate limiting 체크 (같은 이메일로 5분 내 중복 발송 방지)
 */
export function checkRateLimit(
  email: string,
  windowMs: number = 5 * 60 * 1000
): boolean {
  const now = Date.now();
  const lastSent = emailCache.get(email);

  if (lastSent && now - lastSent < windowMs) {
    return false; // Rate limit exceeded
  }

  emailCache.set(email, now);
  return true; // OK to send
}

/**
 * 캐시 정리 (메모리 누수 방지)
 */
export function cleanupEmailCache(): void {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  emailCache.forEach((timestamp, email) => {
    if (timestamp < oneHourAgo) {
      emailCache.delete(email);
    }
  });
}
