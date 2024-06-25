/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    /**
     * Initialize auth to a state where you're
     * logged in as the test user.
     *
     * @example cy.initializeAuth()
     */
    signOut(): Chainable<void>
    signIn(): Chainable<void>
  }
}
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("signOut", () => {
  cy.log("sign out by clearing all cookies.")
  cy.clearCookies()
})

// Cypress.Commands.add("signIn", () => {
//   cy.log("Signing in.")
//   cy.visit("/")
//
//   cy.window()
//     .should((window) => {
//       expect(window).to.not.have.property("Clerk", undefined)
//       expect(window.Clerk.isReady()).to.eq(true)
//     })
//     .then(async (window) => {
//       cy.clearCookies()
//       const res = await window.Clerk.client.signIn.create({
//         identifier: "test@test.com",
//         password: "Test",
//       })
//
//       await window.Clerk.setActive({
//         session: res.createdSessionId,
//       })
//
//       cy.log("Finished Signing in.")
//     })
// })
