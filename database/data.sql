-- ==========================================
-- WANDERLAB SEED DATA v2.0 (10 Users)
-- (Chạy sau khi đã có 01_schema.sql)
-- Mật khẩu mặc định cho tất cả user là: 123456
-- ==========================================

DO $$
DECLARE
    -- User UUIDs
    u1 UUID := '11111111-1111-4111-a111-111111111111';
    u2 UUID := '22222222-2222-4222-a222-222222222222';
    u3 UUID := '33333333-3333-4333-a333-333333333333';
    u4 UUID := '44444444-4444-4444-a444-444444444444';
    u5 UUID := '55555555-5555-4555-a555-555555555555';
    u6 UUID := '66666666-6666-4666-a666-666666666666';
    u7 UUID := '77777777-7777-4777-a777-777777777777';
    u8 UUID := '88888888-8888-4888-a888-888888888888';
    u9 UUID := '99999999-9999-4999-a999-999999999999';
    u10 UUID := 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';

    -- Diary UUIDs
    d1 UUID := 'd1111111-1111-4111-a111-111111111111';
    d2 UUID := 'd2222222-2222-4222-a222-222222222222';
    d3 UUID := 'd3333333-3333-4333-a333-333333333333';
    d4 UUID := 'd4444444-4444-4444-a444-444444444444';
    d5 UUID := 'd5555555-5555-4555-a555-555555555555';
    d6 UUID := 'd6666666-6666-4666-a666-666666666666';
    d7 UUID := 'd7777777-7777-4777-a777-777777777777';
    d8 UUID := 'd8888888-8888-4888-a888-888888888888';
    d9 UUID := 'd9999999-9999-4999-a999-999999999999';
    d10 UUID := 'daaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
    d11 UUID := 'dbbbbbbb-bbbb-4bbb-abbb-bbbbbbbbbbbb';
    d12 UUID := 'dccccccc-cccc-4ccc-accc-cccccccccccc';

