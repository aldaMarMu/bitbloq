import gql from "graphql-tag";

export const ME_QUERY = gql`
  query Me {
    me {
      admin
      avatar
      birthDate
      email
      id
      name
      publisher
      rootFolder
      socialLogin
      surnames
      teacher
    }
  }
`;

export const DOCUMENT_QUERY = gql`
  query Document($id: ObjectID!) {
    document(id: $id) {
      id
      type
      name
      description
      image {
        image
        isSnapshot
      }
      parentFolder
      parentsPath {
        id
        name
      }
      exercises {
        id
        code
        name
        acceptSubmissions
        createdAt
        submissions {
          id
          studentNick
          finished
          finishedAt
          type
          grade
          active
        }
      }
    }
  }
`;

export const EDIT_DOCUMENT_QUERY = gql`
  query Document($id: ObjectID!) {
    document(id: $id) {
      id
      type
      name
      description
      content
      image {
        image
        isSnapshot
      }
      public
      example
      advancedMode
      parentsPath {
        id
      }
      exercisesResources {
        id
        title
        type
      }
    }
  }
`;

export const OPEN_PUBLIC_DOCUMENT_QUERY = gql`
  query OpenPublicDocument($id: ObjectID!) {
    openPublicDocument(id: $id) {
      id
      type
      name
      description
      content
      image {
        image
        isSnapshot
      }
      public
      advancedMode
    }
  }
`;

export const DOCS_FOLDERS_PAGE_QUERY = gql`
  query documentsAndFolders(
    $currentLocation: ObjectID
    $currentPage: Number
    $itemsPerPage: Number
    $order: String
    $searchTitle: String
  ) {
    documentsAndFolders(
      currentLocation: $currentLocation
      currentPage: $currentPage
      itemsPerPage: $itemsPerPage
      order: $order
      searchTitle: $searchTitle
    ) {
      result {
        id
        name
        type
        createdAt
        updatedAt
        image
        parentFolder
      }
      parentsPath {
        id
        name
      }
      pagesNumber
      nFolders
    }
  }
`;

export const HAS_EXERCISES_QUERY = gql`
  query HasExercises($id: ObjectID!, $type: String) {
    hasExercises(id: $id, type: $type)
  }
`;

export const DOCUMENTS_QUERY = gql`
  query Documents {
    documents {
      id
      type
      name
      createdAt
      image {
        image
        isSnapshot
      }
    }
  }
`;

export const FOLDERS_QUERY = gql`
  query Folders {
    folders {
      id
      name
    }
  }
`;

export const ROOT_FOLDER_QUERY = gql`
  query RootFolder {
    rootFolder {
      id
      name
      documents {
        id
        type
        name
        createdAt
        image {
          image
          isSnapshot
        }
      }
      folders {
        id
        name
      }
    }
  }
`;

export const FOLDER_QUERY = gql`
  query folder($id: ObjectID!) {
    folder(id: $id) {
      id
      name
      parentFolder
      parentsPath {
        id
        name
      }
      folders {
        id
        name
      }
    }
  }
`;

export const EXAMPLES_QUERY = gql`
  query Examples {
    examples {
      id
      type
      name
      image {
        image
        isSnapshot
      }
    }
  }
`;

export const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument(
    $type: String!
    $name: String!
    $description: String
    $content: String
    $advancedMode: Boolean
    $parentFolder: ObjectID
    $image: DocImageIn
  ) {
    createDocument(
      input: {
        type: $type
        name: $name
        description: $description
        content: $content
        advancedMode: $advancedMode
        parentFolder: $parentFolder
        image: $image
      }
    ) {
      id
      type
    }
  }
`;

export const DUPLICATE_DOCUMENT_MUTATION = gql`
  mutation DuplicateDocument(
    $currentLocation: ObjectID
    $documentID: ObjectID!
    $itemsPerPage: Number
    $order: String
    $searchTitle: String
    $name: String!
  ) {
    duplicateDocument(
      currentLocation: $currentLocation
      documentID: $documentID
      itemsPerPage: $itemsPerPage
      order: $order
      searchTitle: $searchTitle
      name: $name
    ) {
      document {
        id
      }
      page
    }
  }
`;

export const CREATE_FOLDER_MUTATION = gql`
  mutation createFolder($input: FolderIn) {
    createFolder(input: $input) {
      id
    }
  }
