FROM python:3.11-slim

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Копируем entrypoint и выдаем права (на случай, если забудешь сделать chmod локально)
RUN chmod +x entrypoint.sh

# Создаем юзера и меняем владельца файлов
RUN useradd -m appuser && chown -R appuser /app
USER appuser

EXPOSE 8000

# Entrypoint выполнится ПЕРЕД Cmd
ENTRYPOINT ["./entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]