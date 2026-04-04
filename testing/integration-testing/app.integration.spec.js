import { jest } from "@jest/globals";
import request from "supertest";

const authServiceMock = {
  signup: jest.fn(),
  login: jest.fn(),
  verifyEmail: jest.fn(),
};

jest.unstable_mockModule("../../src/modules/auth/auth.service.js", () => ({
  default: authServiceMock,
}));

const { default: app } = await import("../../src/app.js");

describe("App integration endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a healthy response from GET /health", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Server is healthy" });
  });

  it("returns 422 when signup payload is invalid", async () => {
    const response = await request(app).post("/auth/signup").send({});

    expect(response.status).toBe(422);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "username" }),
        expect.objectContaining({ path: "email" }),
        expect.objectContaining({ path: "password" }),
      ]),
    );
    expect(authServiceMock.signup).not.toHaveBeenCalled();
  });

  it("returns 201 when signup succeeds", async () => {
    authServiceMock.signup.mockResolvedValue({
      status: 201,
      message: "User registered successfully",
    });

    const response = await request(app).post("/auth/signup").send({
      username: "yousef",
      email: "yousef@example.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body).toBe("User registered successfully");
    expect(authServiceMock.signup).toHaveBeenCalledWith({
      username: "yousef",
      email: "yousef@example.com",
      password: "123456",
    });
  });

  it("returns a token when login succeeds", async () => {
    authServiceMock.login.mockResolvedValue({
      status: 200,
      token: "signed-token",
    });

    const response = await request(app).post("/auth/login").send({
      email: "yousef@example.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: "signed-token" });
    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: "yousef@example.com",
      password: "123456",
    });
  });

  it("returns verification response from GET /auth/verify-email", async () => {
    authServiceMock.verifyEmail.mockResolvedValue({
      status: 200,
      message: "email verified",
    });

    const response = await request(app).get(
      "/auth/verify-email?token=test-token",
    );

    expect(response.status).toBe(200);
    expect(response.body).toBe("email verified");
    expect(authServiceMock.verifyEmail).toHaveBeenCalledWith("test-token");
  });

  it("returns 404 for unknown routes", async () => {
    const response = await request(app).get("/missing-route");

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/Route not found/);
  });
});