`;

export const UPDATE_FOLDER_MUTATION = gql`
  mutation updateFolder($id: ObjectID!, $input: FolderIn) {
    updateFolder(id: $id, input: $input) {
      id
    }
  }
`;

export const DUPLICATE_FOLDER_MUTATION = gql`
  mutation duplicateFolder($id: ObjectID!) {
    duplicateFolder(id: $id) {
      id
    }
  }
`;

export const DELETE_FOLDER_MUTATION = gql`
  mutation deleteFolder($id: ObjectID!) {
    deleteFolder(id: $id) {
      id
    }
  }
`;

export const SET_DOCUMENT_IMAGE_MUTATION = gql`
  mutation SetDocumentImage(
    $id: ObjectID
    $image: Upload
    $isSnapshot: Boolean
  ) {
    setDocumentImage(id: $id, image: $image, isSnapshot: $isSnapshot) {
      id
    }
  }
`;

export const UPDATE_DOCUMENT_MUTATION = gql`
  mutation UpdateDocument(
    $id: ObjectID!
    $name: String
    $content: String
    $description: String
    $advancedMode: Boolean
    $parentFolder: ObjectID
  ) {
    updateDocument(
      id: $id
      input: {
        name: $name
        content: $content
        description: $description
        advancedMode: $advancedMode
        parentFolder: $parentFolder
      }
    ) {
      id
      type
      content
      image {
        image
        isSnapshot
      }
    }
  }
`;

export const DELETE_DOCUMENT_MUTATION = gql`
  mutation DeleteDocument($id: ObjectID!) {
    deleteDocument(id: $id) {
      id
    }
  }
`;

export const DOCUMENT_UPDATED_SUBSCRIPTION = gql`
  subscription OnDocumentUpdated {
    documentUpdated {
      id
    }
  }
`;

export const SUBMISSION_UPDATED_SUBSCRIPTION = gql`
  subscription OnSubmisisonUpdated($exercise: ObjectID!) {
    submissionUpdated(exercise: $exercise) {
      id
      active
    }
  }
`;

export const SUBMISSION_ACTIVE_SUBSCRIPTION = gql`
  subscription OnSubmissionActive($token: String!) {
    submissionActive(token: $token) {
      id
      active
    }
  }
`;

export const EXERCISE_QUERY = gql`
  query Exercise($id: ObjectID!) {
    exercise(id: $id) {
      id
      type
      name
      code
      teacherName
      content
      description
      image
      resources {
        file
        id
        thumbnail
        title
        type
      }
    }
  }
`;

export const EXERCISE_BY_CODE_QUERY = gql`
  query ExerciseByCode($code: String!) {
    exerciseByCode(code: $code) {
      id
      type
      teacherName
    }
  }
`;

export const EXERCISE_UPDATE_MUTATION = gql`
  mutation UpdateExercise($id: ObjectID!, $input: ExerciseIn) {
    updateExercise(id: $id, input: $input) {
      id
      type
      name
      code
      teacherName
      content
      description
      image
    }
  }
`;

export const EXERCISE_DELETE_MUTATION = gql`
  mutation DeleteExercise($id: ObjectID!) {
    deleteExercise(id: $id) {
      id
    }
  }
`;

export const CREATE_EXERCISE_MUTATION = gql`
  mutation CreateExercise($documentId: ObjectID!, $name: String!) {
    createExercise(input: { document: $documentId, name: $name }) {
      id
    }
  }
`;

export const SUBMISSION_QUERY = gql`
  query Submission($id: ObjectID!) {
    submission(id: $id) {
      document
      name
      exercise
      studentNick
      content
      grade
      teacherComment
    }
  }
`;

export const SUBMISSION_SET_GRADE = gql`
  mutation GradeSubmission(
    $submissionID: ObjectID
    $grade: Float
    $teacherComment: String
  ) {
    gradeSubmission(
      submissionID: $submissionID
      grade: $grade
      teacherComment: $teacherComment
    ) {
      studentNick
      content
      grade
      teacherComment
    }
  }
`;

export const DELETE_SUBMISSION_MUTATION = gql`
  mutation DeleteSubmission($id: ObjectID!) {
    deleteSubmission(submissionID: $id) {
      id
    }
  }
