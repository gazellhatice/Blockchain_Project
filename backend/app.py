from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from blockchain import Blockchain
from auth import register, login, SECRET_KEY
from db import cursor, conn
import jwt
from functools import wraps
import time
import bcrypt
import json
import os
from werkzeug.utils import secure_filename
from contracts.rules import validate_transaction
from security import encrypt_data, decrypt_data

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
UPLOAD_FOLDER = os.path.join(os.getcwd(), "avatars")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB dosya limiti

# JWT kontrolü
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == "OPTIONS":
            return jsonify({}), 200
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token eksik!"}), 403
        try:
            data = jwt.decode(token.replace("Bearer ", ""), SECRET_KEY, algorithms=["HS256"])
            current_user = data["username"]
        except:
            return jsonify({"message": "Token geçersiz!"}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@app.route("/register", methods=["POST"])
def handle_register():
    try:
        return register()
    except Exception as e:
        conn.rollback()
        print("❌ REGISTER HATASI:", str(e))
        return jsonify({"message": "Sunucu hatası (register)"}), 500

@app.route("/login", methods=["POST"])
def handle_login():
    try:
        return login()
    except Exception as e:
        conn.rollback()
        print("❌ LOGIN HATASI:", str(e))
        return jsonify({"message": "Sunucu hatası (login)"}), 500

def load_user_blockchain(username):
    blockchain = Blockchain()
    cursor.execute("""
        SELECT index_number, timestamp, transactions, previous_hash, hash, nonce
        FROM blocks
        WHERE username = %s
        ORDER BY index_number
    """, (username,))
    rows = cursor.fetchall()

    if len(rows) == 0:
        return blockchain

    blockchain.chain.clear()
    for row in rows:
        block = {
            "index": row[0],
            "timestamp": row[1],
            "transactions": json.loads(row[2]),
            "previous_hash": row[3],
            "hash": row[4],
            "nonce": row[5]
        }
        blockchain.chain.append(blockchain.dict_to_block(block))

    return blockchain

@app.route("/add_transaction", methods=["POST"])
@token_required
def add_transaction(current_user):
    try:
        data = request.get_json()
        action = data.get("action")
        if not action:
            return jsonify({"message": "İşlem eksik"}), 400

        validate_transaction(current_user, action)  # Smart contract kontrolü
        encrypted_action = encrypt_data(action)  # Veri mahremiyeti

        blockchain = load_user_blockchain(current_user)
        transaction = {
            "user": current_user,
            "action": encrypted_action,
            "timestamp": time.time()
        }
        new_block = blockchain.add_block([transaction])

        cursor.execute("""
            INSERT INTO blocks (index_number, timestamp, transactions, previous_hash, hash, nonce, username)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            new_block.index,
            new_block.timestamp,
            json.dumps(new_block.transactions),
            new_block.previous_hash,
            new_block.hash,
            new_block.nonce,
            current_user
        ))
        conn.commit()

        return jsonify({"message": "Blok eklendi", "hash": new_block.hash})
    except Exception as e:
        conn.rollback()
        print("TRANSACTION HATASI:", str(e))
        return jsonify({"message": str(e)}), 500

@app.route("/update-profile", methods=["POST", "OPTIONS"])
@token_required
def update_profile(current_user):
    try:
        data = request.get_json()
        new_username = data.get("username")
        new_email = data.get("email")
        new_password = data.get("password")

        if new_username:
            cursor.execute("UPDATE users SET username = %s WHERE username = %s", (new_username, current_user))
            cursor.execute("UPDATE blocks SET username = %s WHERE username = %s", (new_username, current_user))
            current_user = new_username

        if new_email:
            cursor.execute("UPDATE users SET email = %s WHERE username = %s", (new_email, current_user))

        if new_password:
            hashed = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
            cursor.execute("UPDATE users SET password = %s WHERE username = %s", (hashed.decode("utf-8"), current_user))

        conn.commit()
        return jsonify({"message": "Profil güncellendi", "success": True}), 200

    except Exception as e:
        conn.rollback()
        print("UPDATE PROFILE HATASI:", str(e))
        return jsonify({"message": "Profil güncellenemedi"}), 500

@app.route("/chain", methods=["GET"])
@token_required
def get_chain(current_user):
    try:
        cursor.execute("""
            SELECT id, index_number, timestamp, transactions, previous_hash, hash, nonce
            FROM blocks
            WHERE username = %s
            ORDER BY index_number
        """, (current_user,))
        rows = cursor.fetchall()

        chain_data = []
        for row in rows:
            block = {
                "id": row[0],  # 👈 id'yi ekle
                "index": row[1],
                "timestamp": row[2],
                "transactions": json.loads(row[3]),
                "previous_hash": row[4],
                "hash": row[5],
                "nonce": row[6]
            }

            # her işlemde action alanını şifre çöz
            for tx in block["transactions"]:
                try:
                    tx["action"] = decrypt_data(tx["action"])
                except:
                    tx["action"] = "[Şifre çözme hatası ❌]"

            chain_data.append(block)

        return jsonify(chain_data)

    except Exception as e:
        conn.rollback()
        print("CHAIN GETİRME HATASI:", str(e))
        return jsonify([]), 500


@app.route("/validate", methods=["GET"])
@token_required
def validate_chain(current_user):
    try:
        blockchain = load_user_blockchain(current_user)
        is_valid = blockchain.is_chain_valid()
        return jsonify({"valid": is_valid})
    except Exception as e:
        conn.rollback()
        print("VALIDATE HATASI:", str(e))
        return jsonify({"valid": False}), 500

@app.route("/upload-avatar", methods=["POST"])
@token_required
def upload_avatar(current_user):
    try:
        if "avatar" not in request.files:
            return jsonify({"message": "Dosya gerekli"}), 400

        file = request.files["avatar"]
        if file.filename == "":
            return jsonify({"message": "Dosya adı boş"}), 400

        if file.mimetype not in ["image/png", "image/jpeg"]:
            return jsonify({"message": "Yalnızca PNG ve JPG dosyalarına izin verilir."}), 400

        filename = secure_filename(f"{current_user}_avatar.png")
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        return jsonify({"message": "Profil resmi yüklendi", "filename": filename})
    except Exception as e:
        print("AVATAR YÜKLEME HATASI:", str(e))
        return jsonify({"message": "Yükleme başarısız"}), 500

@app.route("/avatars/<filename>")
def get_avatar(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/delete_block/<int:id>", methods=["DELETE"])
@token_required
def delete_block(current_user, id):
    try:
        cursor.execute("""
            DELETE FROM blocks
            WHERE id = %s AND username = %s
        """, (id, current_user))

        if cursor.rowcount == 0:
            return jsonify({"message": "Blok bulunamadı veya yetkiniz yok"}), 404

        conn.commit()
        return jsonify({"message": f"Blok başarıyla silindi ✅"})
    except Exception as e:
        conn.rollback()
        print("BLOK SİLME HATASI:", str(e))
        return jsonify({"message": "Blok silinemedi"}), 500


if __name__ == "__main__":
    app.run(debug=False)