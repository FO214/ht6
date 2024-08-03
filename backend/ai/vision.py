import requests
import json
import os

# OpenAI API Key
api_key = os.environ.get("OPENAI_API_KEY")

import base64

def image_path_to_base64(image_path):
    """Convert an image file to a Base64-encoded string."""
    with open(image_path, "rb") as image_file:
        image_data = image_file.read()
        base64_encoded_data = base64.b64encode(image_data)
        base64_message = base64_encoded_data.decode('utf-8')
        return base64_message


def get_item(base64_image):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "gpt-4o",
        "messages": [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": "Here is a picture of a plant, please tell me what plant it is as well as describe the state of the plant, whether it looks dry, has scratches or marks, discolouration, and any other symptoms that mad point to a diagnosis, based on this health, as well as the plant's properties, give it a health point, attack, and defense stat, all ranging from 0-200, please reutrn the name, as well as the stats in json format, and only the json, don't include json markdown tags as well."
            },
            {
                "type": "image_url",
                "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}"
                }
            }
            ]
        }
        ],
        "max_tokens": 300
    }


    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    return json.loads(response.json()['choices'][0]['message']['content'])
