import { gql } from "./index";

it("returns the expected GraphQL query string", () => {
  const id = 12345;

  const query = gql`
    query {
      product(id: "${id}") {
        displayName
      }
    }
`;

  const expectedQuery = `
    query {
      product(id: "${id}") {
        displayName
      }
    }
`;

  expect(query).toEqual(expectedQuery);
});
