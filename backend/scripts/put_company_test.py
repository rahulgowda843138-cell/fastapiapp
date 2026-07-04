import requests

url = 'http://127.0.0.1:8000/company/3'
headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc4MzE4NzE5Mn0.ytw_nu6NK33nYIyjsIU9ysSvggsSorFrGtMbaQdIcSg',
    'Content-Type': 'application/json'
}

data = {"name":"UpdatedName","email":"string111","phone":"string11","location":None}
resp = requests.put(url, headers=headers, json=data)
print('STATUS', resp.status_code)
print('TEXT', resp.text)
print('HEADERS', resp.headers)
