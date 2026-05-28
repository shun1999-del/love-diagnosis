"""恋愛タイプ診断 - Analytics DB (SQLite)"""
import sqlite3
import os
from datetime import datetime, timedelta

DB_PATH = os.getenv("DB_PATH", os.path.join(os.path.dirname(__file__), "analytics.db"))


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            event TEXT NOT NULL,
            result_type TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at)")
    conn.commit()
    conn.close()


def insert_event(session_id: str, event: str, result_type: str = None):
    conn = get_conn()
    conn.execute(
        "INSERT INTO events (session_id, event, result_type, created_at) VALUES (?, ?, ?, ?)",
        (session_id, event, result_type, datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()


def _date_filter(days: int = None):
    """Return SQL WHERE clause + params for date filtering."""
    if days is None:
        return "", []
    since = (datetime.utcnow() - timedelta(days=days)).isoformat()
    return "AND created_at >= ?", [since]


# ---- Funnel steps in order ----
FUNNEL_STEPS = ["fv", "start", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "result", "line_click"]


def get_funnel(days: int = None):
    """Return funnel data: unique session count per step + conversion rates."""
    date_clause, params = _date_filter(days)
    conn = get_conn()

    funnel = []
    prev_count = None
    for step in FUNNEL_STEPS:
        row = conn.execute(
            f"SELECT COUNT(DISTINCT session_id) as cnt FROM events WHERE event = ? {date_clause}",
            [step] + params,
        ).fetchone()
        count = row["cnt"]
        rate = round(count / prev_count * 100, 1) if prev_count and prev_count > 0 else 100.0
        funnel.append({"step": step, "count": count, "rate": rate})
        prev_count = count if count > 0 else prev_count

    conn.close()
    return funnel


def get_type_distribution(days: int = None):
    """Return type distribution for sessions that reached result."""
    date_clause, params = _date_filter(days)
    conn = get_conn()
    rows = conn.execute(
        f"""SELECT result_type, COUNT(DISTINCT session_id) as cnt
            FROM events
            WHERE event = 'result' AND result_type IS NOT NULL {date_clause}
            GROUP BY result_type ORDER BY cnt DESC""",
        params,
    ).fetchall()
    conn.close()
    return [{"type": r["result_type"], "count": r["cnt"]} for r in rows]


def get_total_sessions(days: int = None):
    date_clause, params = _date_filter(days)
    conn = get_conn()
    row = conn.execute(
        f"SELECT COUNT(DISTINCT session_id) as cnt FROM events WHERE event = 'fv' {date_clause}",
        params,
    ).fetchone()
    conn.close()
    return row["cnt"]
