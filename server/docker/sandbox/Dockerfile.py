FROM python:3.11-alpine

WORKDIR /app

# Disable pip cache and reduce surface
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY runner.py .

CMD ["python3", "runner.py"]