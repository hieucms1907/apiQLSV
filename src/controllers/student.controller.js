const db = require('../libs/db')
const jwt = require('jsonwebtoken')
const config = require('../config/auth.config')
const dateformat = require('date-and-time')

module.exports = {
    get : (req, res) => {},

    getAll : (req, res) => {
        let token = req.headers['authorization'] || null

        if(token == null){
            res.status(401).json({status : 401, message : "Invalid Token" })
            return;
        }

        token = token.split(" ")
        token = token[1]

        //Xác thực token
        let tokenDecode = null
        jwt.verify(token, config.secret, function(err, decode){
            tokenDecode = !err ? decode : null;
        })

        var dateNow = new Date();
        if(tokenDecode != null && tokenDecode.exp > dateNow.getTime() / 1000){
            db.query("SELECT user_id, roles FROM users WHERE user_id = ?", 
            [tokenDecode.user_id],
            function(err, response){
                if(err){
                    res.status(500).json({statusCode : 500, message : err });
                    return;
                }else{
                    if(response.length > 0 && response[0].roles == "ADMIN"){
                        let query = "SELECT id as StudentId, MaSV, HoTen, GioiTinh, CAST(NgaySinh as VARCHAR(50)) as NgaySinh, Email, SoDT, DiaChi, "
                                    + "student.MaLop, classroom.TenLop, classroom.MaKhoa, department.TenKhoa "
                                    + "FROM student "
                                    + "LEFT JOIN classroom ON student.MaLop = classroom.MaLop "
                                    + "LEFT JOIN department ON classroom.MaKhoa = department.MaKhoa "
                        db.query(query, 
                            function(err, result){
                                if(err){
                                    res.status(500).json({statusCode : 500, message : err })
                                }else{
                                    res.status(200).json(result)
                                }
                            })
                    }else{
                        res.status(401).json({statusCode : 401, message : "Bạn không có quyền truy cập" })
                    }
                }
            })
        }else{
            res.status(401).json({statusCode : 110, message : "Invalid Token Or Token Expired" })
            return;
        }
    },

    getStudentById : (req, res) => {
        let token = req.headers['authorization'] || null

        if(token == null){
            res.status(401).json({status : 401, message : "Invalid Token" })
            return;
        }

        token = token.split(" ")
        token = token[1]

        //Xác thực token
        let tokenDecode = null
        jwt.verify(token, config.secret, function(err, decode){
            tokenDecode = !err ? decode : null;
        })
    },

    updateStudent : (req, res) => {
        let token = req.headers['authorization'] || null
        StudentId = req.params.id,
        MaSV = req.body.MaSV,
        HoTen = req.body.HoTen,
        NgaySinh = req.body.NgaySinh,
        GioiTinh = req.body.GioiTinh,
        Email = req.body.Email,
        SoDT = req.body.SoDT,
        DiaChi = req.body.DiaChi,
        MaLop = req.body.MaLop,
        newData = NgaySinh.replace(/(\d+[-])(\d+[-])/, '$2$1'),
        nNgaySinh = dateformat.format(new Date(newData), "YYYY-MM-DD")

        if(token == null){
            res.status(401).json({status : 401, message : "Invalid Token" })
            return;
        }

        token = token.split(" ")
        token = token[1]

        //Xác thực token
        let tokenDecode = null
        jwt.verify(token, config.secret, function(err, decode){
            tokenDecode = !err ? decode : null;
        })

        var dateNow = new Date();
        if(tokenDecode != null && tokenDecode.exp > dateNow.getTime() / 1000){
            db.query("SELECT user_id, roles FROM users WHERE user_id = ?", 
            [tokenDecode.user_id],
            function(err, response){
                if(err){
                    res.status(500).json({statusCode : 500, message : "Bạn không có quyền truy cập" });
                    return;
                }else{
                    if(response.length > 0 && response[0].roles == "ADMIN"){
                        db.query("SELECT * FROM student WHERE id = ? LIMIT 1",
                        [StudentId],
                        function(err, exist){
                            if(!err && exist.length > 0){
                                if(exist[0].MaSV == MaSV){
                                    let query = "UPDATE student SET MaSV = ?, MaLop = ?, HoTen = ?, GioiTinh = ?, NgaySinh = ?, Email = ?, SoDT = ?, DiaChi = ? "
                                    +"WHERE id = ?"
                                    db.query(query,
                                        [MaSV, MaLop, HoTen, GioiTinh, nNgaySinh, Email, SoDT, DiaChi, StudentId], 
                                        function(err, result){
                                            if(err){
                                                res.status(500).json({statusCode : 500, message : err.code == "ER_DUP_ENTRY" ? "Email đã tồn tại" : "Cập nhập thông tin sinh viên thất bại" })
                                            }else{
                                                res.status(200).json({statusCode : 200, message : "Cập nhập thông tin sinh viên thành công" });
                                            }
                                        })
                                }else{
                                    db.query("SELECT MaSV FROM student WHERE MaSV = ? LIMIT 1",
                                        [MaSV],
                                        function(err, exist){
                                            if(!err && exist.length == 0){
                                                if(exist[0].MaSV == MaSV){
                                                    let query = "UPDATE student SET MaSV = ?, MaLop = ?, HoTen = ?, GioiTinh = ?, NgaySinh = ?, Email = ?, SoDT = ?, DiaChi = ? "
                                                    +"WHERE id = ?"
                                                    db.query(query,
                                                        [MaSV, MaLop, HoTen, GioiTinh, nNgaySinh, Email, SoDT, DiaChi, StudentId], 
                                                        function(err, result){
                                                            if(err){
                                                                res.status(500).json({statusCode : 500, message : err.code == "ER_DUP_ENTRY" ? "Email đã tồn tại" : "Cập nhập thông tin sinh viên thất bại" })
                                                            }else{
                                                                res.status(200).json({statusCode : 200, message : "Cập nhập thông tin sinh viên thành công" });
                                                            }
                                                        })
                                                }else{
                                                    res.status(500).json({statusCode : 500, message : "Mã sinh viên đã tồn tại trong hệ thống" })
                                                }
                                            }else{
                                                res.status(500).json({statusCode : 500, message : "Sinh viên không tồn tại" })
                                            }
                                        })
                                }
                            }else{
                                res.status(500).json({statusCode : 500, message : "Sinh viên không tồn tại" })
                            }
                        })
                    }else{
                        res.status(401).json({statusCode : 401, message : "Bạn không có quyền truy cập" })
                    }
                }
            })
        }else{
            res.status(401).json({statusCode : 110, message : "Invalid Token Or Token Expired" })
            return;
        }
    },

    createStudent : (req, res) => {
        let token = req.headers['authorization'] || null,
            MaSV = req.body.MaSV,
            HoTen = req.body.HoTen,
            NgaySinh = req.body.NgaySinh,
            GioiTinh = req.body.GioiTinh,
            Email = req.body.Email,
            SoDT = req.body.SoDT,
            DiaChi = req.body.DiaChi,
            MaLop = req.body.MaLop,
            newData = NgaySinh.replace(/(\d+[-])(\d+[-])/, '$2$1'),
            nNgaySinh = dateformat.format(new Date(newData), "YYYY-MM-DD"),
            created_at = dateformat.format(new Date(), "YYYY-MM-DD")

        if(token == null){
            res.status(401).json({status : 401, message : "Invalid Token" })
            return;
        }

        token = token.split(" ")
        token = token[1]

        //Xác thực token
        let tokenDecode = null
        jwt.verify(token, config.secret, function(err, decode){
            tokenDecode = !err ? decode : null;
        })

        var dateNow = new Date();
        if(tokenDecode != null && tokenDecode.exp > dateNow.getTime() / 1000){
            db.query("SELECT user_id, roles FROM users WHERE user_id = ?", 
            [tokenDecode.user_id],
            function(err, response){
                if(err){
                    res.status(500).json({statusCode : 500, message : "Bạn không có quyền truy cập" });
                    return;
                }else{
                    if(response.length > 0 && response[0].roles == "ADMIN"){
                        db.query("SELECT MaSV FROM student WHERE MaSV = ? LIMIT 1",
                        [MaSV],
                        function(err, exist){
                            if(!err && exist.length == 0){
                                let query = "INSERT INTO student (MaSV, MaLop, HoTen, GioiTinh, NgaySinh, Email, SoDT, DiaChi, created_at) "
                                + "VALUES (?,?,?,?,?,?,?,?,?)"
                                db.query(query,
                                    [MaSV, MaLop, HoTen, GioiTinh, nNgaySinh, Email, SoDT, DiaChi, created_at], 
                                    function(err, result){
                                        if(err){
                                            res.status(500).json({statusCode : 500, message : err.code == "ER_DUP_ENTRY" ? "Email đã tồn tại" : "Thêm sinh viên thất bại" })
                                        }else{
                                            var insertId = result.insertId
                                            db.query("SELECT * FROM student WHERE id = ? LIMIT 1",
                                            [insertId],
                                            function(err, data){
                                                if(err){
                                                    res.status(500).json({statusCode : 500, message : "Thêm sinh viên thất bại" })
                                                }else{
                                                    res.status(200).json(data[0])
                                                }
                                            })
                                        }
                                    })
                            }else{
                                res.status(500).json({statusCode : 500, message : "Mã sinh viên đã tồn tại" })
                            }
                        })
                    }else{
                        res.status(401).json({statusCode : 401, message : "Bạn không có quyền truy cập" })
                    }
                }
            })
        }else{
            res.status(401).json({statusCode : 110, message : "Invalid Token Or Token Expired" })
            return;
        }
    },

    deleteStudent : (req, res) => {
        let token = req.headers['authorization'] || null
            idStudent = req.query.StudentId
        if(token == null){
            res.status(401).json({status : 401, message : "Invalid Token" })
            return;
        }

        token = token.split(" ")
        token = token[1]

        //Xác thực token
        let tokenDecode = null
        jwt.verify(token, config.secret, function(err, decode){
            tokenDecode = !err ? decode : null;
        })

        var dateNow = new Date();
        if(tokenDecode != null && tokenDecode.exp > dateNow.getTime() / 1000){
            db.query("SELECT user_id, roles FROM users WHERE user_id = ?", 
            [tokenDecode.user_id],
            function(err, response){
                if(err){
                    res.status(500).json({statusCode : 500, message : "Bạn không có quyền truy cập" });
                    return;
                }else{
                    if(response.length > 0 && response[0].roles == "ADMIN"){
                        let query = "DELETE FROM student WHERE id = ?"
                        db.query(query,
                            [idStudent], 
                            function(err, result){
                                if(err){
                                    res.status(500).json({statusCode : 500, message : "Xóa sinh viên thất bại" })
                                }else{
                                    res.status(200).json({statusCode : 200, message : "Xóa sinh viên thành công" })
                                }
                            })
                    }else{
                        res.status(401).json({statusCode : 401, message : "Bạn không có quyền truy cập" })
                    }
                }
            })
        }else{
            res.status(401).json({statusCode : 110, message : "Invalid Token Or Token Expired" })
            return;
        }
    }
}