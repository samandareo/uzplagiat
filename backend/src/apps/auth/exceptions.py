from src.core.exceptions import BadRequestException, NotFoundException

class UserAlreadyExistsException(BadRequestException):
    def __init__(self):
        super().__init__(detail="User with this email already exists")

class InvalidCredentialsException(BadRequestException):
    def __init__(self):
        super().__init__(detail="Incorrect email or password")

class UserNotFoundException(NotFoundException):
    def __init__(self):
        super().__init__(detail="User not found")
