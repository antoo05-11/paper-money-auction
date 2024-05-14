import Link from "next/link";

export default function PageFooter() {
    return (
        <footer className="bg-gradient-to-l from-violet-500 to-fuchsia-500 dark:from-violet-800 dark:to-fuchsia-800 text-white">
            <div className="container mx-auto px-4 lg:px-0 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="col-span-1 lg:col-span-2">
                        <h3 className="font-bold text-xl mb-2">CÔNG TY ĐÁU GIÁ HỢP DANH VUA TIỀN TỆ</h3>
                        <p>Địa chỉ: Số 28 Đỗ Đức Dục - Mễ Trì - Nam Từ Liêm - Hà Nội</p>
                        <p>Hotline: 096 214 27 15</p>
                        <p>Đại diện: Đỗ Đức Anh - Chức vụ: Tổng giám đốc</p>
                    </div>

                    <div className="col-span-1 lg:col-span-1">
                        <h3 className="font-bold text-xl mb-2">Về chúng tôi</h3>
                        <ul>
                            <li className="mb-1">
                                <Link href="/">
                                    Lịch sử hình thành
                                </Link>
                            </li>
                            <li className="mb-1">
                                <Link href="/">
                                    Tuyển dụng
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-span-1 lg:col-span-1">
                        <h3 className="font-bold text-xl mb-2">Cuộc đấu giá</h3>
                        <ul>
                            <li className="mb-1">
                                <Link href="/item">
                                    Cuộc đáu giá đang diễn ra
                                </Link>
                            </li>

                        </ul>
                    </div>

                    <div className="col-span-1 lg:col-span-1">
                        <h3 className="font-bold text-xl mb-2">Chính sách</h3>
                        <ul>
                            <li className="mb-1">
                                <Link href="/customer/service/doc">
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                            <li className="mb-1">
                                <Link href="/customer/service/goods">
                                    Chính sách bảo mật thông tin
                                </Link>
                            </li>
                            <li className="mb-1">
                                <Link href="/customer/service/care">
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}