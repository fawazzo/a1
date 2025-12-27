import { useState } from 'react';
import { Star, Send, User } from 'lucide-react';

const RatingReview = ({ restaurantId, onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim() || !userName.trim()) {
      alert('Lütfen tüm alanları doldurunuz');
      return;
    }

    const review = {
      id: Date.now(),
      userName,
      rating,
      comment,
      date: new Date().toLocaleDateString('tr-TR'),
      verified: true
    };

    onSubmitReview(review);
    setRating(0);
    setComment('');
    setUserName('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Değerlendirme Yap</h3>

      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          ✓ Değerlendirmeniz başarıyla gönderildi!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Adınız
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Adınızı giriniz"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Puan Verin
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 1 && 'Çok Kötü'}
              {rating === 2 && 'Kötü'}
              {rating === 3 && 'Orta'}
              {rating === 4 && 'İyi'}
              {rating === 5 && 'Çok İyi'}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Yorumunuz
          </label>
          <textarea
            placeholder="Deneyiminizi paylaşınız..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>Gönder</span>
        </button>
      </form>
    </div>
  );
};

export default RatingReview;
