export const SUCCESS_MESSAGES = {
    LOGIN: 'Đăng nhập thành công!',
    REGISTER: '🎉 Chào mừng bạn đến với Smart Task!',
    LOGOUT: 'Đăng xuất thành công',
    PROJECT_CREATED: 'Tạo project thành công! 🎉',
    PROJECT_UPDATED: 'Cập nhật project thành công',
    PROJECT_DELETED: 'Đã xóa project',
    PROFILE_UPDATED: 'Cập nhật thông tin thành công',
    PASSWORD_CHANGED: 'Đổi mật khẩu thành công',
} as const;

export const ERROR_MESSAGES = {
    DEFAULT: 'Đã xảy ra lỗi. Vui lòng thử lại',
    NETWORK: 'Lỗi kết nối. Vui lòng kiểm tra mạng',
    UNAUTHORIZED: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại',
    LOGIN_FAILED: 'Email hoặc mật khẩu không đúng',
    REGISTER_FAILED: 'Không thể tạo tài khoản',
    EMAIL_EXISTS: 'Email đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập.',
    PROJECT_CREATE_FAILED: 'Không thể tạo project',
    PROJECT_UPDATE_FAILED: 'Không thể cập nhật project',
    PROJECT_DELETE_FAILED: 'Không thể xóa project',
    PROFILE_UPDATE_FAILED: 'Không thể cập nhật thông tin',
    PASSWORD_CHANGE_FAILED: 'Không thể đổi mật khẩu',
} as const;

export const VALIDATION_MESSAGES = {
    EMAIL_REQUIRED: 'Vui lòng nhập email',
    EMAIL_INVALID: 'Email không hợp lệ',
    PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu',
    PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 6 ký tự',
    PASSWORD_CONFIRM_REQUIRED: 'Vui lòng xác nhận mật khẩu',
    PASSWORD_MISMATCH: 'Mật khẩu không khớp',
    PROJECT_NAME_REQUIRED: 'Tên project không được để trống',
    PROJECT_NAME_MIN_LENGTH: 'Tên project phải có ít nhất 3 ký tự',
} as const;