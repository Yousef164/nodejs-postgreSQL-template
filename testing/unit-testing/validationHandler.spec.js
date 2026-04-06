import { jest } from "@jest/globals";

const validationResultMock = jest.fn();

jest.unstable_mockModule("express-validator", () => ({
  validationResult: validationResultMock,
}));

const { default: validationHandler } =
  await import("../../src/middlewares/validationHandler.js");

describe("validationHandler unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls next when there are no validation errors", async () => {
    validationResultMock.mockReturnValue({ isEmpty: () => true });
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await validationHandler(req, res, next);

    expect(validationResultMock).toHaveBeenCalledWith(req);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("returns 422 with errors when validation fails", async () => {
    validationResultMock.mockReturnValue({
      isEmpty: () => false,
      array: jest
        .fn()
        .mockReturnValue([{ msg: "Required", param: "username" }]),
    });

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await validationHandler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: "Required", param: "username" }],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
