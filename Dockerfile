FROM python:3.11-slim

RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /readact
COPY backend/requirements.txt /readact/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r /readact/requirements.txt
COPY backend/ /readact/
RUN mkdir -p /readact/model-best /readact/uploads /readact/results
RUN gsutil cp gs://read-act-bucket/model.tar.gz /readact/model.tar.gz
RUN tar -xzvf /readact/model.tar.gz
RUN rm /readact/model.tar.gz

COPY  frontend/dist/ /usr/share/nginx/html
COPY  default.nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 5000
CMD ["sh", "-c", "python /readact/run.py & nginx -c /etc/nginx/nginx.conf -g 'daemon off;'"]
