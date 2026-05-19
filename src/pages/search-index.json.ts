import { getCollection } from 'astro:content';

export async function GET() {
  const reviews = await getCollection('reviews');
  const tutorials = await getCollection('tutorials');
  const comparisons = await getCollection('comparisons');

  const index = [
    ...reviews.map((r) => ({
      id: r.id,
      title: r.data.title,
      description: r.data.meta_description,
      url: `/reviews/${r.id}/`,
      type: 'review',
      category: r.data.category,
      tags: r.data.tags.join(', '),
      date: r.data.date.toISOString(),
    })),
    ...tutorials.map((t) => ({
      id: t.id,
      title: t.data.title,
      description: t.data.meta_description,
      url: `/tutorials`,
      type: 'tutorial',
      category: t.data.category,
      tags: t.data.tags.join(', '),
      date: t.data.date.toISOString(),
    })),
    ...comparisons.map((c) => ({
      id: c.id,
      title: c.data.title,
      description: c.data.meta_description,
      url: `/comparisons`,
      type: 'comparison',
      category: '',
      tags: c.data.tags.join(', '),
      date: c.data.date.toISOString(),
    })),
  ];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}
