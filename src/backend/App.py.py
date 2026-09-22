from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

import numpy as np
import pandas as pd
import random
import math

from datetime import datetime, timedelta

from sklearn.model_selection import train_test_split
from sklearn.ensemble import (
    RandomForestClassifier,
    RandomForestRegressor,
    IsolationForest
)
from sklearn.cluster import KMeans
from sklearn.metrics import accuracy_score, mean_squared_error
from sklearn.preprocessing import StandardScaler


# ============================================================
# CREATE FLASK APPLICATION
# ============================================================

app = Flask(__name__)

CORS(app)


# ============================================================
# DATABASE CONFIGURATION
# ============================================================

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///aivision.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# ============================================================
# DATABASE MODEL
# PM-04
# ============================================================

class AIData(db.Model):
    """Stores AI training data."""

    __tablename__ = "ai_data"

    id = db.Column(db.Integer, primary_key=True)

    timestamp = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    feature1 = db.Column(db.Float)
    feature2 = db.Column(db.Float)
    feature3 = db.Column(db.Float)

    target = db.Column(db.Float)

    category = db.Column(db.String(50))

    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat(),
            "feature1": self.feature1,
            "feature2": self.feature2,
            "feature3": self.feature3,
            "target": self.target,
            "category": self.category
        }


# ============================================================
# MATHEMATICS FOR AI
# PM-01
# ============================================================

class AIMath:
    """Mathematics functions used by the AI system."""

    @staticmethod
    def mean(values):
        """Calculate the mean."""
        return sum(values) / len(values) if values else 0

    @staticmethod
    def std_dev(values):
        """Calculate standard deviation."""

        if len(values) < 2:
            return 0

        mean = AIMath.mean(values)

        variance = sum(
            (x - mean) ** 2
            for x in values
        ) / len(values)

        return math.sqrt(variance)

    @staticmethod
    def sigmoid(x):
        """Sigmoid activation function."""
        return 1 / (1 + math.exp(-x))

    @staticmethod
    def relu(x):
        """ReLU activation function."""
        return max(0, x)

    @staticmethod
    def bayes_theorem(
        prior,
        likelihood,
        evidence
    ):
        """Bayes theorem."""

        if evidence == 0:
            return 0

        return (likelihood * prior) / evidence


# ============================================================
# MACHINE LEARNING MODELS
# PM-07
# ============================================================

class MLModels:

    @staticmethod
    def train_classifier(X, y):
        """Train a Random Forest classifier."""

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42
        )

        model = RandomForestClassifier(
            n_estimators=100,
            random_state=42
        )

        model.fit(X_train, y_train)

        predictions = model.predict(X_test)

        accuracy = accuracy_score(
            y_test,
            predictions
        )

        return model, accuracy

    @staticmethod
    def train_regressor(X, y):
        """Train a Random Forest regression model."""

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42
        )

        model = RandomForestRegressor(
            n_estimators=100,
            random_state=42
        )

        model.fit(X_train, y_train)

        predictions = model.predict(X_test)

        mse = mean_squared_error(
            y_test,
            predictions
        )

        return model, mse

    @staticmethod
    def train_anomaly_detector(X):
        """Train an Isolation Forest anomaly detector."""

        model = IsolationForest(
            contamination=0.1,
            random_state=42
        )

        model.fit(X)

        return model

    @staticmethod
    def train_clusterer(X, n_clusters=3):
        """Train a K-Means clustering model."""

        model = KMeans(
            n_clusters=n_clusters,
            random_state=42,
            n_init=10
        )

        model.fit(X)

        return model


# ============================================================
# API ROUTES
# ============================================================

@app.route("/", methods=["GET"])
def home():
    """Main API endpoint."""

    return jsonify({
        "status": "success",
        "message": "AiVision backend is running!",
        "application": "AiVision",
        "version": "1.0"
    })


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""

    return jsonify({
        "status": "healthy",
        "message": "AiVision API is working"
    })


@app.route("/api/data", methods=["GET"])
def get_data():
    """Return all AI data from the database."""

    data = AIData.query.all()

    return jsonify([
        item.to_dict()
        for item in data
    ])


@app.route("/api/data/<int:data_id>", methods=["GET"])
def get_single_data(data_id):
    """Return one AI data record."""

    item = db.session.get(AIData, data_id)

    if item is None:
        return jsonify({
            "error": "Data not found"
        }), 404

    return jsonify(item.to_dict())


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

def initialize_database():
    """Create database tables."""

    with app.app_context():
        db.create_all()


# ============================================================
# START FLASK SERVER
# ============================================================

if __name__ == "__main__":

    initialize_database()

    print()
    print("=" * 60)
    print("        AiVision Backend Starting")
    print("=" * 60)
    print()
    print("API:          http://127.0.0.1:5000")
    print("Health Check: http://127.0.0.1:5000/api/health")
    print("Data API:     http://127.0.0.1:5000/api/data")
    print()
    print("Keep this terminal open while using the application.")
    print("=" * 60)
    print()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False,
        use_reloader=False
    )
 