import { useState, useMemo } from 'react';

interface Review {
  id: string;
  title: string;
  category: string;
  rating: number;
  meta_description: string;
  date: string;
  slug?: string;
}

interface Props {
  reviews: Review[];
  categories: string[];
  getCategoryColor: (cat: string) => string;
  getRatingColor: (rating: number) => string;
}

function safeFormatDate(date: string | Date): string {
  if (typeof date === 'string') {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return date;
    }
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function CategoryFilter({
  reviews,
  categories,
  getCategoryColor,
  getRatingColor,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeCategory) return reviews.slice(0, 6);
    return reviews.filter((r) => r.category === activeCategory);
  }, [activeCategory, reviews]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            !activeCategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const colorClass = getCategoryColor(cat);
          const baseBg = colorClass.split(' ')[0];
          return (
            <div key={cat} className="flex items-center gap-1">
              <button
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? `${baseBg.replace('100', '600')} text-white`
                    : colorClass
                }`}
              >
                {cat}
              </button>
              {isActive && (
                <a
                  href={`/reviews/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap hover:underline ml-1"
                >
                  View all →
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Results grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((review) => (
            <article
              key={review.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <a href={`/reviews/${review.slug || review.id}`} className="block">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Cover image</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(review.category)}`}
                    >
                      {review.category}
                    </span>
                    <span
                      className={`ml-auto px-2 py-0.5 rounded text-white text-xs font-bold ${getRatingColor(review.rating)}`}
                    >
                      {review.rating}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                    {review.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {review.meta_description}
                  </p>
                  <time className="text-xs text-gray-400">
                    {safeFormatDate(review.date)}
                  </time>
                </div>
              </a>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-8">
          No reviews in this category yet.
        </p>
      )}

      {/* View All link */}
      <div className="text-center mt-8">
        <a
          href="/reviews"
          className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Browse All Reviews →
        </a>
      </div>
    </section>
  );
}
