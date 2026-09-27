const mongoose = require('mongoose');
const Location = require('./models/Location'); // Import Model Location
const rawLocations = require('./locationsData'); // Import danh sách 100 địa điểm gốc

// Kết nối tới MongoDB local
mongoose.connect('mongodb://127.0.0.1:27017/nosql_locations_db')
  .then(() => console.log('✅ Đã kết nối thành công tới MongoDB!'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Hàm sinh danh sách Review ngẫu nhiên (từ 3 đến 7 review)
const generateRandomReviews = () => {
  const comments = [
    'Địa điểm rất đẹp, không khí trong lành!',
    'Hơi đông đúc vào cuối tuần nhưng phong cảnh tuyệt vời.',
    'Trải nghiệm tuyệt vời, cảnh quan thiên nhiên hùng vĩ.',
    'Dịch vụ ở đây khá tốt, nhân viên thân thiện.',
    'Giá cả hợp lý, đáng để trải nghiệm cùng gia đình.',
    'Mọi thứ đều ổn, sẽ quay lại lần sau!'
  ];

  const reviewCount = Math.floor(Math.random() * 5) + 3; // Sinh từ 3 - 7 review
  const reviews = [];

  for (let i = 0; i < reviewCount; i++) {
    const randomRating = Math.floor(Math.random() * 2) + 4; // Rating từ 4 - 5 sao
    const randomComment = comments[Math.floor(Math.random() * comments.length)];
    const randomUser = `Người dùng ${Math.floor(Math.random() * 500) + 100}`;

    reviews.push({
      user_name: randomUser,
      rating: randomRating,
      content: randomComment,
      created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    });
  }

  return reviews;
};

// Hàm nạp dữ liệu Seed
const seedDB = async () => {
  try {
    // 1. Dọn dẹp CSDL cũ
    await Location.deleteMany({});
    console.log('🗑️  Đã xóa sạch dữ liệu cũ trong Collection locations.');

    // 2. Chuẩn hóa dữ liệu sang chuẩn GeoJSON & tính Rating
    const formattedLocations = rawLocations.map(item => {
      const reviews = generateRandomReviews();
      const totalReviews = reviews.length;
      const sumRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const ratingAvg = parseFloat((sumRating / totalReviews).toFixed(1));

      return {
        custom_id: item.custom_id,
        name: item.name,
        category: item.category,
        city: item.city,
        // Chuyển đổi lat, lng sang format GeoJSON
        location: {
          type: 'Point',
          coordinates: [parseFloat(item.lng), parseFloat(item.lat)] // [Longitude, Latitude]
        },
        rating_avg: ratingAvg,
        total_reviews: totalReviews,
        reviews: reviews
      };
    });

    // 3. Nạp vào MongoDB
    await Location.insertMany(formattedLocations);
    console.log(`🎉 NẠP THÀNH CÔNG ${formattedLocations.length} BẢN GHI CHUẨN GEOJSON VÀO MONGODB!`);

    // 4. Ngắt kết nối DB
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Lỗi trong quá trình Seed Data:', error);
    mongoose.connection.close();
  }
};

// Chạy hàm seed
seedDB();