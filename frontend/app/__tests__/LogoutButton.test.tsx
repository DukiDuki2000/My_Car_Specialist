import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LogoutButton from "../components/LogoutButton";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LogoutButton", () => {
  let push: jest.Mock;

  beforeEach(() => {
    push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("usuwa dane użytkownika z localStorage i przekierowuje do login", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: /wyloguj się/i });
    fireEvent.click(button);

    expect(localStorage.removeItem).toHaveBeenCalledTimes(3);
    expect(localStorage.removeItem).toHaveBeenCalledWith("accessToken");
    expect(localStorage.removeItem).toHaveBeenCalledWith("username");
    expect(localStorage.removeItem).toHaveBeenCalledWith("role");

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/pages/auth/login");
  });
});
