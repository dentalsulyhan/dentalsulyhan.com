# SEO Implementation Plan for Dental Clinic Sulyhan

This document describes the ideal SEO implementation for the current Payload CMS + Next.js project.
It is written as a task brief for another developer.

## Progress

Already started:

- base site URL helper
- root `metadataBase`
- `robots.txt` scaffold
- initial `sitemap.xml` scaffold
- `seo-settings` global added to Payload
- reusable SEO fields added to `Pages` and `Services`
- route-level `generateMetadata()` started for localized public pages
- base Organization / WebSite structured data added on public layout
- 404 route marked `noindex, nofollow`
- sitemap now expands from CMS pages and services across locales
- metadata descriptions now fall back to localized page/service content when explicit SEO description is empty

Next to do:

- add page-specific structured data where useful, such as service detail pages and FAQ blocks

## Goal

Build a complete, production-grade SEO foundation for a multilingual dental clinic website with these requirements:

- Spanish is the default language and must live at the root URL `/`
- English must use `/en`
- Ukrainian must use `/uk`
- Every localized page can have a different slug/path
- SEO must be editable from the CMS where appropriate
- The site must generate correct metadata, canonical URLs, hreflang links, sitemap, robots.txt, and structured data
- Technical pages and admin routes must not pollute SEO

## Current State

The project already has:

- multilingual routing with `es`, `en`, `uk`
- localized page paths
- basic metadata in the root layout
- favicon and manifest support
- custom 404 page
- global site settings in Payload

What is still missing or incomplete:

- centralized SEO model in the CMS
- per-page SEO fields
- deeper content-based metadata fallbacks for page descriptions
- sitemap.xml
- robots.txt
- JSON-LD structured data
- noindex handling for internal/admin/404/preview routes
- SEO-safe handling of localized slugs and root Spanish URLs
- sitemap expansion for localized service and page entries

## SEO Principles for This Site

The implementation should follow these rules:

1. Spanish is the canonical root locale.
   - `https://domain.com/` is Spanish
   - do not force `/es` as the main visible URL

2. English and Ukrainian must always use locale prefixes.
   - `/en/...`
   - `/uk/...`

3. Each locale can have its own slug/path.
   - Example: `/services`, `/en/services`, `/uk/poslugy`

4. Canonical URLs must match the visible localized URL.
   - no duplicate canonical across locales
   - no canonical pointing to the wrong language version

5. The site should not index:
   - `/admin`
   - `/api`
   - preview/debug routes
   - 404 pages
   - internal utility routes

6. Metadata should be generated server-side, not manually duplicated in components.

7. SEO must be editable from CMS defaults, but page-level overrides should win.

## Recommended CMS Structure

### Global SEO Settings

Add a new global, for example:

- slug: `seo-settings`

Suggested fields:

- `siteName`
- `defaultTitle`
- `titleTemplate`
- `defaultDescription`
- `defaultOgImage`
- `defaultTwitterCard`
- `baseUrl`
- `indexSite`
- `defaultRobotsFollow`
- `defaultRobotsIndex`
- `organizationName`
- `organizationLogo`
- `organizationPhone`
- `organizationEmail`
- `organizationAddress`
- `facebookUrl`
- `instagramUrl`
- `youtubeUrl`
- `whatsappUrl`
- `telegramUrl`

Suggested behavior:

- all pages fall back to these values if page-level SEO fields are empty
- this should be the primary source of default metadata

### Per-Page SEO Fields

Add a reusable SEO group to content collections that can generate pages:

- `Pages`
- `Services`
- potentially `Promotions`
- any future blog/news collection

Suggested fields:

- `metaTitle`
- `metaDescription`
- `metaImage`
- `canonicalUrl`
- `noIndex`
- `noFollow`
- `ogType`
- `twitterCard`

Optional advanced fields:

- `schemaType`
- `schemaCustomJson`
- `searchTitle`
- `breadcrumbTitle`

Priority rule:

1. page-level SEO fields
2. global SEO defaults
3. automatic fallback from title / excerpt / first text block

## Metadata Strategy

Implement `generateMetadata()` in the App Router for each frontend route.

Routes to cover:

- frontend home page
- generic localized page route
- services listing page
- service detail page
- 404 page

Metadata should include:

- `title`
- `description`
- `alternates`
- `openGraph`
- `twitter`
- `robots`
- `metadataBase`

### Title format

Use a consistent title strategy such as:

- `Page Title | Site Name`

or

- `Page Title - Site Name`

Use one format across the whole site.

### Description strategy

If a page has no meta description:

- use the page subtitle, intro, or first content paragraph
- if that is also missing, use the global default description

### Open Graph strategy

For each page:

- set `og:title`
- set `og:description`
- set `og:url`
- set `og:image`
- set `og:type`

Use the page’s selected image if available.
Fallback to global default OG image.

### Twitter strategy

Use a consistent card type, typically:

- `summary_large_image`

## Canonical and Hreflang

This is a critical part of the site.

### Canonical rules

- Spanish root page canonical: `/`
- English page canonical: `/en/...`
- Ukrainian page canonical: `/uk/...`
- canonical should always match the visible localized page
- do not canonicalize everything to the root page

### Hreflang rules

Every indexable localized page should output alternate links:

