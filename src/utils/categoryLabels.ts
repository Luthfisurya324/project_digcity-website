const CATEGORY_LABELS: Record<string, string> = {
  business: 'Business & Entrepreneurship',
  technology: 'Technology & Innovation',
  education: 'Education & Training',
  workshop: 'Workshop & Skills',
  seminar: 'Seminar & Conference',
  networking: 'Networking & Community',
  startup: 'Startup & Innovation',
  digital_marketing: 'Digital Marketing',
  finance: 'Finance & Investment',
  healthcare: 'Healthcare & Wellness',
  creative: 'Creative & Design',
  sports: 'Sports & Fitness',
  culture: 'Culture & Arts',
  environment: 'Environment & Sustainability',
  social_impact: 'Social Impact & Charity',
  community: 'Community Engagement',
  announcement: 'Pengumuman',
  press_release: 'Press Release',
  community_update: 'Community Update',
  achievement: 'Achievement Highlight',
  opinion: 'Opini Anggota',
  tips_tricks: 'Tips & Tricks',
  highlight: 'Organizational Highlight',
  general: 'General'
}

const toTitleCase = (value: string) =>
  value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())

export const formatContentCategory = (
  category?: string,
  fallback: string = 'Artikel'
): string => {
  if (!category) return fallback
  const normalized = category.toLowerCase()
  return CATEGORY_LABELS[normalized] || toTitleCase(normalized)
}

export default formatContentCategory

