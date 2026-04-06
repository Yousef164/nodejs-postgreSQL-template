import { jest } from "@jest/globals";

const signupMock = jest.fn();
const loginMock = jest.fn();
const verifyEmailMock = jest.fn();

jest.unstable_mockModule("../../src/modules/auth/auth.service.js", () => ({
  default: {
    signup: signupMock,
    login: loginMock,
    verifyEmail: verifyEmailMock,
  },
}));

const { default: authController } =
  await import("../../src/modules/auth/auth.controller.js");

describe("authController unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns signup response when service succeeds", async () => {
    const req = {
      body: {
        username: "yousef",
        email: "yousef@example.com",
        password: "123456",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    signupMock.mockResolvedValue({
      status: 201,
      message: "User registered successfully",
    });

    await authController.signup(req, res, next);

    expect(signupMock).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith("User registered successfully");
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next with error when signup service throws", async () => {
    const req = { body: { username: "yousef" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const error = { status: 500, message: "Signup failed" };

    signupMock.mockRejectedValue(error);

    await authController.signup(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("returns login token when service succeeds", async () => {
    const req = { body: { email: "yousef@example.com", password: "123456" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    loginMock.mockResolvedValue({ status: 200, token: "signed-token" });

    await authController.login(req, res, next);

    expect(loginMock).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "signed-token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next with error when login service throws", async () => {
    const req = { body: { email: "yousef@example.com" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const error = { status: 400, message: "Invalid login" };

    loginMock.mockRejectedValue(error);

    await authController.login(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("returns email verification message when service succeeds", async () => {
    const req = { query: { token: "test-token" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    verifyEmailMock.mockResolvedValue({
      status: 200,
      message: "email verified",
    });

    await authController.verifyEmail(req, res, next);

    expect(verifyEmailMock).toHaveBeenCalledWith("test-token");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith("email verified");
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next with error when verifyEmail service throws", async () => {
    const req = { query: { token: "test-token" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const error = { status: 404, message: "Token invalid" };

    verifyEmailMock.mockRejectedValue(error);

    await authController.verifyEmail(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
