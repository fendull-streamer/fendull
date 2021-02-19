import json
import boto3
import requests

def get_twitch_user(auth_token):
    return json.loads(requests.get("https://id.twitch.tv/oauth2/userinfo", headers={"Authorization": "Bearer {}".format(auth_token)}).content)["preferred_username"]


def lambda_handler(event, context):
    # TODO implement
    try:
        print(event['body'])
        data = json.loads(event['body'])
        print(data)
        user = get_twitch_user(data['accessToken'])
        print(user)
        if user != 'fendull':
            return {
                'statusCode': 400,
                'body': json.dumps('You are not authorized to save content')
            }
        content = data['content']
        ckey = data['key']
        client = boto3.client('s3')
        client.put_object(
            Bucket="fendull-cms",
            Body=content.encode('utf-8'),
            Key=ckey)
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps("Failed to write to S3")
        }
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
