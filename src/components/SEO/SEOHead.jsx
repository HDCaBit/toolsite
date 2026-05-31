import { Helmet } from 'react-helmet-async'

export default function SEOHead({ title, description, keywords, path }) {
  const baseUrl = 'https://tools.101142.xyz'
  const fullUrl = path ? `${baseUrl}${path}` : baseUrl

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Tools.101142.xyz" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <meta name="robots" content="index, follow" />
    </Helmet>
  )
}
