from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_cors import cross_origin
import pandas as pd
import matplotlib.pyplot as plt
import os
from pymongo import MongoClient
import io
import base64
from dotenv import load_dotenv
from bson import ObjectId


app = Flask(__name__)
CORS(app)

load_dotenv()

database_url = os.getenv("MONGO_URI")
client = MongoClient(database_url)
db = client['fundrev'] 

# Sample data structures (replace with your actual database or storage solution)
investors = db['investors']
startups = db['startups']
interests = db['interests']
sales_data = db['sales_data']
# Investor Sign Up
@app.route('/signup/investor', methods=['POST'])
def investor_sign_up():
    data = request.get_json()
    user_id = data.get('userId')
    password = data.get('password')

    # Add validation and error handling as needed
    investors.insert_one({'userId': user_id, 'password': password})
    return jsonify({'message': 'Investor sign-up successful'})

# Startup Sign Up
@app.route('/signup/startup', methods=['POST'])
def startup_sign_up():
    data = request.get_json()
    company_name = data.get('companyName')
    business_description = data.get('businessDescription')
    revenue = data.get('revenue')
    password = data.get('password')

    # Add validation and error handling as needed
    startups.insert_one({'companyName': company_name, 'businessDescription': business_description, 'revenue': revenue, 'password':password})
    return jsonify({'message': 'Startup sign-up successful'})

# Investor Sign In
@app.route('/signin/investor', methods=['POST'])
def investor_sign_in():
    data = request.get_json()
    user_id = data.get('userId')
    password = data.get('password')

    # Add validation and error handling as needed
    result = investors.find_one({'userId': user_id, 'password': password})

    if result:
        result['_id'] = str(result['_id'])
        return jsonify({'message': 'Investor sign-in successful', 'data':result})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# Startup Sign In
@app.route('/signin/startup', methods=['POST'])
def startup_sign_in():
    data = request.get_json()
    company_name = data.get('companyName')
    password = data.get('password')

    # Add validation and error handling as needed
    result = startups.find_one({'companyName': company_name, 'password': password})
    if result:
        result['_id'] = str(result['_id'])
        return jsonify({'message': 'Startup sign-in successful', 'data':result})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# Get all startups
@app.route('/getstartup', methods=['GET'])
@cross_origin()
def get_startup():
    try:
        # Fetch all startup documents from the 'startups' collection
        startup_documents = startups.find({})
        
        # Convert MongoDB cursor to a list of dictionaries
        startup_data = [startup for startup in startup_documents]
        for startup in startup_data:
            startup['_id'] = str(startup['_id'])
       
        return jsonify({'data': startup_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get detail of particular startup
@app.route('/getstartupDetail/<startup_id>', methods=['GET'])
# @cross_origin()
def get_startup_detail(startup_id):
    try:
        startup_detail = startups.find_one({'_id': ObjectId(startup_id)})
        
        if startup_detail:
            startup_detail['_id'] = str(startup_detail['_id'])
            return jsonify({'data': startup_detail})
        else:
            return jsonify({'error': 'Startup not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# set interest true in startup
@app.route('/interested/<investor_id>/<startup_id>', methods=["POST"])
def set_interest(startup_id, investor_id):
    try:
        investors.update_one({'_id': ObjectId(investor_id)}, {'$push': {'interested_startups': startup_id}})
        return jsonify({'message': 'Interest added successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get detail of particular investor
@app.route('/getinvestorDetail/<investor_id>', methods=['GET'])
# @cross_origin()
def get_investor_detail(investor_id):
    try:
        investor_detail = investors.find_one({'_id': ObjectId(investor_id)})
        
        if investor_detail:
            investor_detail['_id'] = str(investor_detail['_id'])
            return jsonify({'data': investor_detail})
        else:
            return jsonify({'error': 'Investor not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Upload sales to generate chart
@app.route('/upload-sales/<startup_id>', methods=['POST'])
def upload_sales(startup_id):
    try:
        file = request.files['salesFile']
        if file:
            # Read CSV file
            data = pd.read_csv(file)
            print(data)
            # Assuming the CSV has a 'Date' column and a 'Sales' column
            data['Order Date'] = pd.to_datetime(data['Order Date'])
            print(data['Order Date'])
            # Group by month and sum sales
            monthly_sales = data.groupby(data['Order Date'].dt.to_period("M")).agg({'Sales': 'sum'})
            print("monthly_sales", monthly_sales)
            # Generate chart
            months = monthly_sales.index.astype(str).tolist()

            # Plot the bar chart
            plt.figure(figsize=(18, 10))
            plt.bar(months, monthly_sales['Sales'],width=0.6)  # Access 'Sales' column for y-values
            plt.xlabel('Month')
            plt.ylabel('Total Sales')
            plt.title('Monthly Sales Chart')
            plt.xticks(rotation=45, ha='right',fontsize=10)
            plt.tight_layout()

            buffer = io.BytesIO()
            plt.savefig(buffer, format='png')
            buffer.seek(0)
            chart_image_path = base64.b64encode(buffer.getvalue()).decode('utf-8')
            startups.update_one({'_id': ObjectId(startup_id)}, {'$set': {'chart_image': chart_image_path}})


            return jsonify({'message': 'Sales data uploaded and chart generated', 'chart_image_path': chart_image_path})
        else:
            return jsonify({'error': 'No file uploaded'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
