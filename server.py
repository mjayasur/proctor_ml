from flask import Flask, request, jsonify
import sqlite3
app = Flask(__name__)
@app.route('/get-classes', methods=['GET'])
def get_classes():
    conn = sqlite3.connect('proctor.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM classes_tbl')
    result = c.fetchall()
    return jsonify(result)
