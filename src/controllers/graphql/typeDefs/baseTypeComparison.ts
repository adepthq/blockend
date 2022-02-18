import { gql } from 'apollo-server-express';

const inputComparisonTypeDefs = gql`
  """
  Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'.
  """
  input Boolean_comparison_exp {
    _eq: Boolean
    _gt: Boolean
    _gte: Boolean
    _in: [Boolean!]
    _is_null: Boolean
    _lt: Boolean
    _lte: Boolean
    _neq: Boolean
    _nin: [Boolean!]
  }

  """
  Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'.
  """
  input Int_comparison_exp {
    _eq: Int
    _gt: Int
    _gte: Int
    _in: [Int!]
    _is_null: Boolean
    _lt: Int
    _lte: Int
    _neq: Int
    _nin: [Int!]
  }

  """
  Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'.
  """
  input String_comparison_exp {
    _eq: String
    _gt: String
    _gte: String

    """
    does the column match the given case-insensitive pattern
    """
    _ilike: String
    _in: [String!]

    """
    does the column match the given POSIX regular expression, case insensitive
    """
    _iregex: String
    _is_null: Boolean

    """
    does the column match the given pattern
    """
    _like: String
    _lt: String
    _lte: String
    _neq: String

    """
    does the column NOT match the given case-insensitive pattern
    """
    _nilike: String
    _nin: [String!]

    """
    does the column NOT match the given POSIX regular expression, case insensitive
    """
    _niregex: String

    """
    does the column NOT match the given pattern
    """
    _nlike: String

    """
    does the column NOT match the given POSIX regular expression, case sensitive
    """
    _nregex: String

    """
    does the column NOT match the given SQL regular expression
    """
    _nsimilar: String

    """
    does the column match the given POSIX regular expression, case sensitive
    """
    _regex: String

    """
    does the column match the given SQL regular expression
    """
    _similar: String
  }

  """
  column ordering options
  """
  enum order_by {
    """
    in ascending order, nulls last
    """
    asc

    """
    in ascending order, nulls first
    """
    asc_nulls_first

    """
    in ascending order, nulls last
    """
    asc_nulls_last

    """
    in descending order, nulls first
    """
    desc

    """
    in descending order, nulls first
    """
    desc_nulls_first

    """
    in descending order, nulls last
    """
    desc_nulls_last
  }
`;

export default inputComparisonTypeDefs;
