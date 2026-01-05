# Backend Service (FastAPI)

The backend currently acts as the **Consumer**.

## Data Contract
We strictly type all messages using Pydantic.
**Model:** `LogEvent`
- `service_name`: (str)
- `timestamp`: (float)
- `severity`: (str) [INFO, ERROR, WARN]
- `payload`: (dict)