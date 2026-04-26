from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# Path to the products.json file (relative to project root)
PRODUCTS_FILE = os.path.join(os.path.dirname(__file__), '../src/data/products.json')

def read_products():
    if not os.path.exists(PRODUCTS_FILE):
        return []
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_products(products):
    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2)

@app.route('/')
def index():
    return jsonify({"message": "AniStore Backend is running!", "status": "online"})

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(read_products())

@app.route('/api/products', methods=['POST'])
def add_product():
    new_product = request.json
    products = read_products()
    
    # Simple ID generation
    new_product['id'] = str(len(products) + 1)
    products.append(new_product)
    
    write_products(products)
    return jsonify({"success": True, "product": new_product}), 201

if __name__ == '__main__':
    print(f"Backend running on http://localhost:5000")
    app.run(debug=True, port=5000)
