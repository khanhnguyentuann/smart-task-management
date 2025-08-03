# CSS Architecture

Cấu trúc CSS đã được tổ chức lại để dễ maintain và mở rộng hơn.

## 📁 Cấu trúc thư mục

```
src/styles/
├── theme.css          # Theme variables (light/dark mode)
├── transitions.css    # Theme transition styles
├── layout.css         # Layout và scrollbar styles
├── animations.css     # Animations và keyframes
├── utilities.css      # Utility classes và performance optimizations
└── README.md         # Documentation này
```

## 🎨 Các file CSS

### `theme.css`
- CSS variables cho light mode và dark mode
- Định nghĩa màu sắc, spacing, typography

### `transitions.css`
- Theme transition styles
- Smooth transitions cho tất cả elements khi chuyển đổi theme
- Performance optimizations với GPU acceleration

### `layout.css`
- Layout styles và scrollbar customization
- Prevent layout shift và overflow handling
- Responsive layout utilities

### `animations.css`
- Page transition animations
- Keyframes cho các hiệu ứng animation
- Performance-optimized animation classes

### `utilities.css`
- Utility classes cho performance
- Custom scrollbar styles
- Focus styles và accessibility

## 🔧 Cách sử dụng

File `globals.css` chính import tất cả các module CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import modular CSS files */
@import '../styles/theme.css';
@import '../styles/transitions.css';
@import '../styles/layout.css';
@import '../styles/animations.css';
@import '../styles/utilities.css';
```

## ✨ Lợi ích

1. **Modular**: Mỗi file có trách nhiệm riêng biệt
2. **Maintainable**: Dễ dàng tìm và sửa code
3. **Scalable**: Dễ dàng thêm tính năng mới
4. **Performance**: Tối ưu hóa với GPU acceleration
5. **Clean**: Code gọn gàng và có tổ chức

## 🚀 Theme Transitions

Theme transitions được tối ưu hóa với:
- Thời gian transition: 0.3s
- Easing function: `cubic-bezier(0.4, 0.0, 0.2, 1)`
- GPU acceleration với `transform: translateZ(0)`
- Performance optimizations với `will-change` 