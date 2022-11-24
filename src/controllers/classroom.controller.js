const db = require('../libs/db')
const jwt = require('jsonwebtoken')
const config = require('../config/auth.config')

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
                        let query = "SELECT classroom.*, department.TenKhoa FROM classroom "
                                    + " INNER JOIN department ON classroom.MaKhoa = department.MaKhoa"
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

    getClassroomByDepartment : (req, res) => {
        let token = req.headers['authorization'] || null,
            maKhoa = req.params.id

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
                        let query = "SELECT * FROM classroom WHERE MaKhoa = ?"
                        db.query(query, [maKhoa],
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

    createClassroom : (req, res) => {
        let token = req.headers['authorization'] || null,
            TenLop = req.body.TenLop,
            MaKhoa = req.body.MaKhoa

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
                        let query = "INSERT INTO classroom (TenLop, MaKhoa) VALUES (?, ?) "
                        db.query(query, [TenLop, MaKhoa],
                            function(err, result){
                                if(err){
                                    res.status(500).json({statusCode : 500, message : "Thêm lớp thất bại" })
                                }else{
                                    var insert_id = result.insertId
                                    db.query("SELECT * FROM classroom WHERE MaLop = ?", 
                                        [insert_id],
                                        function(err, data){
                                            if(err){
                                                res.status(500).json({statusCode : 500, message : "Thêm lớp thất bại" })
                                            }else{
                                                res.status(200).json(data[0])
                                            }
                                        })
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

    updateClassroom : (req, res) => {
        let token = req.headers['authorization'] || null,
            TenLop = req.body.TenLop,
            MaKhoa = req.body.MaKhoa,
            MaLop = req.params.id

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
                        let query = "UPDATE classroom SET TenLop = ?, MaKhoa = ? WHERE MaLop = ?"
                        db.query(query, [TenLop, MaKhoa, MaLop],
                            function(err, result){
                                if(err){
                                    res.status(500).json({statusCode : 500, message : "Chỉnh sửa lớp thất bại" })
                                }else{
                                    res.status(200).json({statusCode : 200, message : "Chỉnh sửa lớp thành công" })
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

    deleteDeparment : (req, res) => {
        let token = req.headers['authorization'] || null,
            MaLop = req.query.MaLop

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
                        let query = "SELECT * FROM classroom WHERE MaLop = ?"
                        db.query(query, 
                            [MaLop],
                            function(err, result){
                                if(err && result[0].length == 0){
                                    res.status(500).json({statusCode : 500, message : "Lớp không tồn tại" })
                                }else{
                                    db.query("DELETE classroom, student FROM classroom "
                                            + "LEFT JOIN student ON classroom.MaLop = student.MaLop "
                                            + "WHERE classroom.MaLop = ?", 
                                        [MaLop],
                                        function(err, data){
                                            if(err){
                                                res.status(500).json({statusCode : 500, message : "Xóa lớp thất bại" })
                                            }else{
                                                res.status(200).json({statusCode : 200, message : "Xóa lớp thành công" })
                                            }
                                        })
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