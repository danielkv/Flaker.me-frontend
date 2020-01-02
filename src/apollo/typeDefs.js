import gql from 'graphql-tag';

export default gql`
	type TempFile {
		id: ID!
		path: String!
		originalName: String!
		progress: Int!
		bytesCount: Int!
		size: Int!
		createdAt: Int!
		status: String!
	}

	extend type Query {
		tempFile(id: ID!): TempFile!
	}
`;