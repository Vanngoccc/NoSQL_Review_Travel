// ============================================================
// SCRIPT ĐẦY ĐỦ CHO SV2 - Advanced Query Specialist
// Dự án: NoSQL Review Travel
// Chạy trong mongosh: load("sv2_queries.js")  hoặc copy-paste từng phần
// ============================================================

use("review_travel_db");

// ============================================================
// PHẦN 1 (TUẦN 1 - Ngày 2 & 4): TẠO INDEX
// Chạy 1 lần, nếu đã tồn tại sẽ báo lỗi nhẹ, bỏ qua được
// ============================================================

db.locations.createIndex({ name: "text", description: "text", category: "text" });
db.locations.createIndex({ location: "2dsphere" });
db.locations.createIndex({ city: 1, category: 1 });

// Kiểm tra lại toàn bộ index đã tạo
print("=== DANH SÁCH INDEX ===");
printjson(db.locations.getIndexes());


// ============================================================
// PHẦN 2 (TUẦN 1 - Ngày 3): DỮ LIỆU MẪU TẠM
//