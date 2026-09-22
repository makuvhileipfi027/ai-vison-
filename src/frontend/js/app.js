// ========================================
// AIVISION JAVASCRIPT
// ========================================


// ========================================
// HELPER FUNCTION
// ========================================

function showMessage(elementId, message) {

    const element = document.getElementById(elementId);

    if (element) {
        element.innerHTML = message;
    }
}


// ========================================
// GENERATE SAMPLE DATA
// ========================================

async function generateData() {

    showMessage(
        "dashboardMessage",
        "Generating data..."
    );

    try {

        const response = await fetch(
            "/api/data/generate",
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (data.success) {

            showMessage(
                "dashboardMessage",
                `
                <strong>Success</strong><br>
                ${data.message}
                `
            );

        } else {

            showMessage(
                "dashboardMessage",
                data.error
            );

        }

    } catch (error) {

        showMessage(
            "dashboardMessage",
            "Error: " + error.message
        );

    }
}


// ========================================
// UPLOAD CSV
// ========================================

async function uploadCSV() {

    const input =
        document.getElementById("csvFile");

    if (!input || !input.files.length) {

        showMessage(
            "dashboardMessage",
            "Please select a CSV file."
        );

        return;
    }


    const formData = new FormData();

    formData.append(
        "file",
        input.files[0]
    );


    showMessage(
        "dashboardMessage",
        "Uploading dataset..."
    );


    try {

        const response = await fetch(
            "/api/data/upload/csv",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();


        if (data.success) {

            showMessage(
                "dashboardMessage",
                `
                <strong>Upload successful</strong><br>
                ${data.message}<br>
                Rows loaded: ${data.total_rows}
                `
            );

        } else {

            showMessage(
                "dashboardMessage",
                data.error
            );

        }

    } catch (error) {

        showMessage(
            "dashboardMessage",
            "Upload failed: " + error.message
        );

    }

}


// ========================================
// LOAD DATASET FROM URL
// ========================================

async function loadDatasetURL() {

    const input =
        document.getElementById("datasetUrl");

    const url = input.value.trim();


    if (!url) {

        showMessage(
            "dashboardMessage",
            "Please enter a dataset URL."
        );

        return;
    }


    showMessage(
        "dashboardMessage",
        "Loading dataset..."
    );


    try {

        const response = await fetch(
            "/api/data/upload/url",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    url: url
                })

            }
        );


        const data = await response.json();


        if (data.success) {

            showMessage(
                "dashboardMessage",
                `
                <strong>Dataset loaded</strong><br>
                ${data.message}
                `
            );

        } else {

            showMessage(
                "dashboardMessage",
                data.error
            );

        }

    } catch (error) {

        showMessage(
            "dashboardMessage",
            "Error: " + error.message
        );

    }

}


// ========================================
// STATISTICS
// ========================================

async function loadStatistics() {

    showMessage(
        "statisticsResult",
        "Loading statistics..."
    );


    try {

        const response = await fetch(
            "/api/math/statistics"
        );

        const data = await response.json();


        if (!data.success) {

            showMessage(
                "statisticsResult",
                data.error
            );

            return;
        }


        const stats = data.statistics;


        showMessage(
            "statisticsResult",
            `

            <h3>Feature 1</h3>

            Mean: ${stats.feature1.mean.toFixed(2)}<br>
            Standard Deviation: ${stats.feature1.std_dev.toFixed(2)}<br>
            Minimum: ${stats.feature1.min}<br>
            Maximum: ${stats.feature1.max}<br><br>


            <h3>Feature 2</h3>

            Mean: ${stats.feature2.mean.toFixed(2)}<br>
            Standard Deviation: ${stats.feature2.std_dev.toFixed(2)}<br><br>


            <h3>Feature 3</h3>

            Mean: ${stats.feature3.mean.toFixed(2)}<br>
            Standard Deviation: ${stats.feature3.std_dev.toFixed(2)}<br><br>


            <h3>Target</h3>

            Mean: ${stats.target.mean.toFixed(2)}<br>

            `
        );


    } catch (error) {

        showMessage(
            "statisticsResult",
            "Error: " + error.message
        );

    }

}


// ========================================
// MACHINE LEARNING CLASSIFICATION
// ========================================

async function runClassification() {

    showMessage(
        "mlResult",
        "Training classifier..."
    );


    try {

        const response = await fetch(
            "/api/ml/classify",
            {
                method: "POST"
            }
        );


        const data = await response.json();


        if (data.success) {

            showMessage(
                "mlResult",
                `

                <h3>Classification Result</h3>

                Model:
                ${data.model}

                <br><br>

                Accuracy:
                <strong>
                ${data.accuracy}%
                </strong>

                <br><br>

                Samples:
                ${data.samples}

                <br><br>

                Categories:
                ${data.categories.join(", ")}

                `
            );

        } else {

            showMessage(
                "mlResult",
                data.error
            );

        }

    } catch (error) {

        showMessage(
            "mlResult",
            "Error: " + error.message
        );

    }

}


// ========================================
// REGRESSION
// ========================================

