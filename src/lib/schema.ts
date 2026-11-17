/** Ayudas de datos estructurados. */
export const breadcrumbs = (site: URL | undefined, items: { name: string; href: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: new URL(it.href, site).toString(),
  })),
});

export const serviceSchema = (site: URL | undefined, o: { name: string; description: string; href: string; areaServed: string[] }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: o.name,
  description: o.description,
  url: new URL(o.href, site).toString(),
  provider: { '@id': `${site}#business` },
  areaServed: o.areaServed.map((name) => ({ '@type': 'City', name })),
});
