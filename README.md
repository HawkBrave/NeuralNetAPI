# MNIST Classifier NeuralNet API

## About

This REST API exposes a classifier neural network that can predict hand-written digits.
The classifier needs to be trained first with the MNIST dataset before it can make any useful predictions.

## Endpoints

---

### To get the this README in HTML

---

#### Request

```curl
curl / -X GET
```

### Prediction

---

#### Endpoint

`/predict`

#### Response Fields

| Field name | Data type |
| --- | --- |
| answer | int |
| confidence | float |
| groundTruth | int |
| answerIsRight | bool |

#### Example Request

```curl
curl /api/mnist/predict -X POST \
  -H "Content-Type: application/json" \
  -d "@./test_data/test-digit-7.json"
```

#### Example Response

```json
{
  "answer": 7,
  "confidence": 98.40227284559472,
  "groundTruth": null,
  "answerIsRight": null
}
```

### Train classifier with MNIST dataset

---

#### Endpoint

`/train`

#### Request Fields

| Field name | Data type |
| --- | --- |
| epochs (optional) | int |
| learningRate (optional) | float |

#### Response Fields

| Field name | Data type |
| --- | --- |
| totalTrained | int |
| status | string |
| timeElapsedInSeconds | float |

#### Example Request

```curl
curl /api/mnist/train -X POST \
  -H "Content-Type: application/json" \
  -d "{\"epochs\": 5}"
```

#### Example Response

```json
{
  "totalTrained": 300000,
  "status": "Done",
  "timeElapsedInSeconds": 756.719
}
```

### Test classifier accuracy with test dataset

---

#### Endpoint

`/test`

#### Request Fields

| Field name | Data type |
| --- | --- |
| testLength (optional) | int |

#### Response Fields

| Field name | Data type |
| --- | --- |
| totalTested | int |
| totalCorrectAnswers | int |
| totalWrongAnswers | int |
| accuracy | float |

#### Example Request

```curl
curl /api/mnist/test -X POST \
  -H "Content-Type: application/json"
```

#### Response

```json
{
  "totalTested": 10000,
  "totalCorrectAnswers": 8153,
  "totalWrongAnswers": 1847,
  "accuracy": 81.53
}
```

## Usage

---

1. Clone the repo
2. `npm install`
3. `npm run build`
4. `npm run start`