- `es`
- `en`
- `uk`
- optionally `x-default` pointing to Spanish root

For pages with a translated path, alternate URLs must use the correct localized path.

Example:

- `es`: `https://domain.com/servicios`
- `en`: `https://domain.com/en/services`
- `uk`: `https://domain.com/uk/poslugy`

### Special cases

- If a localized page does not exist, do not output a fake alternate URL.
- If a page is intentionally hidden in a locale, exclude it from sitemap and hreflang for that locale.

## Sitemap

Create a proper `sitemap.xml`.

### What to include

- home page for each locale
- all localized CMS pages
- services listing page for each locale
- all service detail pages for each locale
- optionally static legal pages if they exist

### What to exclude

- 404 page
- admin routes
- API routes
- preview routes
- utility routes
- draft-only content

### Sitemap requirements

- include correct localized URLs
- include `lastModified` if available
- keep URLs absolute
- do not generate duplicate canonical entries
- if a page has alternate localized versions, those should be reflected in the sitemap logic or at least in metadata

## Robots.txt

Create a proper `robots.txt`.

### Recommended rules

- allow public pages
- disallow admin and API
- disallow preview/debug routes
- reference sitemap URL

Typical exclusions:

- `/admin`
- `/api`
- `/_next`
- any preview or internal utility path

The exact file should be generated for production domains.

## Structured Data / JSON-LD

Structured data should be added server-side.

### Recommended schemas

1. `Organization`
2. `LocalBusiness`
3. `BreadcrumbList`
4. `Service`
5. `FAQPage`
6. `WebSite`

### Organization / LocalBusiness

Include:

- business name
- phone
- email
- address
- sameAs social links
- logo
- opening hours if available

### BreadcrumbList

Generate breadcrumbs for:

- page
- services listing
- service detail pages

### Service

On service detail pages, expose structured service data:

- service name
- description
- provider
- area served if relevant

### FAQPage

If a page contains FAQ blocks, output FAQ schema from the visible content.

### WebSite

Useful for the site-wide search/brand entity.

## 404 and Error Pages

404 pages should be:

- noindex
- nofollow
- excluded from sitemap
- excluded from canonical and hreflang generation

The custom 404 should still render the global header/footer, but it must not be treated as indexable content.

## Technical Routing Notes

Important routing requirements:

- Spanish root should resolve without `/es`
- English and Ukrainian should keep locale prefixes
- all internal links must resolve to the correct localized path
- home button should not redirect the language switcher to `/`
- service links should respect localized service paths

If the implementation uses path lookup helpers, they must:

- resolve slugs by locale
- understand that the same logical page may have different localized paths
- not guess URLs from English slugs alone

## CMS Editing Experience

SEO fields should be easy for editors:

- keep the SEO group collapsed by default
- show a small helper text for each field
- provide a preview of how the title/description will look if possible
- use optional overrides instead of making every field required

Recommended editor experience:

- title fields first
- description fields second
- image and canonical fields after that
- robots flags at the bottom

## Implementation Order

### Phase 1: Foundation

- add global `seo-settings`
- add reusable SEO group to `Pages` and `Services`
- create metadata helper utilities
- define canonical and alternate URL helpers

### Phase 2: Metadata

- implement `generateMetadata()` for all relevant routes
- ensure Spanish root handling is correct
- ensure localized paths are correct

### Phase 3: Index Control

- add `robots.txt`
- add `noindex` handling for 404 and internal routes
- exclude technical routes from sitemap

### Phase 4: Sitemap and hreflang

- add `sitemap.xml`
- generate alternate locale URLs
- validate URL correctness for translated paths

### Phase 5: Structured Data

- add Organization / LocalBusiness
- add BreadcrumbList
- add Service schema to service pages
- add FAQPage where FAQ exists

### Phase 6: QA

- test every locale
- test home page
- test service list
- test service detail pages
- test 404
- test canonical links
- test sitemap output
- test robots output

## Acceptance Criteria

The SEO implementation is complete when:

- every public page has correct metadata
- every public page has one correct canonical URL
- localized versions have correct hreflang alternates
- Spanish root URL works as canonical root
- sitemap is generated and includes only public indexable pages
- robots.txt blocks private/internal routes
- structured data validates
- 404 is noindex
- page-level SEO overrides work
- global defaults work when page fields are empty

## Suggested Files to Modify

Likely files:

- `src/globals/SeoSettings.ts`
- `src/collections/Pages.ts`
- `src/collections/Services.ts`
- `src/app/layout.tsx`
- `src/app/(frontend)/[locale]/layout.tsx`
- `src/app/(frontend)/[locale]/[[...slug]]/page.tsx`
- `src/app/(frontend)/[locale]/page-content.tsx`
- `src/app/(frontend)/[locale]/services/page-content.tsx`
- `src/app/(frontend)/[locale]/services/[slug]/page-content.tsx`
- `src/app/not-found.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/lib/seo.ts`
- `src/lib/localizedRouting.ts`

## Notes for the Developer

- Do not overcomplicate with a plugin unless the project already has a clear need for one.
- Keep the SEO data model simple and editable in CMS.
- Avoid hardcoding page titles inside route components if the data can come from CMS or helpers.
- Prefer deterministic helpers for URL building and metadata generation.
- Validate the final output in browser and in source HTML.
