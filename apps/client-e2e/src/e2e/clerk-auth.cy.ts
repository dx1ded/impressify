// describe("Signed out", () => {
//   beforeEach(() => {
//     cy.signOut()
//   })
//
//   it("should navigate to the main page in a signed out state", () => {
//     // open home page (which is accessible only if singed in)
//     cy.visit("http://localhost:4200/home")
//
//     cy.url().should("equal", "http://localhost:4200")
//   })
// })
//
// describe("Signed in", () => {
//   beforeEach(() => {
//     cy.session("signed-in", () => {
//       cy.signIn()
//     })
//   })
//
//   it("navigate to the home page", () => {
//     // open dashboard page
//     cy.visit("http://localhost:3000/home")
//
//     // checking if there is search input (which is only on home page)
//     cy.get("input[placeholder=Search]").should("exist")
//   })
// })
