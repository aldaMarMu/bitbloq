import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

const exerciseSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    type Query {
      exercises: [Exercise]
      exercisesByDocument(document_father: String!): [Exercise]
      exerciseByID(id: String!): Exercise
    }
    type Mutation {
      createExercise(input: ExerciseIn!): Exercise
      updateExercise(id: String!, input: ExerciseIn!): Exercise
      deleteExercise(id: String!, code: String!): Exercise
    }

    scalar Date

    type Exercise {
      id: String
      document_father: String
      title: String
      code: String
      versions: [String]
      expireDate: String
      createdAt: Date
      updatedAt: Date
    }

    input ExerciseIn {
      id: String
      document_father: String
      title: String
      code: String
      versions: Version
      expireDate: String
    }

    input Version {
      id: String
      content: String
      date: String
    }
  `,
});

addMockFunctionsToSchema({ schema: exerciseSchema });
export default exerciseSchema;

// output Version {
//     id: String
//     content: String
//     date: String
//   }

//   output Submission {
//     id: String
//     student_nick: String
//     content: String
//     date: String
//     finished: Boolean
//     comment: String
//   }
