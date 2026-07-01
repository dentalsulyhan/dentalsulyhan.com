# Pre-Launch Checklist

This checklist covers the remaining work before deploying the new Payload + Next.js website for Dental Clinic Sulyhan.

It is focused on:

- SEO readiness
- WordPress migration safety
- content completeness
- performance
- accessibility
- production QA

## 1. SEO

### Required before launch

- [ ] Fill `SEO Settings -> baseUrl` with the final production domain.
- [ ] Fill `SEO Settings -> siteName`.
- [ ] Fill `SEO Settings -> titleTemplate`.
- [ ] Fill `SEO Settings -> defaultOgImage`.
- [ ] Fill `SEO Settings -> organizationName`.
- [ ] Fill `SEO Settings -> organizationPhone`.
- [ ] Fill `SEO Settings -> organizationEmail`.
- [ ] Fill `SEO Settings -> organizationAddress`.

### Metadata QA

- [ ] Check homepage `/` source HTML.
- [ ] Check homepage `/en` source HTML.
- [ ] Check homepage `/uk` source HTML.
- [ ] Check services listing pages for all locales:
  - `/tratamientos`
  - `/en/services`
  - `/uk/poslugy`
- [ ] Check at least 3 service detail pages in all locales.

### For each checked page confirm

- [ ] Correct `<title>`.
- [ ] Correct `<meta name="description">`.
- [ ] Correct canonical URL.
- [ ] Correct `hreflang` links for `es`, `en`, `uk`.
- [ ] Correct `x-default`.
- [ ] Correct `og:title`, `og:description`, `og:url`.
- [ ] `og:image` exists.
- [ ] `twitter:image` exists.
- [ ] No accidental `/home` in public metadata.
- [ ] No accidental localhost URLs after production domain is configured.

### Technical SEO

- [ ] Check `/robots.txt` on production domain.
- [ ] Check `/sitemap.xml` on production domain.
- [ ] Confirm 404 pages are `noindex`.
- [ ] Confirm 404 pages return HTTP 404, not 200.
- [ ] Validate JSON-LD on:
  - homepage
  - services listing page
  - service detail page

## 2. WordPress Migration

### URL mapping

- [ ] Export or list all important old WordPress URLs.
- [ ] Build a redirect mapping table:
  - old URL
  - new URL
  - redirect type `301`
- [ ] Include:
  - homepage variations
  - service pages
  - contact page or anchors
  - any legacy media or landing URLs
- [ ] Decide what should happen with URLs that no longer exist:
  - redirect to closest relevant page
  - or intentionally return 404

### Redirect rules

- [ ] Implement 301 redirects before launch.
- [ ] Test the most important old URLs manually.
- [ ] Ensure no redirect chains.
- [ ] Ensure no redirect loops.

## 3. Content Completion

### CMS content

- [ ] Review all pages in `es`.
- [ ] Review all pages in `en`.
- [ ] Review all pages in `uk`.
- [ ] Review all services in `es`.
- [ ] Review all services in `en`.
- [ ] Review all services in `uk`.

### Confirm for each locale

- [ ] Final page titles are translated.
- [ ] Final service titles are translated.
- [ ] CTA button labels are translated.
- [ ] Form copy is translated.
- [ ] Section headings are translated.
- [ ] No English copy remains on Spanish or Ukrainian pages unless intentional.
- [ ] No placeholder text remains.
- [ ] No empty sections are rendered.
- [ ] No empty buttons are rendered.

### Images and media

- [ ] All important images have proper alt text in CMS.
- [ ] Team images have correct names.
- [ ] Promotion images are correct.
- [ ] Gallery images are correct.
- [ ] Logo and favicon are finalized.

## 4. Navigation and UX

### Menus

- [ ] Confirm all menu items are intentional.
- [ ] Confirm `Blog` should remain hidden or visible.
- [ ] Confirm every anchor link points to an existing section.
- [ ] Confirm mobile menu links work correctly.
- [ ] Confirm language switcher keeps the user on the equivalent localized page.

### Contact experience

