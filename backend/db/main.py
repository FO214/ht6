from pymongo.mongo_client import MongoClient
import certifi
import os
from dotenv import load_dotenv
load_dotenv()

#store server access string in var
uri = os.environ.get("MONGO_CONN_STR")
# Create a new client and connect to the server
cluster = MongoClient(uri, tls=True, tlsCAFile=certifi.where())

#pull all documents in collection
db = cluster["pokeplants"]
collection = db["users"]

# def update(id, dmg):
#     curr = collection.find_one({"_id": id})

#     curr["plants"][0]["CURR_HP"]-=dmg

#     collection.replace_one({"_id":id}, curr)  

#     return curr

def get_data(id):
    return collection.find_one({"_id":id})['plants'][0]

def get_hp(id):
    curr = collection.find_one({"_id":id})

    return curr['plants'][0]["HP"]

def get_atk(id):
    curr = collection.find_one({"_id":id})

    return curr['plants'][0]["ATK"]

def add_plant(usr_id, plant):
    curr = collection.find_one({"_id": usr_id})
    curr["plants"].append(plant)

    collection.replace_one({"_id":id}, curr)
    return curr