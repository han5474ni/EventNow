import os
import asyncio
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Slack API credentials
SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")

# Initialize Slack client
slack_client = WebClient(token=SLACK_BOT_TOKEN) if SLACK_BOT_TOKEN else None

async def list_channels():
    """List all channels in the workspace"""
    print("\n===== Listing Slack Channels =====\n")
    print(f"Using Slack token: {SLACK_BOT_TOKEN[:10]}...\n")
    
    try:
        if not slack_client:
            print("Slack client not initialized. Check your SLACK_BOT_TOKEN.")
            return
            
        # Get conversations list
        result = slack_client.conversations_list(types="public_channel,private_channel")
        channels = result["channels"]
        
        if channels:
            print(f"Found {len(channels)} channels:")
            for channel in channels:
                print(f"ID: {channel['id']} | Name: {channel['name']} | Is Member: {channel.get('is_member', False)}")
        else:
            print("No channels found")
            
        # Also list direct message channels (DMs)
        dm_result = slack_client.conversations_list(types="im")
        dms = dm_result["channels"]
        
        if dms:
            print(f"\nFound {len(dms)} direct message channels:")
            for dm in dms:
                # Get user info for the DM
                try:
                    user_info = slack_client.users_info(user=dm['user'])
                    user_name = user_info['user']['name']
                    print(f"ID: {dm['id']} | User: {user_name}")
                except SlackApiError:
                    print(f"ID: {dm['id']} | User ID: {dm['user']}")
        else:
            print("\nNo direct message channels found")
            
        print("\nTo use a channel in your tests, update the TEST_CHANNEL variable in test_slack_integration.py")
        print("Example: TEST_CHANNEL = \"C0XXXXXXXX\"  # Replace with the channel ID")
        
    except SlackApiError as e:
        print(f"Error listing channels: {e}")

if __name__ == "__main__":
    asyncio.run(list_channels())