BEGIN
    -- ==========================================
    -- 1. TẠO 10 TÀI KHOẢN (AUTH.USERS)
    -- ==========================================
    
    -- Xóa các tài khoản mock cũ nếu có để tránh lỗi trùng lặp email với UUID khác
    DELETE FROM auth.users WHERE email IN (
        'minh@example.com', 'hoa@example.com', 'tuan@example.com', 'lan@example.com', 
        'hung@example.com', 'linh@example.com', 'phong@example.com', 'trang@example.com', 
        'nam@example.com', 'vy@example.com'
    );

    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES 
    ('00000000-0000-0000-0000-000000000000', u1, 'authenticated', 'authenticated', 'minh@example.com', crypt('123456', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', u2, 'authenticated', 'authenticated', 'hoa@example.com', crypt('123456', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', u3, 'authenticated', 'authenticated', 'tuan@example.com', crypt('123456', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', u4, 'authenticated', 'authenticated', 'lan@example.com', crypt('123456', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', u5, 'authenticated', 'authenticated', 'hung@example.com', crypt('123456', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', u6, 'authenticated', 'authenticated', 'linh@example.com', crypt('123456', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', u7, 'authenticated', 'authenticated', 'phong@example.com', crypt('123456', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', u8, 'authenticated', 'authenticated', 'trang@example.com', crypt('123456', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', u9, 'authenticated', 'authenticated', 'nam@example.com', crypt('123456', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', u10, 'authenticated', 'authenticated', 'vy@example.com', crypt('123456', gen_salt('bf')), now(), now(), now())
    ON CONFLICT DO NOTHING;

    -- ==========================================
    -- 2. CẬP NHẬT THÔNG TIN PROFILES (TRIGGER ĐÃ TỰ ĐỘNG TẠO SẴN)
    -- ==========================================
    INSERT INTO profiles (id, full_name, location, plan, reputation_score, diaries_count, avatar_url)
    VALUES
    (u1, 'Phan Văn Minh', 'Hà Nội', 'professional', 3500, 2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
    (u2, 'Mai Hoa', 'Hồ Chí Minh', 'starter', 2800, 2, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'),
    (u3, 'Lê Tuấn', 'Đà Nẵng', 'free', 1500, 1, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'),
    (u4, 'Ngọc Lan', 'Nha Trang', 'starter', 1900, 1, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'),
    (u5, 'Quốc Hùng', 'Cần Thơ', 'free', 800, 1, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'),
    (u6, 'Thùy Linh', 'Huế', 'professional', 4200, 1, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'),
    (u7, 'Hải Phong', 'Hải Phòng', 'starter', 2100, 1, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400'),
    (u8, 'Thu Trang', 'Vũng Tàu', 'free', 1100, 1, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'),
    (u9, 'Hoàng Nam', 'Đà Lạt', 'starter', 1600, 1, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'),
    (u10, 'Thảo Vy', 'Quy Nhơn', 'professional', 3100, 1, 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400')
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        location = EXCLUDED.location,
        plan = EXCLUDED.plan,
        reputation_score = EXCLUDED.reputation_score,
        diaries_count = EXCLUDED.diaries_count,
        avatar_url = EXCLUDED.avatar_url;

    -- ==========================================
    -- 3. TẠO NHẬT KÝ CHUYẾN ĐI (DIARIES)
    -- ==========================================
    INSERT INTO diaries (id, user_id, title, location, country, cover_image_url, duration, dates, total_budget, group_size, description, likes_count, comments_count)
    VALUES 
    -- Minh (Hà Nội)
    (d1, u1, '5 ngày trên vịnh Hạ Long thật không thể quên!', 'Hạ Long, Quảng Ninh', 'Việt Nam', 'https://images.unsplash.com/photo-1547024842-7c86b2226ef5?w=1080', '5 ngày', '20 tháng 6, 2026', '5.000.000₫', '2 người', 'Sáng sớm nhìn mặt trời mọc từ boong tàu, không khí trong lành và cảnh đẹp như tranh vẽ. Chèo kayak qua những hang động nhỏ, ngắm hoàng hôn lãng mạn. 🌅⛵', 324, 47),
    (d2, u1, 'Khám phá Sa Pa mùa lúa chín', 'Sa Pa, Lào Cai', 'Việt Nam', 'https://images.unsplash.com/photo-1694152362587-99d77d21793b?w=1080', '3 ngày', '18 tháng 9, 2026', '3.500.000₫', '3 người', 'Tháng 9 đến Sa Pa là thời điểm vàng! Ruộng bậc thang chuyển màu vàng óng tuyệt đẹp như tranh. Trek qua các bản làng H''Mông. 🌾⛰️', 412, 62),
    
    -- Hoa (HCM)
    (d3, u2, 'Kỳ nghỉ tuyệt vời ở Phú Quốc', 'Phú Quốc, Kiên Giang', 'Việt Nam', 'https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?w=1080', '4 ngày', '12 tháng 5, 2026', '8.000.000₫', '2 người', 'Biển xanh, cát trắng và nắng vàng. Thưởng thức hải sản tươi ngon ở chợ đêm và lặn ngắm san hô. 🏖️🐟', 510, 89),
    (d4, u2, 'Săn mây Đà Lạt cuối tuần', 'Đà Lạt, Lâm Đồng', 'Việt Nam', 'https://images.unsplash.com/photo-1559592413-7ceca17d7b3a?w=1080', '3 ngày', '02 tháng 12, 2025', '4.000.000₫', '4 người', 'Dậy từ 4h sáng chạy xe máy lên đồi chè Cầu Đất săn mây. Cảm giác cái lạnh buốt sương mù và ly cafe nóng thật khó tả. ☁️☕', 620, 102),

    -- Tuấn (Đà Nẵng)
    (d5, u3, 'Phố cổ Hội An lung linh về đêm', 'Hội An, Quảng Nam', 'Việt Nam', 'https://images.unsplash.com/photo-1643030080539-b411caf44c37?w=1080', '2 ngày', '14 tháng 4, 2026', '2.000.000₫', '2 người', 'Đêm rằm Hội An với hàng ngàn chiếc đèn lồng! Dạo phố cổ, thả hoa đăng trên sông Hoài. 🏮✨', 289, 31),

    -- Lan (Nha Trang)
    (d6, u4, 'Lặn biển Hòn Mun Nha Trang', 'Nha Trang, Khánh Hòa', 'Việt Nam', 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1080', '3 ngày', '05 tháng 7, 2026', '4.500.000₫', '5 người', 'San hô Hòn Mun đẹp mê hồn. Nước trong vắt nhìn thấy đáy, một trải nghiệm tuyệt vời cùng hội bạn thân! 🤿🌊', 345, 55),

    -- Hùng (Cần Thơ)
    (d7, u5, 'Lênh đênh chợ nổi Cái Răng', 'Cần Thơ', 'Việt Nam', 'https://images.unsplash.com/photo-1601552083547-59a686b24033?w=1080', '2 ngày', '10 tháng 8, 2025', '1.500.000₫', '1 người', 'Ngồi ghe ăn tô hủ tiếu nóng hổi giữa chợ nổi lúc tờ mờ sáng là một nét văn hóa miền Tây không thể quên. 🍜🛶', 210, 22),

    -- Linh (Huế)
    (d8, u6, 'Mộng mơ xứ Huế', 'Huế, Thừa Thiên Huế', 'Việt Nam', 'https://images.unsplash.com/photo-1582298926941-e948c27a92dd?w=1080', '3 ngày', '22 tháng 3, 2026', '3.000.000₫', '3 người', 'Tham quan Đại Nội, các lăng tẩm và đi thuyền nghe ca Huế trên sông Hương. 🏰🌸', 478, 67),

    -- Phong (Hải Phòng)
    (d9, u7, 'Cắm trại Cát Bà', 'Cát Bà, Hải Phòng', 'Việt Nam', 'https://images.unsplash.com/photo-1627883204961-d7796d83cf45?w=1080', '2 ngày', '15 tháng 6, 2026', '2.500.000₫', '6 người', 'Hội anh em cắm trại qua đêm trên bãi biển hoang sơ, nướng thịt và hát hò thâu đêm. ⛺🔥', 312, 44),

    -- Trang (Vũng Tàu)
    (d10, u8, 'Bình yên Côn Đảo', 'Côn Đảo, Bà Rịa - Vũng Tàu', 'Việt Nam', 'https://images.unsplash.com/photo-1615462057393-5baea7b2fde5?w=1080', '4 ngày', '09 tháng 1, 2026', '6.000.000₫', '2 người', 'Côn Đảo hoang sơ, tĩnh lặng và tuyệt đẹp. Đạp xe quanh đảo và viếng nghĩa trang Hàng Dương. 🌴🐢', 555, 90),

    -- Nam (Đà Lạt)
    (d11, u9, 'Trekking Tà Năng - Phan Dũng', 'Lâm Đồng - Bình Thuận', 'Việt Nam', 'https://images.unsplash.com/photo-1542662565-7e4b66fae2b1?w=1080', '3 ngày', '25 tháng 11, 2025', '3.000.000₫', '10 người', 'Cung đường trekking đẹp nhất Việt Nam. Những ngọn đồi nhấp nhô xanh ngát kéo dài đến tận chân trời. 🥾⛺', 820, 150),

    -- Vy (Quy Nhơn)
    (d12, u10, 'Thiên đường Kỳ Co - Eo Gió', 'Quy Nhơn, Bình Định', 'Việt Nam', 'https://images.unsplash.com/photo-1602416952774-d4b68427909c?w=1080', '3 ngày', '08 tháng 4, 2026', '4.000.000₫', '3 người', 'Kỳ Co nước xanh như ngọc bích, Eo Gió gió thổi mát rượi. Ăn bánh xèo tôm nhảy siêu ngon! 🍤🌊', 430, 60);

    -- ==========================================
    -- 4. TẠO TƯƠNG TÁC (SOCIAL LIKES & FOLLOWS)
    -- ==========================================
    -- Mọi người follow lẫn nhau
    INSERT INTO follows (follower_id, following_id) VALUES 
    (u2, u1), (u3, u1), (u4, u1), (u5, u1),
    (u1, u2), (u3, u2), (u6, u2),
    (u1, u6), (u2, u6), (u9, u6),
    (u10, u9), (u8, u10);

    -- Like các bài viết
    INSERT INTO diary_likes (user_id, diary_id) VALUES 
    (u2, d1), (u3, d1), (u4, d1), (u5, d1),
    (u1, d3), (u6, d3), (u7, d3),
    (u1, d11), (u2, d11), (u3, d11), (u4, d11), (u5, d11), (u6, d11);

END $$;
