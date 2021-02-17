import dbm
import json
from twitchbot import *
import time

class Rosebot:


ADMINS = ["fendull", "kayerose15", "fizzyizzyuwu", "highlikeakite"]

def message_builder(message, response):
    idx = 0
    start_idx = 0
    end_idx = 0
    while idx < len(response):
        if response[idx] == "{":
            start_idx = idx
            while idx < len(response):
                if response[idx] == "}":
                    template = response[start_idx + 1: idx]
                    if template in message:
                        response = response[0:start_idx] + message[template] + response[idx + 1:]
                        idx = idx + len(message[template]) - (idx - start_idx + 1)
                    break
                idx = idx + 1
        idx = idx + 1                

    return response
    
def message_handler(message):

    #the chat message was a command
    if message['text'][0] == "!":
        command = message['text'].split(' ')[0][1:]
        split_message = message['text'].split(' ')
        for i in range(len(split_message)):
            message['arg'+ str(i)] = split_message[i]
        data = DataInterface()

        if command == "add" and message['sender'] in ADMINS:
            new_command = message['text'].split(' ')[1]
            new_response = " ".join(message['text'].split(' ')[2:])
            result = data.add_command(new_command, new_response)
            resp = "Command !{} added successfully".format(new_command)
            if result is False:
                resp = "Command !{} already exists".format(new_command)

            return {
                        "text": resp,
                        "channel": message['channel']
                    }

        elif command == "edit" and message['sender'] in ADMINS:
            new_command = message['text'].split(' ')[1]
            new_response = " ".join(message['text'].split(' ')[2:])
            result = data.edit_command(new_command, new_response)
            resp = "Command !{} edited successfully".format(new_command)
            if result is False:
                resp = "Command !{} does not exist".format(new_command)

            return {
                        "text": resp,
                        "channel": message['channel']
                    }

        elif command == "delete" and message['sender'] in ADMINS:
            new_command = message['text'].split(' ')[1]
            result = data.delete_command(new_command)
            resp = "Command !{} deleted successfully".format(new_command)
            if result is False:
                resp = "Command !{} does not exist".format(new_command)
            return {
                        "text": resp,
                        "channel": message['channel']
                    }

        else:
            resp = data.get_response(command)
            if resp is None:
                return {
                            "text": "Sorry, {} is not a command".format(command),
                            "channel": message['channel']
                        }
            else:
                return {
                            "text": message_builder(message, resp),
                            "channel": message['channel']
                        }



with TwitchBot(ACCESS_TOKEN, NICKNAME, message_handler=message_handler) as tb:
    tb.join_channel("fendull")
    while True:
        time.sleep(1000)
