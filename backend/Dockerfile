FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

ENV APP_PORT=8000
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "[IP_ADDRESS]", "--port", "8000"]