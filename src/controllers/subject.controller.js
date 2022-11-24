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
            db.query("SELECT subject_id, roles FROM subject WHERE subject_id = ?", 
            [tokenDecode.user_id],
            function(err, response){
                if(err){
                    res.status(500).json({statusCode : 500, message : err });
                    return;
                }else{
                    if(response.length > 0 && response[0].roles == "ADMIN"){
                        let query = "SELECT * FROM subject"
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

    getSubjectById : (req, res) => {
        let token = req.headers['authorization'] || null,
            MaMonHoc = req.params.id

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
            db.query("SELECT subject_id, roles FROM subject WHERE subject_id = ?", 
            [tokenDecode.subject_id],
            function(err, response){
                if(err){
                    res.status(500).json({statusCode : 500, message : err });
                    return;
                }else{
                    if(response.length > 0 && response[0].roles == "ADMIN"){
                        let query = "SELECT subject.*, classroom.MaMH, classroom.TenMH, classroom.SoTinChi FROM subject "
                        + "WHERE subject.MaMH = ?"
                        db.query(query, 
                            [MaMH],
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

    createSubject : (req, res) => {
        let token = req.headers['authorization'] || null,
            TenMH = req.body.TenMH,
            SoTinChi = req.body.SoTinChi
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
                        let query = "INSERT INTO department (TenMH, SoTinChi, created_at) VALUES (?, ?)"
                        db.query(query, 
                            [TenMH,SoTinChi, created_at],
                            function(err, result){
                                if(err){
                                    res.status(500).json({statusCode : 500, message : "Thêm môn học thất bại" })
                                }else{
                                    var insert_id = result.insertId
                                    db.query("SELECT * FROM subject WHERE MaMH = ?", 
                                        [insert_id],
                                        function(err, data){
                                            if(err){
                                                res.status(500).json({statusCode : 500, message : "Thêm môn học thất bại" })
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

    updateSubject : (req, res) => {
        let token = req.headers['authorization'] || null,
            TenMH = req.body.TenMH,
            SoTinChi = req.body.SoTinChi
            MaMH = req.params.id

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
                        let query = "SELECT * FROM subject WHERE MaMH = ?"
                        db.query(query, 
                            [MaMH],
                            function(err, result){
                                if(err && result[0].length == 0){
                                    res.status(500).json({statusCode : 500, message : "Môn học không tồn tại" })
                                }else{
                                    db.query("UPDATE subject SET TenMH, SoTinChi = ? WHERE MaMH = ?", 
                                        [TenMH, SoTinChi, MaMH],
                                        function(err, data){
                                            if(err){
                                                res.status(500).json({statusCode : 500, message : "Cập nhập môn học thất bại" })
                                            }else{
                                                res.status(200).json({statusCode : 200, message : "Cập nhập môn học thành công" })
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

    deleteSubject : (req, res) => {
        let token = req.headers['authorization'] || null,
            MaMH = req.query.MaMH

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
                        let query = "SELECT * FROM subject WHERE MaMH = ?"
                        db.query(query, 
                            [MaMH],
                            function(err, result){
                                if(err && result[0].length == 0){
                                    res.status(500).json({statusCode : 500, message : "Khoa không tồn tại" })
                                }else{
                                    db.query("DELETE subject, classroom, student FROM subject "
                                            + "WHERE subject.MaMH = ?", 
                                        [MaMH],
                                        function(err, data){
                                            if(err){
                                                res.status(500).json({statusCode : 500, message : "Xóa môn học thất bại" })
                                            }else{
                                                res.status(200).json({statusCode : 200, message : "Xóa học thành công" })
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