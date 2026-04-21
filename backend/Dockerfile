# Use official Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput --settings=config.settings || true

# Expose port
EXPOSE $PORT

# Run gunicorn
CMD gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120
