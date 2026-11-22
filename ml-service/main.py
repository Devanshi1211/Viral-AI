from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(
    title="ViralAI ML Service",
    version="3.0.0"
)

model = joblib.load("ml-service/models/virality_model.pkl")
feature_importance = joblib.load(
    "ml-service/models/feature_importance.pkl"
)


class ViralityInput(BaseModel):
    likes: float = 0
    comments: float = 0
    shares: float = 0
    watchTime: float = 0
    captionLength: float = 100
    hashtagsCount: float = 5
    postingHour: float = 18
    engagementRate: float = 0


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "ViralAI ML Service",
        "model": "Linear Regression"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "Linear Regression"
    }


@app.post("/predict")
def predict(data: ViralityInput):

    features = pd.DataFrame([{
        "likes": data.likes,
        "comments": data.comments,
        "shares": data.shares,
        "watchTime": data.watchTime,
        "captionLength": data.captionLength,
        "hashtagsCount": data.hashtagsCount,
        "postingHour": data.postingHour,
        "engagementRate": data.engagementRate
    }])

    prediction = float(model.predict(features)[0])

    prediction = max(0, min(100, prediction))

    influences = []

    for feature, coefficient in feature_importance.items():

        value = float(features.iloc[0][feature])

        influence = coefficient * value

        influences.append({
            "feature": feature,
            "coefficient": round(float(coefficient), 4),
            "influence": round(float(influence), 2)
        })

    influences.sort(
        key=lambda x: abs(x["influence"]),
        reverse=True
    )

    return {
        "success": True,
        "predictedScore": round(prediction, 2),
        "model": "Linear Regression",
        "topFactors": influences[:5]
    }
