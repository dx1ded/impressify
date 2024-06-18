import { capitalize } from "./utils"

describe("utils", () => {
  describe("capitalize", () => {
    test("capitalizes an all lowercase string", () => {
      expect(capitalize("hello")).toBe("Hello")
    })

    test("does not change an all uppercase string", () => {
      expect(capitalize("HELLO")).toBe("HELLO")
    })

    test("does not change a string with the first letter already uppercase", () => {
      expect(capitalize("Hello")).toBe("Hello")
    })
  })
})
