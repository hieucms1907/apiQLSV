const db = require('../libs/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../config/auth.config')

module.exports = {
    get : (req, res) => {},

    getAll : (req, res) => {
        let token = req.headers["x-access-token"] || null

        if(token == null){
            res.status(401).json({status : 401, message : "Invalid Token" })
            return;
        }

        //Xác thực token
        let tokenDecode = null
        jwt.verify(token, "DaiNamUniversity", function(err, decode){
            if(err){
                res.status(401).json({status : 401, message : "Invalid Token Or Token Expired" })
                return;
            }
            tokenDecode = decode;
        })
        
        db.query("SELECT PhanQuyen FROM NguoiDung WHERE MaNguoiDung = ?", 
        [tokenDecode.MaNguoiDung],
        function(err, response){
            if(err){
                res.status(500).json({status : 500, message : err });
            }else{
                if(response.length > 0){
                    if(response[0].PhanQuyen == 1){
                        let query = "SELECT MaNguoiDung, TaiKhoan, Email, HoTen, PhanQuyen, SDT, NgaySinh, "
                                    + "nguoidung.MaChucVu, nguoidung.MaKhoa, nguoidung.MaLop, chucvu.TenChucVu, khoa.TenKhoa, lop.TenLop "
                                    + "FROM nguoidung "
                                    + "LEFT JOIN chucvu ON nguoidung.MaChucVu = chucvu.MaChucVu "
                                    + "LEFT JOIN khoa ON nguoidung.MaKhoa = khoa.MaKhoa "
                                    + "LEFT JOIN lop ON nguoidung.MaLop = lop.MaLop "
                        db.query(query, 
                            function(err, result){
                                if(err){
                                    res.status(500).json({status : 500, message : err })
                                }else{
                                    res.status(200).json(result)
                                }
                            })
                    }else{
                        res.status(401).json({status : 401, message : "Bạn không có quyền truy cập" })
                    }
                }else{
                    res.status(401).json({status : 401, message : "Bạn không có quyền truy cập" })
                }
            }
        })
    },

    auth : (req, res) => {
        let username = req.body.username,
            password = req.body.password

        if(!username || !password){
            res.status(400).json({statusCode : 400, message : "Vui lòng nhập đầy đủ thông tin yêu cầu" })
            return;
        }

        let query = "SELECT * FROM users WHERE username = ?"
        db.query(query, 
            [username], 
            function (err, response) {
                if(err){
                    res.status(500).json({statusCode : 500, message : err })
                    return
                }
                
                if(response.length == 0 || !bcrypt.compareSync(password, response[0].password)){
                    res.status(400).json({statusCode : 400, message : "Tài khoản hoặc mật khẩu không đúng"})
                    return
                }

                //Tạo token
                let token = jwt.sign(
                    {
                        user_id : response[0].user_id, 
                        username : response[0].username,
                        roles : response[0].roles
                    },
                    config.secret, //Mã bí mật tạo Jwt token
                    {
                        expiresIn : "2h"
                    }
                )

                let data = {}
                data.accessToken = token
                res.status(200).json(data);
            });
    },

    getUserById:(req, res) => {
        let MaNguoiDung = req.body.MaNguoiDung
            token = req.headers["x-access-token"] || null

        if(token == null){
            res.status(401).json({status : 401, message : "Invalid Token" })
            return;
        }

        //Xác thực token
        let tokenDecode = null
        jwt.verify(token, "DaiNamUniversity", function(err, decode){
            if(err){
                res.status(401).json({status : 401, message : "Invalid Token Or Token Expired" })
                return;
            }
            tokenDecode = decode;
        })

        if(!MaNguoiDung){
            res.status(401).json({status : 401, message : "Dữ liệu không hợp lệ" })
            return;
        }

        db.query("SELECT PhanQuyen FROM NguoiDung WHERE MaNguoiDung = ?", 
        [tokenDecode.MaNguoiDung],
        function(err, response){
            if(err){
                res.status(500).json({status : 500, message : err });
            }else{
                if(response.length > 0 && response[0].PhanQuyen != 1){
                    let query = "SELECT MaNguoiDung, TaiKhoan, Email, HoTen, PhanQuyen, SDT, NgaySinh, "
                                + "nguoidung.MaChucVu, nguoidung.MaKhoa, nguoidung.MaLop, chucvu.TenChucVu, khoa.TenKhoa, lop.TenLop "
                                + "FROM nguoidung "
                                + "LEFT JOIN chucvu ON nguoidung.MaChucVu = chucvu.MaChucVu "
                                + "LEFT JOIN khoa ON nguoidung.MaKhoa = khoa.MaKhoa "
                                + "LEFT JOIN lop ON nguoidung.MaLop = lop.MaLop "
                                + "WHERE nguoidung.MaNguoiDung = ?"
                    db.query(query, 
                        [MaNguoiDung], 
                        function (err, response) {
                            if(err){
                                res.status(500).json({status : 500, message : err })
                            }else{
                                res.status(200).json(response[0]);
                            }
                        });
                }else{
                    res.status(401).json({status : 401, message : "Bạn không có quyền truy cập" })
                }
            }
        })
    }
}