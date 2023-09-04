from paho.mqtt.client import Client, connack_string as cs
from requests import post
from dotenv import load_dotenv
from os import getenv

load_dotenv()

def on_connect(client, userdata, flags, rc):
    print(cs(rc))

    # Suscription to stock/info
    client.subscribe("stocks/info")

def on_message(client, userdata, msg):
    url = "http://web:8000/stocks/submit"
    try:
        response = post(url, msg.payload)
        print(response.status_code, response.reason)
    except Exception as error:
        print(f"There was an error posting:", error )

client = Client()
client.on_connect = on_connect
client.on_message = on_message


client.username_pw_set(getenv("USER"), getenv("PASSWORD"))
client.connect(getenv("HOST"), int(getenv("PORT")), 60)
client.loop_forever()