`;

export const CHANGE_SUBMISSION_STATE_MUTATION = gql`
  mutation ChangeSubmissionsState($id: ObjectID!, $subState: Boolean!) {
    changeSubmissionsState(id: $id, subState: $subState) {
      id
    }
  }
`;

export const STUDENT_SUBMISSION_QUERY = gql`
  query Submission {
    submission {
      id
      content
      grade
      teacherComment
    }
  }
`;

export const UPDATE_SUBMISSION_MUTATION = gql`
  mutation UpdateSubmission($content: String, $active: Boolean) {
    updateSubmission(input: { content: $content, active: $active }) {
      id
    }
  }
`;

export const SET_ACTIVESUBMISSION_MUTATION = gql`
  mutation SetActiveSubmission($submissionID: ObjectID!, $active: Boolean!) {
    setActiveSubmission(submissionID: $submissionID, active: $active) {
      id
      active
    }
  }
`;

export const UPDATE_PASSWORD_SUBMISSION_MUTATION = gql`
  mutation UpdatePasswordSubmission($id: ObjectID!, $password: String!) {
    updatePasswordSubmission(submissionID: $id, password: $password) {
      id
    }
  }
`;

export const FINISH_SUBMISSION_MUTATION = gql`
  mutation FinishSubmission($content: String!) {
    finishSubmission(content: $content) {
      id
    }
  }
`;

export const REMOVE_SUBMISSION_MUTATION = gql`
  mutation DeleteSubmission($submissionID: ObjectID!) {
    deleteSubmission(submissionID: $submissionID) {
      id
    }
  }
`;

export const UPLOAD_STL_MUTATION = gql`
  mutation uploadSTLFile($file: Upload!, $documentId: ObjectID) {
    uploadSTLFile(file: $file, documentID: $documentId) {
      id
      filename
      mimetype
      publicUrl
      document
    }
  }
