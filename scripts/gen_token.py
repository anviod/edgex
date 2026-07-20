import jwt
import datetime

key = 'GATEWAY'
now = datetime.datetime.now(datetime.timezone.utc)
claims = {
    'name': 'admin',
    'email': '',
    'iat': now,
    'exp': now + datetime.timedelta(days=7),
    'iss': 'IndustrialEdgeGateway'
}
token = jwt.encode(claims, key, algorithm='HS256')
print(token)