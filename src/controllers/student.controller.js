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
        if(tokenDecode != null || tokenDecode.exp > dateNow.getTime() / 1000){
            db.query("SELECT user_id, roles FROM users WHERE user_id = ?", 
            [tokenDecode.user_id],
            function(err, response){
                if(err){
                    res.status(500).json({statusCode : 500, message : err });
                    return;
                }else{
                    if(response.length > 0 && response[0].roles == "ADMIN"){
                        let query = "SELECT MaSV, HoTen, GioiTinh, NgaySinh, Email, SoDT, DiaChi, "
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

    createStudent : (req, res) => {
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

    deleteStudent : (req, res) => {
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
    }
}