async function runRegression() {

    showMessage(
        "mlResult",
        "Training regression model..."
    );


    try {

        const response = await fetch(
            "/api/ml/regression",
            {
                method: "POST"
            }
        );


        const data = await response.json();


        if (data.success) {

            showMessage(
                "mlResult",
                `

                <h3>Regression Result</h3>

                Model:
                ${data.model}

                <br><br>

                MSE:
                ${data.mse}

                <br>

                RMSE:
                ${data.rmse}

                <br><br>

                Samples:
                ${data.samples}

                `
            );

        } else {

            showMessage(
                "mlResult",
                data.error
            );

        }

    } catch (error) {

        showMessage(
            "mlResult",
            "Error: " + error.message
        );

    }

}


// ========================================
// CLUSTERING
// ========================================

async function runClustering() {

    showMessage(
        "mlResult",
        "Running K-Means clustering..."
    );


    try {

        const response = await fetch(
            "/api/ml/clustering",
            {
                method: "POST"
            }
        );


        const data = await response.json();


        if (data.success) {

            let clusterText = "";


            for (const cluster in data.counts) {

                clusterText +=
                    `Cluster ${cluster}: ${data.counts[cluster]} samples<br>`;

            }


            showMessage(
                "mlResult",
                `

                <h3>Clustering Result</h3>

                Model:
                ${data.model}

                <br><br>

                Number of clusters:
                ${data.clusters}

                <br><br>

                ${clusterText}

                `
            );

        } else {

            showMessage(
                "mlResult",
                data.error
            );

        }

    } catch (error) {

        showMessage(
            "mlResult",
            "Error: " + error.message
        );

    }

}


// ========================================
// ANOMALY DETECTION
// ========================================

async function runAnomalyDetection() {

    showMessage(
        "mlResult",
        "Detecting anomalies..."
    );


    try {

        const response = await fetch(
            "/api/ml/anomaly",
            {
                method: "POST"
            }
        );


        const data = await response.json();


        if (data.success) {

            showMessage(
                "mlResult",
                `

                <h3>Anomaly Detection</h3>

                Model:
                ${data.model}

                <br><br>

                Total Records:
                ${data.total}

                <br>

                Anomalies:
                ${data.anomalies}

                <br>

                Anomaly Rate:
                ${data.rate}%

                `
            );

        } else {

            showMessage(
                "mlResult",
                data.error
            );

        }

    } catch (error) {

        showMessage(
            "mlResult",
            "Error: " + error.message
        );

    }

}


// ========================================
// DEEP LEARNING
// ========================================

async function trainDeepLearning() {

    showMessage(
        "deepLearningResult",
        "Training neural network..."
    );


    try {

        const response = await fetch(
            "/api/deep-learning/train",
            {
                method: "POST"
            }
        );


        const data = await response.json();


        if (data.success) {

            showMessage(
                "deepLearningResult",
                `

                <h3>Training Complete</h3>

                Model:
                ${data.model}

                <br><br>

                Epochs:
                ${data.epochs}

                <br>

                Accuracy:
                <strong>
                ${data.accuracy}%
                </strong>

                <br><br>

                Initial Loss:
                ${data.initial_loss}

                <br>

                Final Loss:
                ${data.final_loss}

                `
            );

        } else {

            showMessage(
                "deepLearningResult",
                data.error
            );

        }

    } catch (error) {

        showMessage(
            "deepLearningResult",
            "Error: " + error.message
        );

    }

}


// ========================================
// ANALYTICS SUMMARY
// ========================================

async function loadAnalytics() {

    try {

        const response = await fetch(
            "/api/analytics/summary"
        );


        const data = await response.json();


        if (!data.success) {

            showMessage(
                "analyticsStatus",
                data.error
            );

            return;
        }


        const samples =
            document.getElementById(
                "totalSamples"
            );


        if (samples) {

            samples.textContent =
                data.total_samples;

        }


        showMessage(
            "categoriesResult",
            data.categories.join("<br>")
        );


        showMessage(
            "analyticsStatus",
            "Dataset loaded successfully."
        );


    } catch (error) {

        showMessage(
            "analyticsStatus",
            "Error: " + error.message
        );

    }

}


// ========================================
// ANALYTICS STATISTICS
// ========================================

async function loadStatisticsAnalytics() {

    showMessage(
        "analyticsStatistics",
        "Loading statistics..."
    );


    try {

        const response = await fetch(
            "/api/math/statistics"
        );


        const data = await response.json();


        if (!data.success) {

            showMessage(
                "analyticsStatistics",
                data.error
            );

            return;
        }


        const stats = data.statistics;


        showMessage(
            "analyticsStatistics",
            `

            <h3>Dataset Statistical Summary</h3>

            Feature 1 Mean:
            ${stats.feature1.mean.toFixed(2)}

            <br>

            Feature 1 Standard Deviation:
            ${stats.feature1.std_dev.toFixed(2)}

            <br><br>


            Feature 2 Mean:
            ${stats.feature2.mean.toFixed(2)}

            <br>

            Feature 2 Standard Deviation:
            ${stats.feature2.std_dev.toFixed(2)}

            <br><br>


            Feature 3 Mean:
            ${stats.feature3.mean.toFixed(2)}

            <br>

            Target Mean:
            ${stats.target.mean.toFixed(2)}

            <br><br>


            Correlation F1 → Target:

            ${stats.correlations.f1_target.toFixed(3)}

            `
        );


    } catch (error) {

        showMessage(
            "analyticsStatistics",
            "Error: " + error.message
        );

    }

}