---
title: "Build an AI Voice Agent with ElevenLabs and n8n — Step-by-Step Guide 2026"
date: 2026-05-29
author: "AIPlaybook Editorial Team"
category: "Tutorials"
tags: [voice-agent, elevenlabs, n8n, tts, voice-ai, phone-agent, tutorial, "2026"]
cover: /images/tutorials/build-ai-voice-agent-elevenlabs-2026/cover.png
meta_description: "Build a fully functional AI voice agent using ElevenLabs for text-to-speech, n8n for workflow automation, and OpenAI for conversation intelligence. Includes phone integration setup."
---

## What You'll Learn

This tutorial walks through building a production-ready AI voice agent that:

- Handles inbound phone calls with natural conversation
- Uses ElevenLabs for ultra-realistic voice synthesis
- Integrates with n8n workflows for business logic (CRM lookup, order status, appointment booking)
- Supports outbound calling for reminders and follow-ups
- Includes DTMF keypad recognition for menu navigation

**Prerequisites:** ElevenLabs API key, n8n instance, Twilio account with a phone number, OpenAI API key.

## Step 1: Set Up ElevenLabs for Voice Synthesis

ElevenLabs in 2026 offers three tiers relevant to voice agents:

| Feature | Turbo v2 | Turbo v2.5 | Multilingual v2 |
|---------|----------|------------|-----------------|
| Latency | <200ms | <300ms | <400ms |
| Voice quality | Excellent | Superior | Excellent |
| Languages | 29 | 29 | 32 |
| Streaming | ✅ | ✅ | ✅ |
| Voice cloning | 10 voices | 30 voices | 30 voices |

**Create your agent voice:**

```bash
# Clone a voice via ElevenLabs API
curl -X POST "https://api.elevenlabs.io/v1/voices/add" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -F "name=CustomerSupportAgent" \
  -F "files=@sample_voice.wav"
```

Sample voice files should be 30–60 seconds of clear speech, no background noise. Use a professional voice talent or record yourself in a quiet room with a USB microphone.

**Alternative:** Use ElevenLabs pre-made voices. The "Rachel" voice (serene, warm) works well for customer support; "Domi" (energetic, clear) for sales calls.

```javascript
// Voice settings optimized for phone calls
const voiceConfig = {
  stability: 0.35,       // Lower = more expressive, less robotic
  similarity_boost: 0.75, // Higher = closer to original voice sample
  style: 0.15,            // Higher = more exaggerated emotion
  use_speaker_boost: true // Compresses dynamic range for phone lines
};
```

**Pro tip:** Create separate voices for different scenarios — a calm voice for complaint handling, an upbeat voice for sales calls, and a neutral voice for informational calls like appointment reminders.

## Step 2: Configure Twilio for Phone Integration

In Twilio, set up a **TwiML Bin** (TwiML = Twilio Markup Language) for your phone number:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://your-ngrok-url/audio-stream">
      <Parameter name="voiceId" value="21m00Tcm4TlvDq8ikWAM" />
      <Parameter name="agentMode" value="conversational" />
    </Stream>
  </Connect>
</Response>
```

For development, use **ngrok** to expose your local n8n instance:

```bash
ngrok http 5678
```

Copy the ngrok URL (e.g., `https://a1b2.ngrok.io`) into your Twilio webhook configuration:

**Twilio Console → Phone Numbers → Manage → Active Numbers → Your Number → Voice & Fax**

Set "A call comes in" Webhook → `https://your-ngrok-url/webhook/twilio-incoming`

Create an n8n webhook endpoint to handle incoming calls:

- **Webhook node** (POST): receives Twilio's call webhook
- **Function node**: extract `CallSid`, `From` (caller number), `To` (your number)
- **Switch node**: route based on caller ID (existing customer → CRM lookup, new caller → greet + menu)

## Step 3: Build the Conversation Flow in n8n

Design your conversation as a state machine in n8n:

**State 1 — Greeting:**

```
Webhook → ElevenLabs TTS → Twilio Say/Gather
```

Generate the greeting audio:

```javascript
// Code node — generate dynamic greeting
const hour = new Date().getHours();
let greeting = "Good morning";

if (hour >= 12 && hour < 17) greeting = "Good afternoon";
if (hour >= 17 || hour < 5) greeting = "Good evening";

$json.greeting = `${greeting}! Thank you for calling AIPlaybook Support. ` +
  `I'm your AI assistant. How can I help you today? ` +
  `You can say 'billing', 'technical support', 'sales', or just tell me what you need.`;
