import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const ReviewsList = ({ reviews = [] }) => {
  const [sortBy, setSortBy] = useState('recent');

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'highest') {
      return b.rating - a.rating;
    } else if (sortBy === 'lowest') {
      return a.rating - b.rating;
    }
    return 0;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Müşteri Değerlendirmeleri</h3>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Henüz değerlendirme yok</p>
          </div>
        ) : (
          <>
            {/* Rating Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">{averageRating}</div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{reviews.length} değerlendirme</p>
              </div>

              {/* Rating Distribution */}
              <div className="md:col-span-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-gray-700 w-12">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{
                          width: `${(ratingDistribution[rating] / reviews.length) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="recent">En Yeni</option>
                <option value="highest">En Yüksek Puan</option>
                <option value="lowest">En Düşük Puan</option>
              </select>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {sortedReviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  {review.verified && (
                    <div className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                      ✓ Doğrulanmış Alıcı
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
