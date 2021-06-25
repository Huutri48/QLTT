var service = new userServices();
var validation = new Validation();
function getEle(id) {
    return document.getElementById(id);
}
function getData() {
    service
        .getListProductApi()
        .then(function (result) {
            renderListProduct(result.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}
getData();
var arr = [];
function renderListProduct(list) {
    var contentHTML = "";
    list.forEach(function (product, index) {
        arr.push(product.taiKhoan);
        contentHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${product.taiKhoan}</td>
                <td>${product.matKhau}</td>
                <td>${product.hoTen}</td>
                <td>${product.email}</td>
                <td>${product.ngonNgu}</td>
                <td>${product.loaiND}</td>
                <td>
                    <button class="btn btn-info" data-toggle="modal" data-target="#myModal" onclick="suaNguoiDung(${product.id
            })">Sửa</button>
                    <button class="btn btn-danger" onclick="xoaNguoiDung(${product.id
            })">Xóa</button>
                </td>
            <tr>
        `;
    });

    document.getElementById("tblDanhSachNguoiDung").innerHTML = contentHTML;
    return arr;
}
function resetTB() {
    getEle("divTaiKhoanErr").style.display = "none";
    getEle("divHoTenErr").style.display = "none";
    getEle("divMatKhauErr").style.display = "none";
    getEle("divEmailErr").style.display = "none";
    getEle("divHinhAnhErr").style.display = "none";
    getEle("divloaiNguoiDungErr").style.display = "none";
    getEle("divloaiNgonNguErr").style.display = "none";
    getEle("divMoTaErr").style.display = "none";
}
getEle("btnThemNguoiDung").addEventListener("click", function () {
    resetTB()
    getEle("formND").reset();
    document.getElementsByClassName("modal-title")[0].innerHTML =
        "Thêm Người Dùng";
    var footer =
        '<button class="btn btn-success" onclick="addProduct()">Thêm</button>';
    document.getElementsByClassName("modal-footer")[0].innerHTML = footer;
});
function layDuLieuDauVao(isAdd) {
    var taiKhoan = getEle("TaiKhoan").value;
    var hoTen = getEle("HoTen").value;
    var matKhau = getEle("MatKhau").value;
    var email = getEle("Email").value;
    var loaiND = getEle("loaiNguoiDung").value;
    var ngonNgu = getEle("loaiNgonNgu").value;
    var hinhAnh = getEle("HinhAnh").value;
    var moTa = getEle("MoTa").value;
    var isValid = true;
    if (isAdd) {
        isValid &=
            validation.kiemTraRong(taiKhoan, "divTaiKhoanErr", "(*) Tài Khoản Không Được Để Trống") &&
            validation.kiemTraTaiKhoanTrung(
                taiKhoan,
                "divTaiKhoanErr",
                "(*) Tài Khoản Đã Tồn Tại",
                arr
            );
        }
        isValid &=
            validation.kiemTraRong(hoTen, "divHoTenErr", "(*) Họ Tên Không Được Để Trống") &&
            validation.kiemTraKyTuChuoi(
                hoTen,
                "divHoTenErr",
                "(*) Họ Tên Không Được Chứa Số Và Ký Tự Đặc Biệt"
            );
        isValid &=
            validation.kiemTraRong(
                matKhau,
                "divMatKhauErr",
                "(*) Mật Khẩu Không Được Để Trống"
            ) &&
            validation.kiemTraMatKhau(
                matKhau,
                "divMatKhauErr",
                "(*) Mật khẩu chưa đúng định dạng!"
            ) && validation.kiemTraDoDaiKyTu(
                matKhau,
                "divMatKhauErr",
                "(*) Mật khẩu Có Độ Dài 6-8!", 6, 8
            );
        isValid &=
            validation.kiemTraRong(email, "divEmailErr", "(*) Email Không Được Để Trống") &&
            validation.kiemTraEmail(
                email,
                "divEmailErr",
                "Email Không Đúng Định Dạng!"
            );
        isValid &=
            validation.kiemTraRong(
                hinhAnh,
                "divHinhAnhErr",
                "(*) Vui Lòng Nhập Tên Ảnh"
            );

        isValid &= validation.kiemTraOption(
            "loaiNguoiDung",
            "divloaiNguoiDungErr",
            "(*) Vui Lòng Chọn Người Dùng"
        );
        isValid &= validation.kiemTraOption(
            "loaiNgonNgu",
            "divloaiNgonNguErr",
            "(*) Vui Lòng Chọn Ngôn Ngữ"
        );
        isValid &=
            validation.kiemTraRong(moTa, "divMoTaErr", "(*) Mô Tả Không Được Để Trống") && validation.kiemTraDoDaiKyTu(
                moTa, "divMoTaErr", "(*) Mô Tả Không Được Vượt Quá 60 Ký Tự", 0, 60
            );
            
        if (isValid) {
            var user = new User("", taiKhoan, hoTen, matKhau, email, loaiND, ngonNgu,  moTa,hinhAnh);
            return user;
        }
        return null;
    }
    function addProduct() {

        var user = layDuLieuDauVao(true);
        if (user) {
            service
                .addProductApi(user)
                .then(function (result) {
                    console.log(result);
                    document.getElementsByClassName("close")[0].click();
                    getData();
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    function xoaNguoiDung(id) {
        service
            .deleteProductApi(id)
            .then(function () {
                getData();
                alert("xóa thành công!");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function suaNguoiDung(id) {
        resetTB()
        document.getElementsByClassName("modal-title")[0].innerHTML = "Sửa";

        var footer = `<button class="btn btn-success" onclick="capNhat(${id})">Cập nhật</button>`;

        document.getElementsByClassName("modal-footer")[0].innerHTML = footer;

        service
            .getProductByIdApi(id)
            .then(function (result) {
                getEle("TaiKhoan").value = result.data.taiKhoan;
                getEle("HoTen").value = result.data.hoTen;
                getEle("MatKhau").value = result.data.matKhau;
                getEle("Email").value = result.data.email;
                getEle("loaiNguoiDung").value = result.data.loaiND;
                getEle("loaiNgonNgu").value = result.data.ngonNgu;
                getEle("MoTa").value = result.data.moTa;
                getEle("HinhAnh").value = result.data.hinhAnh;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function capNhat(id) {
        function capNhatDuLieu(isAdd) {
            var taiKhoan = getEle("TaiKhoan").value;
            var hoTen = getEle("HoTen").value;
            var matKhau = getEle("MatKhau").value;
            var email = getEle("Email").value;
            var loaiND = getEle("loaiNguoiDung").value;
            var ngonNgu = getEle("loaiNgonNgu").value;
            var moTa = getEle("MoTa").value;
            var hinhAnh = getEle("HinhAnh").value;

            var isValid = true;

            if (isAdd) {
                isValid &=
                    validation.kiemTraRong(taiKhoan, "divTaiKhoanErr", "(*) Tài Khoản Không Được Để Trống") &&
                    validation.kiemTraTaiKhoanTrung(
                        taiKhoan,
                        "divTaiKhoanErr",
                        "(*) Tài Khoản Đã Tồn Tại",
                        arr
                    );
                }
                isValid &=
                    validation.kiemTraRong(hoTen, "divHoTenErr", "(*) Họ Tên Không Được Để Trống") &&
                    validation.kiemTraKyTuChuoi(
                        hoTen,
                        "divHoTenErr",
                        "(*) Họ Tên Không Được Chứa Số Và Ký Tự Đặc Biệt"
                    );
                isValid &=
                    validation.kiemTraRong(
                        matKhau,
                        "divMatKhauErr",
                        "(*) Mật Khẩu Không Được Để Trống"
                    ) &&
                    validation.kiemTraMatKhau(
                        matKhau,
                        "divMatKhauErr",
                        "(*) Mật khẩu chưa đúng định dạng!"
                    ) && validation.kiemTraDoDaiKyTu(
                        matKhau,
                        "divMatKhauErr",
                        "(*) Mật khẩu Có Độ Dài 6-8!", 6, 8
                    );
                isValid &=
                    validation.kiemTraRong(email, "divEmailErr", "(*) Email Không Được Để Trống") &&
                    validation.kiemTraEmail(
                        email,
                        "divEmailErr",
                        "Email Không Đúng Định Dạng!"
                    );
                isValid &=
                    validation.kiemTraRong(
                        hinhAnh,
                        "divHinhAnhErr",
                        "(*) Vui Lòng Nhập Tên Ảnh"
                    );
        
                isValid &= validation.kiemTraOption(
                    "loaiNguoiDung",
                    "divloaiNguoiDungErr",
                    "(*) Vui Lòng Chọn Người Dùng"
                );
                isValid &= validation.kiemTraOption(
                    "loaiNgonNgu",
                    "divloaiNgonNguErr",
                    "(*) Vui Lòng Chọn Ngôn Ngữ"
                );
                isValid &=
                    validation.kiemTraRong(moTa, "divMoTaErr", "(*) Mô Tả Không Được Để Trống") && validation.kiemTraDoDaiKyTu(
                        moTa, "divMoTaErr", "(*) Mô Tả Không Được Vượt Quá 60 Ký Tự", 0, 60
                    );
                    
                if (isValid) {
                    var user = new User(id, taiKhoan, hoTen, matKhau, email, loaiND, ngonNgu, moTa ,hinhAnh);
                    return user;
                }
                return null;
            };
        var user = capNhatDuLieu(false)
        service
            .updateProductApi(user)
            .then(function () {
                alert("Cập nhật thành công");
                document.getElementsByClassName("close")[0].click();
                getData();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
