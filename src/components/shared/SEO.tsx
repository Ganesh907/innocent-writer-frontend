
import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  path: string;
};

const SITE_NAME = "Innocent Writer";
const SITE_URL = "https://innocentwriter.vercel.app";

export function SEO({ title, description, path }: SEOProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let element = document.querySelector<HTMLMetaElement>(
        `meta[name="${name}"]`,
      );

      if (!element) {
        element = document.createElement("meta");
        element.name = name;
        document.head.appendChild(element);
      }

      element.content = content;
    };

    setMeta("description", description);

    const canonicalUrl = new URL(path, SITE_URL).href;

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = canonicalUrl;

    let ogTitle = document.querySelector<HTMLMetaElement>(
      'meta[property="og:title"]',
    );

    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }

    ogTitle.content = title;

    let ogDescription = document.querySelector<HTMLMetaElement>(
      'meta[property="og:description"]',
    );

    if (!ogDescription) {
      ogDescription = document.createElement("meta");
      ogDescription.setAttribute("property", "og:description");
      document.head.appendChild(ogDescription);
    }

    ogDescription.content = description;

    let ogUrl = document.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]',
    );

    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }

    ogUrl.content = canonicalUrl;

    let ogSiteName = document.querySelector<HTMLMetaElement>(
      'meta[property="og:site_name"]',
    );

    if (!ogSiteName) {
      ogSiteName = document.createElement("meta");
      ogSiteName.setAttribute("property", "og:site_name");
      document.head.appendChild(ogSiteName);
    }

    ogSiteName.content = SITE_NAME;
  }, [title, description, path]);

  return null;
}