```

**State 2 — Speech Recognition:**

Use **Twilio's <Gather>** verb with `input="speech dtmf"` to capture both voice and keypad input.

```
<Gather input="speech dtmf" speechTimeout="auto" speechModel="experimental_conversations" action="/webhook/twilio-gather" method="POST">
  <Say voice="Polly.Joanna-Neural">How can I help you today?</Say>
</Gather>
```

**State 3 — Intent Classification:**

Pass the transcribed speech to OpenAI:

```
System: You are a call routing classifier. Analyze the customer's request and respond with JSON:
{
  "intent": "billing" | "technical" | "sales" | "general" | "escalate",
  "urgency": "low" | "medium" | "high",
  "sentiment": "positive" | "neutral" | "frustrated",
  "key_entities": ["invoice", "refund", "login"]
}

Customer: {{$json.transcription}}
```

**State 4 — Business Logic Execution:**

Route based on intent:

- **billing** → HTTP Request node → Stripe API (get latest invoice, payment status)
- **technical** → HTTP Request → knowledge base (search Notion/Confluence for relevant articles)
- **sales** → HTTP Request → HubSpot CRM (check if caller exists, get account tier)
- **general** → ElevenLabs TTS with FAQ responses
- **escalate** → Slack webhook → #support-escalations channel

```javascript
// Code node — billing lookup flow
const callerPhone = $json.From;
const stripeResponse = await fetch(`https://api.stripe.com/v1/customers?phone=${callerPhone}`, {
  headers: { Authorization: `Bearer ${$credentials.stripe.secretKey}` }
});
const customer = await stripeResponse.json();

if (customer.data.length > 0) {
  const balance = customer.data[0].balance / 100;
  if (balance > 0) {
    $json.response_text = `You have an outstanding balance of $${Math.abs(balance)}. ` +
      `Would you like to make a payment now? You can say 'yes' or 'no'.`;
  } else {
    $json.response_text = `Your account is current. Your last invoice of $${customer.data[0].lastInvoice} was paid on ${customer.data[0].lastPaymentDate}. Is there anything else?`;
  }
} else {
  $json.response_text = `I couldn't find an account under this number. Let me transfer you to billing.`;
  $json.escalate = true;
}
```

**State 5 — Response Generation (ElevenLabs TTS):**

```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream
Headers: {
  "xi-api-key": "{{$credentials.elevenlabs.apiKey}}",
  "Content-Type": "application/json"
}
Body: {
  "text": "{{$json.response_text}}",
  "model_id": "eleven_turbo_v2_5",
  "voice_settings": {
    "stability": 0.35,
    "similarity_boost": 0.75,
    "style": 0.15
  }
}
```

Return the audio stream to Twilio via **Say** or **Play** verb.

## Step 4: Add DTMF Menu Navigation

For users who can't or don't want to speak, implement a keypad fallback:

```
<Gather input="speech dtmf" numDigits="1" action="/webhook/twilio-dtmf" method="POST">
  <Say voice="Polly.Joanna-Neural">
    Press 1 for billing. Press 2 for technical support. Press 3 for sales.
    Press 0 to speak with a human agent.
  </Say>
</Gather>
```

In your n8n webhook, parse the `Digits` parameter:

```javascript
// DTMF routing
const digit = $json.Digits;
const dtmfMap = {
  '1': { intent: 'billing', context: 'dtmf' },
  '2': { intent: 'technical', context: 'dtmf' },
  '3': { intent: 'sales', context: 'dtmf' },
  '0': { intent: 'escalate', context: 'dtmf' }
};
$json = { ...$json, ...dtmfMap[digit] || { intent: 'general', context: 'dtmf_unrecognized' } };
```

## Step 5: Outbound Calling — Appointment Reminders

Schedule an n8n **Cron Trigger** for daily outbound calls:

```javascript
// Code node — query database for tomorrow's appointments
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dateStr = tomorrow.toISOString().split('T')[0];

// Example: Supabase query
const { data: appointments } = await supabase
  .from('appointments')
  .select('*')
  .eq('date', dateStr)
  .eq('reminder_sent', false);
