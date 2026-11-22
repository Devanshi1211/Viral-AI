import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor

df = pd.read_csv("ml-service/data/virality_dataset_large.csv")

features = [
    "likes",
    "comments",
    "shares",
    "watchTime",
    "captionLength",
    "hashtagsCount",
    "postingHour",
    "engagementRate"
]

X = df[features]
y = df["viralityScore"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

models = {
    "Linear Regression": LinearRegression(),
    "Random Forest": RandomForestRegressor(
        n_estimators=200,
        random_state=42
    ),
    "Gradient Boosting": GradientBoostingRegressor(
        n_estimators=200,
        random_state=42
    ),
    "Extra Trees": ExtraTreesRegressor(
        n_estimators=200,
        random_state=42
    )
}

results = []
best_model = None
best_r2 = float("-inf")
best_name = ""

for name, model in models.items():

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = mean_squared_error(y_test, predictions) ** 0.5
    r2 = r2_score(y_test, predictions)

    results.append((name, mae, rmse, r2))

    if r2 > best_r2:
        best_r2 = r2
        best_model = model
        best_name = name

print()
print("MODEL COMPARISON")
print("-" * 55)

for name, mae, rmse, r2 in results:
    print(
        f"{name:<20} "
        f"MAE={mae:.2f}  "
        f"RMSE={rmse:.2f}  "
        f"R2={r2:.2f}"
    )

print("-" * 55)
print("BEST MODEL:", best_name)

joblib.dump(best_model, "ml-service/models/virality_model.pkl")

if best_name == "Linear Regression":

    coefficients = dict(
        zip(features, best_model.coef_)
    )

    joblib.dump(
        coefficients,
        "ml-service/models/feature_importance.pkl"
    )

    print("Feature importance saved.")

print("Saved: ml-service/models/virality_model.pkl")
