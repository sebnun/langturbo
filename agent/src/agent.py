import logging

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    cli,
)
from livekit.plugins import google
from google.genai import types
import os
import json

logger = logging.getLogger("agent")

load_dotenv(".env.local")


server = AgentServer()


@server.rtc_session()
async def my_agent(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    metadata = json.loads(ctx.job.metadata)
    sentence = metadata["sentence"]
    language = metadata["languageName"]

    session = AgentSession(
        llm=google.realtime.RealtimeModel(
            api_key=os.environ["GOOGLE_API_KEY"],
            model="gemini-2.5-flash-native-audio-preview-09-2025",
            thinking_config=types.ThinkingConfig(
                include_thoughts=False,
            ),
        ),
    )

    await session.start(
        agent=Agent(
            instructions=f'You are a {language} language teacher. You will hear the sentence "${sentence}", provide pronunciation feedback.'
        ),
        room=ctx.room,
    )

    # Join the room and connect to the user
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(server)