- [ ] Confirm phone link works.
- [ ] Confirm WhatsApp link works.
- [ ] Confirm Telegram link works.
- [ ] Confirm email link works.
- [ ] Confirm contact form sends successfully.
- [ ] Confirm success and error states look correct.
- [ ] Confirm Turnstile works in production.

## 5. Performance

### High priority

- [ ] Replace key content images with `next/image` where practical:
  - homepage hero
  - service hero images
  - service content images
  - gallery
  - team cards
  - logos
- [ ] Set explicit dimensions or stable aspect ratios for above-the-fold media.
- [ ] Verify the homepage LCP image is optimized and not oversized.
- [ ] Verify no huge original uploads are being served unnecessarily.

### Image optimization

- [ ] Compress large JPG/PNG assets before production.
- [ ] Prefer modern formats where possible.
- [ ] Ensure social preview image is optimized but high quality.
- [ ] Check that repeated decorative images are not heavier than needed.

### Script and embed control

- [ ] Only enable GTM/GA4/Meta Pixel if actually needed at launch.
- [ ] Review third-party embeds:
  - Google reviews
  - maps
  - any custom embed code
- [ ] Remove unused tracking scripts or widgets.
- [ ] Avoid loading non-critical scripts before interaction.

### Runtime checks

- [ ] Run Lighthouse on:
  - homepage
  - one services listing page
  - one service detail page
- [ ] Watch especially:
  - LCP
  - CLS
  - total image weight
  - unused JavaScript
  - render-blocking resources

## 6. Accessibility

### Required improvements

- [ ] Add proper labels or accessible names for form inputs.
- [ ] Check keyboard navigation in header and mobile menu.
- [ ] Check focus states for links and buttons.
- [ ] Check color contrast on all main sections.
- [ ] Confirm all interactive icons have accessible names.
- [ ] Confirm accordion controls are usable with keyboard only.
- [ ] Confirm modal or overlay states do not trap users incorrectly.

### Content accessibility

- [ ] Ensure heading order is logical on every template.
- [ ] Ensure images that are meaningful have meaningful alt text.
- [ ] Ensure decorative images do not create noise if they are not content-bearing.

## 7. Security and Trust

- [ ] Review any CMS fields that allow custom HTML or embed code.
- [ ] Confirm only trusted editors can modify script/embed content.
- [ ] Confirm form emails go to the correct inbox.
- [ ] Confirm no test email addresses or test phone numbers remain.
- [ ] Confirm no staging or localhost URLs remain in content.

## 8. Production Configuration

- [ ] Set production environment variables.
- [ ] Set correct public site URL.
- [ ] Set Turnstile production keys.
- [ ] Set email delivery credentials.
- [ ] Set storage/CDN configuration.
- [ ] Confirm favicon API works on production.
- [ ] Confirm manifests and icons resolve on production.

## 9. Final QA Pass

### Desktop

- [ ] Homepage
- [ ] Services listing
- [ ] Service detail
- [ ] Contact form
- [ ] 404
- [ ] Header and footer

### Mobile

- [ ] Homepage
- [ ] Services listing
- [ ] Service detail
- [ ] Contact form
- [ ] Mobile menu
- [ ] 404

### Cross-locale

- [ ] Spanish root uses `/`
- [ ] English uses `/en`
- [ ] Ukrainian uses `/uk`
- [ ] All localized service paths are correct
- [ ] Language switching preserves matching content

## 10. Nice-to-Have After Launch

- [ ] Add Search Console and Bing Webmaster setup.
- [ ] Submit sitemap in Search Console.
- [ ] Add analytics event review after first live traffic.
- [ ] Build a blog only when content and information architecture are ready.
- [ ] Replace more raw `<img>` usage with optimized image handling across the codebase.
- [ ] Improve form accessibility beyond the minimum launch threshold.

## Suggested Order

1. Finalize CMS SEO settings.
2. Finalize content and translations.
3. Build WordPress redirect map.
4. Improve key performance hotspots.
5. Run full metadata and structured data QA.
6. Run full desktop/mobile QA.
7. Deploy to production.
8. Re-check metadata, robots, sitemap, redirects on the live domain.
