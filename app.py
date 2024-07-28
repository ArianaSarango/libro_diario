from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Lista para almacenar las entradas
entries = []

@app.route('/')
def index():
    return render_template('index.html', entries=entries)

@app.route('/add_entry', methods=['POST'])
def add_entry():
    entry = request.json
    entries.append(entry)
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)