```

For each appointment, initiate a call via Twilio:

```
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Calls.json
Body: {
  "To": "+{{$json.phone}}",
  "From": "+YOUR_TWILIO_NUMBER",
  "Url": "https://your-domain.com/webhook/twilio-outbound",
  "StatusCallback": "https://your-domain.com/webhook/call-status"
}
```

The outbound webhook generates the reminder message:

```
<Response>
  <Say voice="Polly.Joanna-Neural">
    Hello {{first_name}}. This is a friendly reminder from AIPlaybook about your appointment
    tomorrow at {{appointment_time}}. Please arrive 10 minutes early.
    If you need to reschedule, press 1 now or visit our website.
  </Say>
  <Gather numDigits="1" action="/webhook/reschedule" method="POST" timeout="5">
    <Pause length="2"/>
  </Gather>
</Response>
```

## Step 6: Add Context Awareness and Memory

**Short-term memory** (per call): Store conversation history in n8n's **Redis** node:

```javascript
// Store conversation state
await redis.setex(
  `call:${$json.CallSid}`,
  3600, // expire after 1 hour
  JSON.stringify({
    history: [...prevHistory, {role: "user", text: transcription}, {role: "assistant", text: responseText}],
    context: currentContext,
    user: identifiedUser
  })
);
```

**Long-term memory** (across calls): Use **Airtable** or **Supabase** to store:

- `phone_number`, `last_called_at`, `call_count`
- `common_intents` (array of intents from last 10 calls)
- `notes` (summary of the last interaction)

```
// System prompt for context-aware response
You are an AI voice agent. The customer has called {{call_count}} times before.
Their last call was about {{last_intent}}.
Last note: "{{last_call_notes}}"

Current request: {{transcription}}
```

## Best Practices

- **Test with your own voice first.** Call your agent and converse for 10+ minutes to catch awkward pauses, misinterpretations, and loop conditions.
- **Set a conversation timeout.** If the caller is silent for >15 seconds, offer help again; after 30 seconds, offer to transfer to a human.
- **Log all calls.** Store transcriptions, intent classifications, and sentiment scores in a database. Review weekly to identify common issues.
- **Warm transfer to humans.** When escalating, use Twilio's <Dial> verb with `callerId` and pass a whisper message: "This call is about a billing dispute. Customer is frustrated."
- **Use phases for deployment.** Phase 1: informational only (hours, address, FAQ). Phase 2: simple transactions (password reset, appointment check). Phase 3: complex handling (billing disputes, cancellations).

## Troubleshooting

**Issue:** Audio latency makes conversation feel unnatural
**Fix:** Switch to ElevenLabs Turbo v2.5 model. Use streaming mode (not full-file generation). Deploy n8n on infrastructure geographically close to Twilio's US East region.

**Issue:** Speech recognition accuracy is poor with accents
**Fix:** Enable Twilio's `enhanced` speech model: `speechModel="experimental_conversations"`. For non-English calls, set `language="es-ES"` (or appropriate locale) in the Gather verb.

**Issue:** Calls timeout during complex workflows
**Fix:** Twilio has a 30-second default timeout for the first TwiML instruction. Set `statusCallback` to handle mid-call state changes. Keep each Gather/Say interaction under 15 seconds of speech to avoid browser/disconnect timeout.

**Issue:** Multiple intents in one customer utterance
**Fix:** Use OpenAI's function calling to extract all intents: `"functions": [{"name": "extract_intents", "parameters": {"type": "object", "properties": {"primary_intent": {"type": "string"}, "secondary_intents": {"type": "array", "items": {"type": "string"}}}}}]`. Handle secondary intents after resolving the primary one.

## FAQ

**Q: How much does running a voice agent cost per minute?**
A: Roughly $0.03–0.05/minute: ElevenLabs TTS (~$0.002/sec x 60 = $0.12/min for generated speech, but actual speech is ~40% of call), Twilio voice ($0.013/min), OpenAI STT + LLM (~$0.005/min for Whisper + GPT-4o-mini). A 3-minute call costs ~$0.08.

**Q: Can I use a local voice model instead of ElevenLabs?**
A: Yes — Coqui TTS or Piper TTS can run locally, but quality is noticeably lower. For production phone systems, ElevenLabs' latency and voice quality are worth the cost. MeloTTS is a good free alternative for basic use.

**Q: What about compliance (call recording laws)?**
A: Inform callers at the beginning: "This call may be recorded for quality and training purposes." Store recordings in encrypted S3. Comply with two-party consent states (CA, FL, IL, PA, WA, etc.) by announcing recording before the conversation starts.

**Q: Can the agent dynamically switch languages mid-call?**
A: Yes — detect the caller's language from their first utterance using Whisper's language detection. Switch the ElevenLabs model to multilingual v2 and use GPT-4o with a language-switching system prompt. Cache the detected language per caller.
