def validate_query(query: str):

    banned = [
        "hack",
        "illegal",
        "exploit"
    ]

    for word in banned:
        if word in query.lower():
            return False

    return True