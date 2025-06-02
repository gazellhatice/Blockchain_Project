from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import cursor, conn
import jwt, datetime

SECRET_KEY = "supersecret"

def register():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        if cursor.fetchone():
            return jsonify({"message": "Kullanıcı zaten var."}), 400

        # password_hash = generate_password_hash(password, method="pbkdf2:sha512")
        # password_hash = generate_password_hash(password, method="scrypt")


        password_hash = generate_password_hash(password)
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password_hash))
        conn.commit()

        return jsonify({"message": "Kayıt başarılı"}), 201

    except Exception as e:
        print("REGISTER HATASI:", e)
        return jsonify({"message": "Sunucu hatası"}), 500

def login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        cursor.execute("SELECT password FROM users WHERE username = %s", (username,))
        result = cursor.fetchone()

        if not result or not check_password_hash(result[0], password):
            return jsonify({"message": "Geçersiz kullanıcı adı veya şifre"}), 401

        token = jwt.encode({
            "username": username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "token": token.decode("utf-8") if isinstance(token, bytes) else token
        })

    except Exception as e:
        print("LOGIN HATASI:", e)
        return jsonify({"message": "Sunucu hatası"}), 500
