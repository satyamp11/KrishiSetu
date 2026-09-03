
import twilio from 'twilio';

interface SmsConfig {
  accountSid: string | undefined;
  authToken: string | undefined;
  fromNumber: string | undefined;
  enabled: boolean;
}

function loadSmsConfig(): SmsConfig {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_PHONE_NUMBER,
    // OTP_SMS_ENABLED defaults to false so dev environments don't accidentally
    // send real SMS while testing. Set to "true" in production .env
    enabled: process.env.OTP_SMS_ENABLED?.toLowerCase() === 'true'
  };
}



export interface SmsSendRequest {
  phoneNumber: string;
  /** The 6-digit OTP to include in the message body */
  otp: string;
}

export interface SmsSendResult {
  success: boolean;
  messageSid?: string;
  mode: 'twilio_sms' | 'console_fallback' | 'disabled_fallback';
}


function toE164Indian(rawPhone: string): string | null {
  if (!rawPhone || rawPhone.includes('@')) {
    // Email identifier — SMS not applicable
    return null;
  }

  const digitsOnly = rawPhone.replace(/\D/g, '');

  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }

  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.length === 13 && rawPhone.startsWith('+91')) {
    return `+91${digitsOnly.slice(-10)}`;
  }

  // Unrecognized format — log and skip
  console.warn(`[smsService] Cannot format phone to E.164: "${rawPhone}"`);
  return null;
}



export const smsService = {

  async sendOtpSms(phoneNumber: string, otp: string): Promise<boolean> {
    const config = loadSmsConfig();

    if (phoneNumber.includes('@')) {
      console.log(`[smsService] Identifier is email (${phoneNumber}) — SMS skipped. OTP is in DB.`);
      return true;
    }

    const e164Number = toE164Indian(phoneNumber);
    if (!e164Number) {
      console.error(`[smsService] Could not format "${phoneNumber}" to E.164 — SMS not sent.`);
      return false;
    }

    if (!config.enabled || !config.accountSid || !config.authToken || !config.fromNumber) {
      console.log('\n══════════════════════════════════════════════════════');
      console.log(`📱 [SMS FALLBACK - DEV MODE]`);
      console.log(`   To      : ${e164Number}`);
      console.log(`   OTP     : ${otp}`);
      console.log(`   Valid   : 5 minutes`);
      console.log(`   Reason  : OTP_SMS_ENABLED=${config.enabled}, Twilio creds present=${!!(config.accountSid && config.authToken)}`);
      console.log('══════════════════════════════════════════════════════\n');
      return true;
    }

    try {
      const client = twilio(config.accountSid, config.authToken);

      const message = await client.messages.create({
        body: `🌾 KrishiSetu OTP: ${otp}\n\nYour one-time verification code is valid for 5 minutes.\nDo not share this OTP with anyone.\n\n- KrishiSetu Team`,
        from: config.fromNumber,
        to: e164Number
      });

      console.log(`[smsService] ✅ OTP SMS sent to ${e164Number} | SID: ${message.sid} | Status: ${message.status}`);
      return true;

    } catch (error: unknown) {
      // Log the full Twilio error server-side but never expose it to the client
      const twilioError = error as { code?: number; message?: string; status?: number };
      console.error(
        `[smsService] ❌ Twilio SMS failed for ${e164Number}:`,
        `Code=${twilioError.code}, Status=${twilioError.status}, Message="${twilioError.message}"`
      );

     
      if (twilioError.code === 21608) {
        console.warn(
          `[smsService] ⚠️  TRIAL ACCOUNT: ${e164Number} is not a Verified Caller ID in Twilio Console.`,
          'Add this number at https://console.twilio.com/us1/develop/phone-numbers/manage/verified'
        );
      }

      return false;
    }
  }
};
