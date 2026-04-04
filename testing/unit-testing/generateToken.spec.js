import { jest } from "@jest/globals";

process.env.JWT_SECRET = "unit-test-secret";

const signMock = jest.fn();

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: signMock,
  },
}));

const { default: generateToken } = await import("../../src/utils/generateToken.js");

describe("generateToken unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("signs a jwt token with user id and email", () => {
    signMock.mockReturnValue("jwt-token");

    const result = generateToken({
      _id: 15,
      email: "yousef@example.com",
    });

    expect(signMock).toHaveBeenCalledWith(
      { id: 15, email: "yousef@example.com" },
      "unit-test-secret",
      { expiresIn: "1h" }
    );
    expect(result).toBe("jwt-token");
  });
});