`;

export const PUBLISH_DOCUMENT_MUTATION = gql`
  mutation publishDocument(
    $id: ObjectID!
    $public: Boolean
    $example: Boolean
  ) {
    publishDocument(id: $id, public: $public, example: $example) {
      id
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: EmailAddress!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const RESEND_WELCOME_EMAIL = gql`
  mutation ResendWelcomeEmail($email: String!) {
    resendWelcomeEmail(email: $email)
  }
`;

export const LOGIN_WITH_MICROSOFT = gql`
  mutation LoginWithMicrosoft($token: String!) {
    loginWithMicrosoft(token: $token) {
      id
      token
      finishedSignUp
    }
  }
`;

export const LOGIN_WITH_GOOGLE = gql`
  mutation LoginWithGoogle($token: String!) {
    loginWithGoogle(token: $token) {
      id
      token
      finishedSignUp
    }
  }
`;

export const CHECK_UPDATE_PASSWORD_TOKEN_MUTATION = gql`
  mutation CheckResetPasswordToken($token: String) {
    checkForgotPasswordToken(token: $token)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($email: EmailAddress!) {
    sendForgotPasswordEmail(email: $email)
  }
`;

export const UPDATE_FORGOT_PASSWORD_MUTATION = gql`
  mutation UpdatePassword($token: String, $newPassword: String) {
    updateForgotPassword(token: $token, newPassword: $newPassword)
  }
`;

export const START_SUBMISSION_MUTATION = gql`
  mutation StartSubmission(
    $studentNick: String!
    $exerciseCode: String!
    $password: String!
  ) {
    startSubmission(
      studentNick: $studentNick
      exerciseCode: $exerciseCode
      password: $password
    ) {
      token
      exerciseID
      type
    }
  }
`;

export const LOGIN_SUBMISSION_MUTATION = gql`
  mutation LoginSubmission(
    $studentNick: String!
    $exerciseCode: String!
    $password: String!
  ) {
    loginSubmission(
      studentNick: $studentNick
      exerciseCode: $exerciseCode
      password: $password
    ) {
      token
      exerciseID
      type
    }
  }
`;

export const SUBMISSION_SESSION_EXPIRES_SUBSCRIPTION = gql`
  subscription SubmissionSessionExpires {
    submissionSessionExpires {
      key
      secondsRemaining
      subToken
      expiredSession
      showSessionWarningSecs
    }
  }
`;

export const USER_SESSION_EXPIRES_SUBSCRIPTION = gql`
  subscription UserSessionExpires {
    userSessionExpires {
      key
      secondsRemaining
      authToken
      expiredSession
      showSessionWarningSecs
    }
  }
`;

/* Account */

export const UPDATE_USER_DATA_MUTATION = gql`
  mutation UpdateUserData($id: ObjectID!, $input: UpdateUserData!) {
    updateUserData(id: $id, input: $input) {
      id
    }
  }
`;
export const RENEW_SESSION_MUTATION = gql`
  mutation renewSession {
    renewSession
  }
`;

export const CHANGE_EMAIL_MUTATION = gql`
  mutation SendChangeMyEmailToken($newEmail: String!) {
    sendChangeMyEmailToken(newEmail: $newEmail)
  }
`;

export const CHECK_EMAIL_TOKEN_MUTATION = gql`
  mutation CheckTokenChangeEmail($token: String!) {
    checkTokenChangeEmail(token: $token)
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation UpdateMyPassword($currentPassword: String!, $newPassword: String!) {
    updateMyPassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      id
    }
  }
`;

export const CHANGE_PLAN_MUTATION = gql`
  mutation UpdateMyPlan($userPlan: String!) {
    updateMyPlan(userPlan: $userPlan)
  }
`;

export const CONFIRM_NEW_EMAIL = gql`
  mutation ConfirmChangeEmail($token: String!, $password: String!) {
    confirmChangeEmail(token: $token, password: $password)
  }
`;

export const DELETE_USER = gql`
  mutation DeleteMyUser($password: String!) {
    deleteMyUser(password: $password)
  }
`;

/* Cloud */

export const ADD_RESOURCE_TO_DOCUMENT = gql`
  mutation AddResourceToDocument($resourceID: ID!, $documentID: ID!) {
    addResourceToDocument(resourceID: $resourceID, documentID: $documentID) {
      filename
      id
      publicUrl
    }
  }
`;

export const ADD_RESOURCE_TO_EXERCISES = gql`
  mutation AddResourceToExercises($resourceID: ID!, $documentID: ID!) {
    addResourceToExercises(resourceID: $resourceID, documentID: $documentID) {
      id
    }
  }
`;

export const DELETE_RESOURCE_FROM_EXERCISES = gql`
  mutation DeleteResourceFromExercises($resourceID: ID!, $documentID: ID!) {
    deleteResourceFromExercises(
      resourceID: $resourceID
      documentID: $documentID
    ) {
      id
    }
  }
`;

export const GET_CLOUD_RESOURCES = gql`
  query CloudResources(
    $deleted: Boolean
    $currentPage: Number
    $order: String
    $searchTitle: String
    $type: [String]
  ) {
    cloudResources(
      deleted: $deleted
      currentPage: $currentPage
      order: $order
      searchTitle: $searchTitle
      type: $type
    ) {
      pagesNumber
      resources {
        createdAt
        deleted
        id
        file
        preview
        size
        thumbnail
        title
        type
      }
    }
  }
`;

export const MOVE_RESOURCE_TO_TRASH = gql`
  mutation MoveToTrash($id: ObjectID) {
    moveToTrash(id: $id) {
      id
    }
  }
`;

export const RESTORE_RESOURCE_FROM_TRASH = gql`
  mutation RestoreResource($id: ObjectID) {
    restoreResource(id: $id) {
      id
    }
  }
`;

export const UPLOAD_CLOUD_RESOURCE = gql`
  mutation UploadCloudResource($file: Upload!, $thumbnail: Upload) {
    uploadCloudResource(file: $file, thumbnail: $thumbnail) {
      id
    }
  }
`;

/* Signup */

export const ACTIVATE_ACCOUNT_MUTATION = gql`
  mutation ActivateAccount($token: String!) {
    activateAccount(token: $token)
  }
`;

export const FINISH_SIGNUP_MUTATION = gql`
  mutation FinishSignUp($id: String!, $userPlan: String!) {
    finishSignUp(id: $id, userPlan: $userPlan)
  }
`;

export const SAVE_BIRTH_DATE_MUTATION = gql`
  mutation SaveBirthDate($id: String!, $birthDate: Date!) {
    saveBirthDate(id: $id, birthDate: $birthDate) {
      id
    }
  }
`;

export const SAVE_USER_DATA_MUTATION = gql`
  mutation SaveUserData($input: UserIn!) {
    saveUserData(input: $input) {
      id
    }
  }
`;
