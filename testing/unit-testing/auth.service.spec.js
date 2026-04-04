import { jest } from "@jest/globals";

const bcryptMock = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const authModelMock = {
  create: jest.fn(),
  findOne: jest.fn(),
};

const verifyEmailMock = jest.fn();
const generateTokenMock = jest.fn();
const randomBytesMock = jest.fn();

jest.unstable_mockModule("bcrypt", () => ({
  default: bcryptMock,
}));
jest.unstable_mockModule("../../src/modules/auth/auth.model.js", () => ({
  default: authModelMock,
}));
jest.unstable_mockModule("../../src/utils/mailer.js", () => ({
  default: verifyEmailMock,
}));
jest.unstable_mockModule("../../src/utils/generateToken.js", () => ({
  default: generateTokenMock,
}));
jest.unstable_mockModule("crypto", () => ({
  default: {
    randomBytes: randomBytesMock,
  },
}));

const { default: authService } = await import("../../src/modules/auth/auth.service.js");

describe("authService unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hashes the password, creates the user, and sends verification email on signup", async () => {
    bcryptMock.hash.mockResolvedValue("hashed-password");
    randomBytesMock.mockReturnValue({
      toString: jest.fn().mockReturnValue("email-token"),
    });
    authModelMock.create.mockResolvedValue({
      username: "yousef",
      email: "yousef@example.com",
      emailToken: "email-token",
    });

    const result = await authService.signup({
      username: "yousef",
      email: "yousef@example.com",
      password: "123456",
    });

    expect(bcryptMock.hash).toHaveBeenCalledWith("123456", 10);
    expect(authModelMock.create).toHaveBeenCalledWith({
      username: "yousef",
      email: "yousef@example.com",
      password: "hashed-password",
      emailToken: "email-token",
    });
    expect(verifyEmailMock).toHaveBeenCalledWith(
      "yousef",
      "yousef@example.com",
      "email-token"
    );
    expect(result).toEqual({
      status: 201,
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  });

  it("returns a signed token on successful login", async () => {
    authModelMock.findOne.mockResolvedValue({
      password: "stored-hash",
      emailVerified: true,
      email: "yousef@example.com",
      _id: 7,
    });
    bcryptMock.compare.mockResolvedValue(true);
    generateTokenMock.mockReturnValue("signed-token");

    const result = await authService.login({
      email: "yousef@example.com",
      password: "123456",
    });

    expect(authModelMock.findOne).toHaveBeenCalledWith({
      where: { email: "yousef@example.com" },
    });
    expect(bcryptMock.compare).toHaveBeenCalledWith("123456", "stored-hash");
    expect(generateTokenMock).toHaveBeenCalledWith({
      password: "stored-hash",
      emailVerified: true,
      email: "yousef@example.com",
      _id: 7,
    });
    expect(result).toEqual({ status: 200, token: "signed-token" });
  });

  it("throws when the user does not exist during login", async () => {
    authModelMock.findOne.mockResolvedValue(null);

    await expect(
      authService.login({
        email: "missing@example.com",
        password: "123456",
      })
    ).rejects.toEqual({
      status: 400,
      message: "this user is not exist",
    });
  });

  it("verifies the email token and saves the user", async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    authModelMock.findOne.mockResolvedValue({
      emailVerified: false,
      emailToken: "email-token",
      save,
    });

    const result = await authService.verifyEmail("email-token");

    expect(authModelMock.findOne).toHaveBeenCalledWith({
      where: { emailToken: "email-token" },
    });
    expect(save).toHaveBeenCalled();
    expect(result.status).toBe(200);
  });
});
