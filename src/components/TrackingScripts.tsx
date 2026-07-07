import Script from 'next/script'

type TrackingSettings = {
  googleTagManagerId?: string | null
  ga4MeasurementId?: string | null
  metaPixelId?: string | null
}

function normalizeId(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export default function TrackingScripts({ tracking }: { tracking?: TrackingSettings | null }) {
  const gtmId = normalizeId(tracking?.googleTagManagerId)
  const ga4Id = normalizeId(tracking?.ga4MeasurementId)
  const metaPixelId = normalizeId(tracking?.metaPixelId)
  const plerdyScriptUrl = normalizeId(
    process.env.PLERDY_SCRIPT_URL || process.env.NEXT_PUBLIC_PLERDY_SCRIPT_URL,
  )
  const plerdySiteHash = normalizeId(
    process.env.PLERDY_SITE_HASH || process.env.NEXT_PUBLIC_PLERDY_SITE_HASH,
  )
  const plerdySuid = normalizeId(
    process.env.PLERDY_SUID || process.env.NEXT_PUBLIC_PLERDY_SUID,
  )
  const hasPlerdyConfig = Boolean(plerdySiteHash && plerdySuid)

  const plerdyScript = hasPlerdyConfig
    ? `
      window._site_hash_code = '${plerdySiteHash}';
      window._suid = ${JSON.stringify(plerdySuid)};
      var plerdyScript = document.createElement('script');
      plerdyScript.setAttribute('defer', '');
      plerdyScript.dataset.plerdymainscript = 'plerdymainscript';
      plerdyScript.src = 'https://a.plerdy.com/public/js/click/main.js?v=' + Math.random();
      var existingPlerdyScript = document.querySelector("[data-plerdymainscript='plerdymainscript']");
      if (existingPlerdyScript && existingPlerdyScript.parentNode) {
        existingPlerdyScript.parentNode.removeChild(existingPlerdyScript);
      }
      try {
        document.head.appendChild(plerdyScript);
      } catch (error) {
        console.log(error, 'unable add script tag');
      }
    `
    : null

  if (gtmId) {
    return (
      <>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        {plerdyScript ? (
          <Script
            id="plerdy-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: plerdyScript }}
          />
        ) : plerdyScriptUrl ? (
          <Script id="plerdy-script" src={plerdyScriptUrl} strategy="afterInteractive" />
        ) : null}
      </>
    )
  }

  if (!ga4Id && !metaPixelId && !plerdyScriptUrl && !plerdyScript) {
    return null
  }

  return (
    <>
      {ga4Id ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`} strategy="afterInteractive" />
          <Script
            id="google-analytics-4"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}');
              `,
            }}
          />
        </>
      ) : null}

      {metaPixelId ? (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      ) : null}

      {plerdyScript ? (
        <Script
          id="plerdy-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: plerdyScript }}
        />
      ) : plerdyScriptUrl ? (
        <Script id="plerdy-script" src={plerdyScriptUrl} strategy="afterInteractive" />
      ) : null}
    </>
  )
}
