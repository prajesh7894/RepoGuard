# This is a dummy file for testing the RepoGuard scanner's ability to detect hardcoded DB URIs.

MONGO_URI = "mongodb+srv://admin:supersecretpassword@cluster0.mongodb.net/testdb"
POSTGRES_URL = "postgres://user:pass123@localhost:5432/myapp"
MYSQL_CONN = "mysql://root:password@127.0.0.1:3306/db"
REDIS_URL = "redis://:secretpassword@redis-server:6379/0"
RABBITMQ = "amqp://guest:guest@localhost:5672/"

def connect():
    pass
