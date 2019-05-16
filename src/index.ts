interface StringCompatible {
  toString(): string;
}

export const gql = (str: TemplateStringsArray, ...values: StringCompatible[]) =>
  str.reduce((result, s, i) => `${result}${s}${values[i] || ""}`, "");

/*
const getProduct = (id: StringCompatible) => gql`
  query {
    product(id: "${id}") {
      displayName
    }
  }
`;
*/
