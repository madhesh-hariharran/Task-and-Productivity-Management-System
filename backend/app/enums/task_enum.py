from enum import Enum

class PriorityEnum(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class StatusEnum(Enum):
    COMPLETED = "completed"
    TODO = "todo"
    IN_PROGRESS = "in_progress"