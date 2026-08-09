# Ouvir & Escrever — Web dictation tiếng Bồ Đào Nha

Đây là website tĩnh, không cần tài khoản, backend hay AI. Website dùng được trên điện thoại, máy tính bảng và máy tính.

## 1. Có gì trong thư mục này?

- `index.html`: khung của website.
- `styles.css`: màu sắc và giao diện responsive.
- `app.js`: danh sách bài, trình phát audio và thuật toán chấm.
- `audio/licao-01.mp3`: bài nghe mẫu đầu tiên.

Bạn không cần hiểu các file này để dùng website.

## 2. Mở thử ngay trên máy tính

Cách dễ nhất: nhấp đúp vào file `index.html`. Website sẽ mở trong Chrome, Edge hoặc trình duyệt mặc định.

Nếu trình duyệt không cho phát audio khi mở trực tiếp, hãy dùng cách chạy cục bộ bên dưới.

## 3. Chạy cục bộ đúng cách

### Windows

1. Cài Python từ https://www.python.org/downloads/ nếu máy chưa có. Trong lúc cài, nhớ đánh dấu `Add Python to PATH`.
2. Mở thư mục `portuguese-dictation`.
3. Nhấp vào thanh địa chỉ của File Explorer, gõ `powershell`, rồi nhấn Enter.
4. Trong cửa sổ mới, gõ: `python -m http.server 8000`
5. Mở trình duyệt và vào: `http://localhost:8000`
6. Khi dùng xong, quay lại cửa sổ PowerShell và nhấn `Ctrl + C`.

### macOS

1. Mở Terminal.
2. Gõ `cd ` (có một dấu cách), kéo thư mục `portuguese-dictation` thả vào Terminal, rồi nhấn Enter.
3. Gõ `python3 -m http.server 8000` rồi nhấn Enter.
4. Mở `http://localhost:8000` trong trình duyệt.
5. Khi dùng xong, nhấn `Control + C` trong Terminal.

## 4. Cách thêm một bài mới

1. Đổi tên file MP3 mới thành tên dễ nhớ, ví dụ `licao-02.mp3`.
2. Chép file đó vào thư mục `audio`.
3. Mở `app.js` bằng Notepad hoặc Visual Studio Code.
4. Tìm phần bắt đầu bằng `const lessons = [`.
5. Chép khối bài số 1, dán ngay sau dấu `},` và sửa các phần: `id`, `title`, `theme`, `level`, `durationLabel`, `description`, `audio`, `transcript`.
6. Đảm bảo dòng audio là `audio/licao-02.mp3` và transcript nằm giữa hai dấu ngoặc kép.
7. Lưu file rồi tải lại trang web.

Lưu ý: nếu transcript có dấu ngoặc kép `"`, hãy đổi chúng thành dấu nháy đơn hoặc thêm dấu gạch chéo trước nó: `\"`.

## 5. Đưa lên GitHub Pages miễn phí

1. Tạo tài khoản tại https://github.com nếu chưa có.
2. Sau khi đăng nhập, bấm dấu `+` ở góc trên bên phải, chọn `New repository`.
3. Đặt tên, ví dụ `portuguese-dictation`.
4. Chọn `Public`, rồi bấm `Create repository`.
5. Trên trang repository, bấm `uploading an existing file`.
6. Kéo toàn bộ nội dung bên trong thư mục này vào vùng tải lên. Quan trọng: phải thấy `index.html` nằm ở cấp ngoài cùng, không bị bọc thêm một thư mục.
7. Bấm `Commit changes`.
8. Vào `Settings` → `Pages`.
9. Ở `Build and deployment`, chọn `Deploy from a branch`.
10. Chọn nhánh `main`, thư mục `/(root)`, rồi bấm `Save`.
11. Chờ khoảng 1–3 phút. Tải lại trang `Pages`; GitHub sẽ hiện đường link website.

Mỗi khi muốn cập nhật bài, vào repository, chọn `Add file` → `Upload files`, tải file mới lên và thay file `app.js`.

## 6. Đưa lên Netlify miễn phí (dễ hơn GitHub Pages)

1. Tạo tài khoản tại https://app.netlify.com.
2. Đăng nhập và mở https://app.netlify.com/drop.
3. Kéo cả thư mục `portuguese-dictation` vào vùng có dòng `Drag and drop your site output folder here`.
4. Chờ Netlify tải lên. Một đường link miễn phí sẽ xuất hiện ngay.
5. Muốn đổi tên link: vào `Site configuration` → `Change site name`.
6. Muốn cập nhật: quay lại trang deploy và kéo phiên bản thư mục mới lên lần nữa.

## 7. Website chấm như thế nào?

- Không phân biệt chữ hoa/chữ thường.
- Bỏ qua dấu câu và khoảng trắng thừa.
- Vẫn phân biệt dấu tiếng Bồ: `cooperacao` khác `cooperação`.
- Phân loại từ đúng, thiếu, thừa và thay thế.
- Điểm dùng công thức theo lỗi từ: `(tổng từ chuẩn − thiếu − thừa − thay thế) / tổng từ chuẩn`.

## 8. Nếu có lỗi

- Không nghe được: kiểm tra file MP3 còn nằm trong `audio` và tên file khớp trong `app.js`.
- Trang trắng hoặc giao diện mất: kiểm tra ba file `index.html`, `styles.css`, `app.js` có ở cùng một thư mục.
- GitHub Pages báo 404: chờ thêm vài phút và kiểm tra `index.html` có nằm ở cấp ngoài cùng.
- Sửa xong mà chưa thấy thay đổi: nhấn `Ctrl + F5` trên Windows hoặc `Cmd + Shift + R` trên macOS.
