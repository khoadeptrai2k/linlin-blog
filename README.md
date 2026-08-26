# Học cùng Linlin

Monorepo cho thương hiệu học ngôn ngữ **Học cùng Linlin**.

- `ui/` — frontend Next.js (landing, i18n Việt / English / 中文 / ไทย)
- Thư mục gốc dành cho API về sau

## Chạy local

```bash
cd ui
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Đẩy code và auto-build lên Vercel

Repo GitHub: [khoadeptrai2k/linlin-blog](https://github.com/khoadeptrai2k/linlin-blog). App Next.js nằm trong **`ui/`**, không phải thư mục gốc.

### 1. Push lên GitHub

```bash
git add -A
git commit -m "Mô tả thay đổi"
git push origin main
```

Nhánh `main` là production. Pull request sẽ thành bản Preview trên Vercel sau khi đã kết nối.

### 2. Import project trên Vercel (làm một lần)

1. Vào [vercel.com](https://vercel.com) → **Add New…** → **Project**.
2. Import `khoadeptrai2k/linlin-blog`.
3. Trong **Root Directory**, bấm **Edit** và chọn **`ui`**. Bước này bắt buộc — nếu để trống, build sẽ không thấy `next.config`.
4. Framework Preset: **Next.js** (tự nhận).
5. Build Command: `npm run build` (mặc định).
6. Install Command: `npm install` (mặc định).
7. Output: để Vercel xử lý (không điền thư mục tĩnh).
8. Environment Variables: chưa bắt buộc. Khi có Mongo, thêm `MONGODB_URI` và `MONGODB_DB=linlin`.
9. **Deploy**.

Lần sau chỉ cần `git push origin main`. Vercel build `ui/` và publish bản mới.

### 3. Kiểm tra sau khi deploy

- Production: domain `*.vercel.app` của project, locale mặc định là tiếng Việt (`/`).
- English / 中文 / ไทย: `/en`, `/zh`, `/th`.
- Preview: mỗi pull request có một URL riêng.

### Nếu build lỗi

- Root Directory không phải `ui`.
- Quên `npm install` trong `ui/` (Vercel làm giúp nếu Root Directory đúng).
- Đừng trỏ Output Directory vào `.next` thủ công — để preset Next.js.

Hướng dẫn chi tiết hơn nằm trong [`ui/README.md`](ui/README.md).
