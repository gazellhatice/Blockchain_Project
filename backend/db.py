import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="blockchain",
    user="postgres",
    password="gizli"
)

cursor = conn.cursor()
