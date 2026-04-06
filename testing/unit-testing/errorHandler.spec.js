import { jest } from "@jest/globals";

const { default: errorHandler } =
  await import("../../src/middlewares/errorHandler.js");

describe("errorHandler unit tests", () => {
  it("sends the error status and message when provided", () => {
    const err = { status: 418, message: "I am a teapot" };
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({ error: "I am a teapot" });
  });

  it("falls back to 500 for unknown errors", () => {
    const err = {};
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});
