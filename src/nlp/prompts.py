from langchain_core.prompts import PromptTemplate

CLASSIFICATION_TEMPLATE = """
You are an expert user experience researcher for Google Photos.
Your job is to read raw user feedback and identify precisely where their memory retrieval broke down when trying to find a photo.

We classify retrieval failures into three specific states:
1. Temporal Confusion: The user is confused about WHEN the photo was taken (e.g., they know the season but not the year).
2. Spatial Ambiguity: The user is confused about WHERE the photo was taken (e.g., they know it was a beach, but not which city).
3. Sensory Mismatch: The user is confused about visual attributes (e.g., they searched for a "red car" but the car in the photo is actually "maroon" or they remember an object that isn't actually there).
4. Unknown: If the failure state doesn't cleanly fit into the above.

Read the following user feedback:
"{user_feedback}"

Extract the following information:
1. failure_state: Which of the three states best describes the problem? (Output exactly: "Temporal Confusion", "Spatial Ambiguity", "Sensory Mismatch", or "Unknown")
2. metadata_deficit: What specific piece of information did the user forget or get wrong? (Keep it to 2-5 words, e.g., "Exact Year", "City Name", "Object Color")
3. memory_baseline: What specific piece of information did the user ACTUALLY remember? (Keep it to 2-5 words, e.g., "It was snowing", "Beach vacation", "Dog in background")

Format your response exactly as valid JSON with the keys: "failure_state", "metadata_deficit", "memory_baseline".
"""

classification_prompt = PromptTemplate(
    input_variables=["user_feedback"],
    template=CLASSIFICATION_TEMPLATE,
)
