from beanie import Document
from datetime import datetime

class GuestLimit(Document):
    ip_address: str
    count: int = 1
    last_checked: datetime = datetime.utcnow()

    class Settings:
        name = "guest_limits"
