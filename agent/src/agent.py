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
import os

logger = logging.getLogger("agent")

load_dotenv(".env.local")


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a helpful voice AI assistant. The user is interacting with you via voice, even if you perceive the conversation as text.
            You eagerly assist users with their questions by providing information from your extensive knowledge.
            Your responses are concise, to the point, and without any complex formatting or punctuation including emojis, asterisks, or other symbols.
            You are curious, friendly, and have a sense of humor.""",
        )


server = AgentServer()


@server.rtc_session()
async def my_agent(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # TODO Can't pass a string as service account, use genai API key
    session = AgentSession(
        llm=google.realtime.RealtimeModel(
            api_key=os.environ['GEMINI_API_KEY'],

            model="gemini-live-2.5-flash-preview-native-audio-09-2025",
            voice="Puck",
            instructions="You are a helpful assistant",
        ),
    )


    await session.start(
        agent=Assistant(),
        room=ctx.room
    )

    # Join the room and connect to the user
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(server)
