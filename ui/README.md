# Học cùng Linlin — UI

Frontend Next.js (App Router, Tailwind, `next-intl`) cho **Học cùng Linlin**.

```bash
cd ui
npm install
npm run dev
```

- Landing đa ngôn ngữ: Việt / English / 中文 / ไทย
- Locale mặc định: `vi` (không có prefix). Các locale khác: `/en`, `/zh`, `/th`
- `/learn` — bốn lớp riêng (Việt / English / 中文 / ไทย). Mỗi lớp chỉ học một tiếng, không trộn.
- `/blogs` đang ở dạng coming soon

## Học tập

Dữ liệu bài học được generate sẵn vào `src/content/learn/` (JSON). Mỗi track là một lớp riêng. Không copy đề thi.

```bash
cd ui
npm run learn:generate
```

Khi có Mongo, điền URI rồi seed:

```bash
# ui/.env.local
MONGODB_URI=mongodb+srv://...
MONGODB_DB=linlin

npm run learn:seed
```

App đọc Mongo nếu `MONGODB_URI` có giá trị; không thì dùng JSON. Trên Vercel, thêm cùng biến môi trường rồi chạy seed một lần từ máy local.

## Deploy Vercel

App này sống trong thư mục `ui/` của monorepo. Khi import GitHub `khoadeptrai2k/linlin-blog` trên Vercel:

| Setting | Giá trị |
| --- | --- |
| Root Directory | `ui` |
| Framework | Next.js |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Env | không bắt buộc |

Sau lần gắn Git đầu tiên, mỗi `git push` lên `main` sẽ build production; mỗi pull request sẽ có URL preview.

File `vercel.json` trong thư mục này chỉ khai báo framework Next.js. Không cần `outputDirectory`.
