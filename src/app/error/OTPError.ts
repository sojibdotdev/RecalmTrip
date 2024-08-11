export class OTPError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class OTPAlreadySentError extends OTPError {
  constructor() {
    super(
      'OTP has already been sent. Please wait for 2 minutes before requesting another one.'
    )
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
