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
                        let query = "SELECT * FROM department"
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

    getDepartmentById : (req, res) => {
        let token = req.headers['authorization'] || null,
            MaKhoa = req.params.id

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
                        let query = "SELECT department.*, classroom.MaLop, classroom.TenLop FROM department "
                        + "LEFT JOIN classroom ON department.MaKhoa = classroom.MaKhoa "
                        + "WHERE department.MaKhoa = ?"
                        db.query(query, 
                            [MaKhoa],
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

    createDeparment : (req, res) => {
        let token = req.headers['authorization'] || null,
            TenKhoa = req.body.TenKhoa,
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
                    res.status(500).json({statusCode : 500, message : err });
                    return;
                }else{
                    if(response.length > 0 && response[0].roles == "ADMIN"){
                        let query = "INSERT INTO department (TenKhoa, created_at) VALUES (?, ?)"
                        db.query(query, 
                            [TenKhoa, created_at],
                            function(err, result){
                                if(err){
                                    res.status(500).json({statusCode : 500, message : "Thêm khoa thất bại" })
                                }else{
                                    var insert_id = result.insertId
                                    db.query("SELECT * FROM department WHERE MaKhoa = ?", 
                                        [insert_id],
                                        function(err, data){
                                            if(err){
                                                res.status(500).json({statusCode : 500, message : "Thêm khoa thất bại" })
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

    updateDeparment : (req, res) => {
        let token = req.headers['authorization'] || null,
            TenKhoa = req.body.TenKhoa,
            MaKhoa = req.params.id

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
                        let query = "SELECT * FROM department WHERE MaKhoa = ?"
                        db.query(query, 
                            [MaKhoa],
                            function(err, result){
                                if(err && result[0].length == 0){
                                    res.status(500).json({statusCode : 500, message : "Khoa không tồn tại" })
                                }else{
                                    db.query("UPDATE department SET TenKhoa = ? WHERE MaKhoa = ?", 
                                        [TenKhoa, MaKhoa],
                                        function(err, data){
                                            if(err){
                                                res.status(500).json({statusCode : 500, message : "Cập nhập khoa thất bại" })
                                            }else{
                                                res.status(200).json({statusCode : 200, message : "Cập nhập khoa thành công" })
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

    deleteDeparment : (req, res) => {
        let token = req.headers['authorization'] || null,
            MaKhoa = req.query.MaKhoa

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
                        let query = "SELECT * FROM department WHERE MaKhoa = ?"
                        db.query(query, 
                            [MaKhoa],
                            function(err, result){
                                if(err && result[0].length == 0){
                                    res.status(500).json({statusCode : 500, message : "Khoa không tồn tại" })
                                }else{
                                    db.query("DELETE department, classroom, student FROM department "
                                            + "LEFT JOIN classroom ON department.MaKhoa = classroom.MaKhoa "
                                            + "LEFT JOIN student ON classroom.MaLop = student.MaLop "
                                            + "WHERE department.MaKhoa = ?", 
                                        [MaKhoa],
                                        function(err, data){
                                            if(err){
                                                res.status(500).json({statusCode : 500, message : "Xóa khoa thất bại" })
                                            }else{
                                                res.status(200).json({statusCode : 200, message : "Xóa khoa thành công" })
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