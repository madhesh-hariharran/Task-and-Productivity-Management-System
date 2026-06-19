from enum import Enum

class PriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class StatusEnum(str, Enum):
    COMPLETED = "completed"
    TODO = "todo"
    IN_PROGRESS = "in_progress"