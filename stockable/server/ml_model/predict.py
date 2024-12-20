from flask import Flask, request, jsonify
import joblib
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
import re
import string
from flask_cors import CORS

# Download required NLTK resources
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')

# Initialize lemmatizer and stopwords
lemmatizer = WordNetLemmatizer()
STOPWORDS = set(stopwords.words('english'))

# Define a wordnet mapping for lemmatization
wordnet_map = {"N": wordnet.NOUN, "V": wordnet.VERB, "J": wordnet.ADJ, "R": wordnet.ADV}

def lemmatize_words(text):
    pos_tagged_text = nltk.pos_tag(text.split())
    return " ".join([lemmatizer.lemmatize(word, wordnet_map.get(pos[0], wordnet.NOUN)) for word, pos in pos_tagged_text])

def preprocess_text(text):
    # Lowercase the text
    text = text.lower()
    # Remove punctuation and stopwords
    text = " ".join([word for word in text.split() if word not in string.punctuation and word not in STOPWORDS])
    # Remove numbers
    text = re.sub(r'\d+', '', text)
    # Remove special characters
    text = re.sub(r'[^\w\s]+', ' ', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Lemmatize the text
    text = lemmatize_words(text)
    return text

# Load the trained machine learning model from the pickle file
MODEL_PATH = "pipe_svc.pkl"  # Replace with your pickle file path
model = joblib.load(MODEL_PATH)

# Initialize the Flask app
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}}) #Restrict CORS to /predict route

# or for all routes
# CORS(app, origins="http://localhost:5173")



@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get input data from the request
        data = request.get_json()

        if "input" not in data:
            return jsonify({"error": "Missing 'input' in request body."}), 400

        input_data = data["input"]

        # Ensure the input data is a string
        if not isinstance(input_data, str):
            return jsonify({"error": "Input data must be a string."}), 400

        # Preprocess the text
        preprocessed_text = preprocess_text(input_data)

        # Make predictions using the loaded model
        predictions = model.predict([preprocessed_text])

        # Map predictions to sentiment strings
        predictions = [str(pred) for pred in predictions]

        # Return the predictions as a JSON response
        return jsonify({"predictions": predictions})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == "__main__":
    app.run(debug=True, port=5123)
