#not using right now

from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
import os

# Load environment variables from .env file
os.environ["TAVILY_API_KEY"] = "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"
api_key = os.environ.get("OPENAI_API_KEY")

# make tools
search = TavilySearchResults(max_results=2)

tools = [search]

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are very powerful botanist, and you will be given a plant name along with the current state of the plant, you are to return the plant name, and the diagnosis of the plant you come to through searching.",
        ),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)

llm = ChatOpenAI(api_key=api_key, model="gpt-4o")

llm_with_tools = llm.bind_tools(tools)

agent = (
    {
        "input": lambda x: x["input"],
        "agent_scratchpad": lambda x: format_to_openai_tool_messages(
            x["intermediate_steps"]
        ),
    }
    | prompt
    | llm_with_tools
    | OpenAIToolsAgentOutputParser()
)

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)