from src.core.exceptions import BadRequestException

class EmptyTextException(BadRequestException):
    def __init__(self):
        super().__init__(detail="Text cannot be empty.")

class MLComponentsNotLoadedException(BadRequestException):
    def __init__(self):
        super().__init__(detail="ML components are not fully loaded.")
