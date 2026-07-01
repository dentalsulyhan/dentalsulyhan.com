# GTM / GA4 / Meta Pixel setup for Dental Sulyhan

This project already has the frontend plumbing for analytics.  
This document is for the person who will configure Google Tag Manager and related tags.

## What is already implemented

The site now pushes analytics events into `window.dataLayer` from the frontend.

Implemented events:

- `page_view`
- `site_click`
- `click_phone`
- `click_email`
- `click_whatsapp`
- `click_telegram`
- `contact_form_submit`
- `contact_form_error`

The implementation is on the site code, so GTM only needs triggers/tags. No extra code changes are required for the basic setup.

## Where to enter IDs in admin

In Payload admin:

- `Site Settings`
- `Analytics & Tracking`

Fields available:

- `Google Tag Manager ID`
- `GA4 Measurement ID`
- `Meta Pixel ID`

Recommended usage:

- If you have GTM, put only the `GTM-XXXXXXX` container ID there.
- Add GA4 and Meta Pixel inside GTM, not directly in the site.
- Leave `GA4 Measurement ID` and `Meta Pixel ID` empty if GTM will manage them.

Fallback behavior:

- If GTM ID is set, the site loads GTM.
- If GTM is not set, the site can still load GA4 / Meta Pixel directly from the other fields.
- For production, GTM should be the main integration point.

## Recommended GTM structure

### 1. Base container

Create one GTM container for this site.

Use:

- `Google Tag` or `GA4 Configuration` tag
- Trigger: `All Pages`

If GTM manages GA4:

- add your GA4 measurement ID to the GA4 tag
- do not also load GA4 directly from the site settings

### 2. Event tags

Create GA4 event tags for the following custom events:

- `page_view`
- `contact_form_submit`
- `click_phone`
- `click_email`
- `click_whatsapp`
- `click_telegram`
- `site_click`

Recommended GA4 event names:

- `page_view`
- `generate_lead` or `contact_form_submit`
- `click_phone`
- `click_email`
- `click_whatsapp`
- `click_telegram`
- `site_click`

The exact GA4 event name can be chosen by the person setting up analytics, but keep it consistent.

## Suggested conversions in GA4

Mark these as conversions in GA4:

- `contact_form_submit`
- `click_phone`
- `click_whatsapp`
- `click_telegram`

Optionally mark:

- `click_email`

`site_click` should usually stay as a diagnostic / behavior event, not a conversion.

## Event payload shape

The site sends useful parameters alongside the event.

Examples:

```json
{
  "event": "contact_form_submit",
  "locale": "es",
  "form_name": "contact_form",
  "patient_type": "New patient",
  "referral_source": "Instagram"
}
```

```json
{
  "event": "click_phone",
  "locale": "en",
  "phone_number": "+34 665-399-280",
  "link_text": "+34 665-399-280",
  "page_path": "/en/services"
}
```

```json
{
  "event": "site_click",
  "locale": "uk",
  "link_type": "internal",
  "link_text": "Services",
  "link_url": "/uk/services",
  "page_path": "/uk"
}
```

Useful parameters available for GTM / GA4:

- `locale`
- `page_path`
- `page_title`
- `page_location`
- `link_type`
- `link_text`
- `link_url`
- `phone_number`
- `email_address`
- `form_name`
- `patient_type`
- `referral_source`
- `reason` for form errors

## What to build in GTM

### Variables

Create Data Layer Variables for:

- `locale`
- `page_path`
- `page_title`
- `page_location`
- `link_type`
- `link_text`
- `link_url`
- `phone_number`
- `email_address`
- `form_name`
- `patient_type`
- `referral_source`
- `reason`

### Triggers

Create Custom Event triggers:

- `page_view`
- `contact_form_submit`
- `contact_form_error`
- `click_phone`
- `click_email`
- `click_whatsapp`
- `click_telegram`
- `site_click`

### GA4 Event Tags

For each trigger, create a GA4 event tag.

Example:

- Trigger: `contact_form_submit`
- Tag type: GA4 Event
- Event name: `generate_lead`

Recommended mapping:

- `contact_form_submit` -> `generate_lead`
- `click_phone` -> `click_phone`
- `click_whatsapp` -> `click_whatsapp`
- `click_telegram` -> `click_telegram`
- `click_email` -> `click_email`

## Testing checklist

1. Open GTM Preview / Tag Assistant.
2. Visit the site.
3. Check that `page_view` appears on navigation.
4. Click phone, WhatsApp, Telegram, and email links.
5. Submit the contact form successfully.
6. Verify that each event is visible in GTM Preview.
7. Verify GA4 Realtime receives the events.

## Important notes

- Do not duplicate GA4 both in GTM and directly in site settings at the same time.
- If GTM is used, the recommended path is: GTM container only in site settings, all measurement tags managed inside GTM.
- The site is already prepared for preview / production domains. No code changes are needed to switch domains later.

## Files involved in the codebase

- `src/app/(frontend)/[locale]/layout.tsx`
- `src/components/TrackingScripts.tsx`
- `src/components/AnalyticsListener.tsx`
- `src/components/ContactForm.tsx`
- `src/lib/analytics.ts`
- `src/globals/SiteSettings.ts`

## Short summary

If you want the cleanest setup:

1. Put the GTM container ID in `Site Settings -> Analytics & Tracking`.
2. Add GA4 and Meta Pixel inside GTM.
3. Use the provided custom events for conversions and click tracking.

