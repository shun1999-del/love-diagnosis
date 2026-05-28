"""恋愛タイプ診断 - Quiz Web App"""
from flask import Flask, render_template, request, jsonify, make_response, Response
from functools import wraps
import os
import uuid

import db

app = Flask(__name__)

# LINE公式アカウントURL（環境変数 or ここに直接設定）
LINE_URL = os.getenv("LINE_URL", "")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin")

# DB初期化
db.init_db()


# ---- Session Cookie Helper ----
def get_or_create_session(req, resp=None):
    """Get session_id from cookie, or create new one."""
    sid = req.cookies.get("sid")
    if not sid:
        sid = uuid.uuid4().hex
        if resp:
            resp.set_cookie("sid", sid, max_age=60 * 60 * 24 * 365, httponly=True, samesite="Lax")
    return sid


# ---- Basic Auth ----
def check_auth(username, password):
    return username == "admin" and password == ADMIN_PASSWORD


def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return Response(
                "Login required", 401,
                {"WWW-Authenticate": 'Basic realm="Admin"'},
            )
        return f(*args, **kwargs)
    return decorated


@app.route("/")
def index():
    reader_id = request.args.get("rid", "")
    resp = make_response(render_template("index.html", reader_id=reader_id, line_url=LINE_URL))
    get_or_create_session(request, resp)
    return resp


@app.route("/api/event", methods=["POST"])
def track_event():
    """Track analytics event."""
    data = request.json or {}
    event = data.get("event", "")
    result_type = data.get("type")

    valid_events = {"fv", "start", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "result", "line_click"}
    if event not in valid_events:
        return jsonify({"error": "invalid event"}), 400

    sid = request.cookies.get("sid", uuid.uuid4().hex)

    # Deduplicate: same session + same event → skip
    conn = db.get_conn()
    existing = conn.execute(
        "SELECT 1 FROM events WHERE session_id = ? AND event = ?", (sid, event)
    ).fetchone()
    conn.close()

    if not existing:
        db.insert_event(sid, event, result_type)

    return jsonify({"ok": True})


@app.route("/healthz")
def healthz():
    """Health check for keep-alive pings."""
    return "ok", 200


@app.route("/api/tag", methods=["POST"])
def tag_reader():
    """UTAGEリーダーにタイプ別タグを付与する（UTAGE連携時に使用）"""
    data = request.json
    reader_id = data.get("reader_id", "")
    result_type = data.get("type", "")

    if not reader_id or not result_type:
        return jsonify({"error": "reader_id and type are required"}), 400

    # TODO: UTAGE API連携
    print(f"[UTAGE TAG] reader={reader_id}, type={result_type}")

    return jsonify({"ok": True, "reader_id": reader_id, "type": result_type})


@app.route("/admin")
@auth_required
def admin():
    days_param = request.args.get("days")
    days = int(days_param) if days_param else None

    funnel = db.get_funnel(days)
    type_dist = db.get_type_distribution(days)
    total = db.get_total_sessions(days)

    return render_template(
        "admin.html",
        funnel=funnel,
        type_dist=type_dist,
        total=total,
        current_days=days_param or "all",
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5010, debug=True)
